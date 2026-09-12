const game_engine = require('./../../game_logic');
const { Game } = require('./../../db/api');

const gameGlobals = new Map();
const ongoingGames = {};
const HEARTBEAT_MS = 5000;

module.exports = (gameSockets) => {
    const broadcastToGame = (gameId, fn) => {
        const room = gameSockets.get(gameId);
        if (!room) return;
        room.forEach((sockets, userId) => {
            sockets.forEach(socket => {
                if (socket.connected) fn(socket, userId);
            });
        });
    };

    const setGameSockets = (gameId, userId, socket) => {
        if (!gameSockets.has(gameId)) {
            gameSockets.set(gameId, new Map());
            gameGlobals.set(gameId, null);
        }
        const room = gameSockets.get(gameId);
        if (!room.has(userId)) room.set(userId, new Set());
        room.get(userId).add(socket);
    };

    const broadcastState = (gameId) => {
        const state = gameGlobals.get(gameId);
        if (!state) return;
        broadcastToGame(gameId, (socket, userId) => {
            const data = game_engine.getGameData(state, userId);
            socket.emit(`game:${gameId}:update-game`, data);
        });
    };

    // Timed-phase expiry entry point. Guards against double-firing from the
    // scheduled timer racing the slow heartbeat.
    const advance = (gameId) => {
        const state = gameGlobals.get(gameId);
        if (!state) return;
        if (!state.phaseDurationMs) return;
        if ((state.phaseEnteredAt + state.phaseDurationMs) > Date.now()) return;
        game_engine.advance(state);
        enforceBusts(gameId);
        if (state.currentPhase === 'endGame') {
            endGame(gameId);
            return;
        }
        broadcastState(gameId);
    };

    // Server-side bust enforcement: consumes Game.pendingBusts (set by the
    // engine when advancing out of roundResults) and performs the IO side —
    // DB membership removal, chip persistence, and targeted notifications.
    // The engine has already removed busted players from in-memory state.
    const enforceBusts = (gameId) => {
        const state = gameGlobals.get(gameId);
        if (!state || !state.pendingBusts || state.pendingBusts.length === 0) return;
        const busted = state.pendingBusts;
        state.pendingBusts = [];
        const gameEnding = state.currentPhase === 'endGame';
        for (const { userId, username, chips } of busted) {
            if (!gameEnding) {
                broadcastToGame(gameId, (socket, uid) => {
                    if (uid === userId) socket.emit(`game:${gameId}:player-busted`, { userId, username, chips });
                });
            }
            Game.removePlayer(gameId, userId).catch(err => console.error('remove busted player DB', err));
            Game.updateChipsBulk([{ player_userid: userId, new_chips: chips }])
                .catch(err => console.error('persist chips at bust', err));
        }
    };

    // Schedules one advance per timed-phase window for a game.
    const schedule = (gameId) => {
        const game = ongoingGames[gameId];
        const state = gameGlobals.get(gameId);
        if (!game || game.advanceScheduled) return;
        if (!state || !state.phaseDurationMs) return;
        game.advanceScheduled = true;
        const timerId = setTimeout(() => {
            game.timers = game.timers.filter(id => id !== timerId);
            game.advanceScheduled = false;
            advance(gameId);
        }, state.phaseDurationMs);
        game.timers.push(timerId);
    };

    const syncGame = (gameId) => {
        broadcastState(gameId);
        schedule(gameId);
    };

    const tickGame = (gameId) => {
        const state = gameGlobals.get(gameId);
        if (!state) return;

        const room = gameSockets.get(gameId);
        if (!room || room.size === 0) {
            endGame(gameId);
            return;
        }

        const sampleUserId = room.keys().next().value;
        const sample = game_engine.getGameData(state, sampleUserId);
        if (sample.general_data.currentTurn > sample.general_data.turnMax || state.currentPhase === 'endGame') {
            endGame(gameId);
            return;
        }

        broadcastState(gameId);
        advance(gameId);
    };

    const startGame = async (gameId) => {
        if (ongoingGames[gameId]) return;
        try {
            await Game.runGame(gameId);
            const ok_users = await Game.getUserIdsAndUsernames(gameId);
            const constants = await Game.getGameConstants(gameId);
            gameGlobals.set(gameId, game_engine.start(ok_users, constants));
            ongoingGames[gameId] = {
                timer: setInterval(() => tickGame(gameId), HEARTBEAT_MS),
                timers: [],
                advanceScheduled: false,
            };
        } catch (error) {
            console.error('startGame failed', error);
        }
    };

    const endGame = (gameId) => {
        const game = ongoingGames[gameId];
        if (!game) return;

        const state = gameGlobals.get(gameId);

        clearInterval(game.timer);
        game.timers.forEach(clearTimeout);
        delete ongoingGames[gameId];

        broadcastToGame(gameId, (socket, _userId) => socket.emit(`game:${gameId}:end-game`));

        if (state) {
            Game.updateChipsBulk(state.players.map(player => ({
                player_userid: player.id,
                new_chips: player.chips,
            }))).catch(err => console.error('persist chips at endGame', err));
        }

        gameGlobals.delete(gameId);
        gameSockets.delete(gameId);
        Game.endGame(gameId).catch(err => console.error('endGame DB', err));
    };

    const updateGame = (gameId, _) => {
        broadcastState(gameId);
    };

    const rejoinGame = async (gameId, userId, socket, ack) => {
        const gameStatus = await Game.getStatus(gameId);
        if (gameStatus === 'ended') {
            socket.emit(`game:${gameId}:end-game`);
            return ack?.({ ok: false, reason: 'GAME_ENDED' });
        }
        const state = gameGlobals.get(gameId);
        if (state && !state.players.some(player => player.id === userId)) {
            // Player has been removed (e.g. busted) and may not rejoin.
            socket.emit(`game:${gameId}:end-game`);
            return ack?.({ ok: false, reason: 'NOT_IN_GAME' });
        }
        if (gameStatus === 'started') {
            setGameSockets(gameId, userId, socket);
            return ack?.({ ok: true });
        }
        setGameSockets(gameId, userId, socket);
        const data = game_engine.getGameData(state, userId);
        socket.emit(`game:${gameId}:update-game`, data);
        ack?.({ ok: true });
    };

    const pickDealerCardSelected = (gameId, userId, cardId) => {
        const state = gameGlobals.get(gameId);
        if (!state) return;
        const choiceInfo = game_engine.pushPickDealerCardSelection(state, { userId, cardId });
        if (!choiceInfo) return;
        broadcastToGame(gameId, (socket, uid) => {
            socket.emit(`game:${gameId}:pickdealer-card-selected`, { userId, cardId, cardVal: choiceInfo.cardVal });
        });
        syncGame(gameId);
    };

    const cardBetMade = (gameId, userId, cardId, ownerColumn, betAmount) => {
        const betInfo = { userId, cardId, ownerColumn, betAmount };
        game_engine.pushCardBet(gameGlobals.get(gameId), betInfo);
        broadcastToGame(gameId, (socket, uid) => {
            socket.emit(`game:${gameId}:card-bet-made`, { userId, cardId });
        });
        syncGame(gameId);
    };

    const thirdCardChoice = (gameId, userId, choiceMade, isDealer) => {
        if (!isDealer) {
            game_engine.handleOptionalThirdPlayerCard(gameGlobals.get(gameId), userId, choiceMade);
        }
        if (isDealer) {
            game_engine.handleOptionalThirdDealerCard(gameGlobals.get(gameId), choiceMade);
        }
        syncGame(gameId);
    };

    return {
        setGameSockets,
        pickDealerCardSelected,
        cardBetMade,
        thirdCardChoice,
        startGame,
        updateGame,
        rejoinGame,
        endGame,
    };
};