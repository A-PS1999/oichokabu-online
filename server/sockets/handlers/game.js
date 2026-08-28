const game_engine = require('./../../game_logic');
const { Game } = require('./../../db/api');

const gameGlobals = new Map();
const ongoingGames = {};

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
        if (sample.general_data.currentTurn > sample.general_data.turnMax) {
            endGame(gameId);
            return;
        }

        broadcastToGame(gameId, (socket, userId) => {
            const data = game_engine.getGameData(state, userId);
            socket.emit(`game:${gameId}:update-game`, data);
        });
    };

    const startGame = async (gameId) => {
        if (ongoingGames[gameId]) return;
        try {
            await Game.runGame(gameId);
            const ok_users = await Game.getUserIdsAndUsernames(gameId);
            const constants = await Game.getGameConstants(gameId);
            gameGlobals.set(gameId, game_engine.start(ok_users, constants));
            ongoingGames[gameId] = {
                timer: setInterval(() => tickGame(gameId), 1000),
            };
        } catch (error) {
            console.error('startGame failed', error);
        }
    };

    const endGame = (gameId) => {
        const game = ongoingGames[gameId];
        if (!game) return;

        clearInterval(game.timer);
        delete ongoingGames[gameId];

        broadcastToGame(gameId, (socket, _userId) => socket.emit(`game:${gameId}:end-game`));

        gameGlobals.delete(gameId);
        gameSockets.delete(gameId);
        Game.endGame(gameId).catch(err => console.error('endGame DB', err));
    };

    const updateGame = (gameId, _) => {
        broadcastToGame(gameId, (socket, userId) => {
            const data = game_engine.getGameData(gameGlobals.get(gameId), userId);
            socket.emit(`game:${gameId}:update-game`, data);
        });
    };

    const rejoinGame = async (gameId, userId, socket, ack) => {
        const gameStatus = await Game.getStatus(gameId);
        if (gameStatus === 'ended') {
            socket.emit(`game:${gameId}:end-game`);
            return ack?.({ ok: false, reason: 'GAME_ENDED' });
        }
        if (gameStatus === 'started') {
            setGameSockets(gameId, userId, socket);
            return ack?.({ ok: true });
        }
        setGameSockets(gameId, userId, socket);
        const data = game_engine.getGameData(gameGlobals.get(gameId), userId);
        socket.emit(`game:${gameId}:update-game`, data);
        ack?.({ ok: true });
    };

    const pickDealerCardSelected = (gameId, userId, cardId, cardVal) => {
        const choiceInfo = { userId, cardId, cardVal };
        game_engine.pushPickDealerCardSelection(gameGlobals.get(gameId), choiceInfo);
        broadcastToGame(gameId, (socket, uid) => {
            socket.emit(`game:${gameId}:pickdealer-card-selected`, { userId, cardId, cardVal });
        });
    };

    const cardBetMade = (gameId, userId, cardId, ownerColumn, betAmount) => {
        const betInfo = { userId, cardId, ownerColumn, betAmount };
        game_engine.pushCardBet(gameGlobals.get(gameId), betInfo);
        broadcastToGame(gameId, (socket, uid) => {
            socket.emit(`game:${gameId}:card-bet-made`, { userId, cardId });
        });
    };

    const thirdCardChoice = (gameId, userId, choiceMade, isDealer) => {
        if (!isDealer) {
            game_engine.handleOptionalThirdPlayerCard(gameGlobals.get(gameId), userId, choiceMade);
        }
        if (isDealer) {
            game_engine.handleOptionalThirdDealerCard(gameGlobals.get(gameId), choiceMade);
        }
        broadcastToGame(gameId, (socket, uid) => {
            const data = game_engine.getGameData(gameGlobals.get(gameId), uid);
            socket.emit(`game:${gameId}:update-game`, data);
        });
    };

    const removePlayer = (gameId, userId) => {
        const game = gameGlobals.get(gameId);
        if (game) game_engine.handleRemovePlayer(game, userId);
        Game.removePlayer(gameId, userId).then(_ => {
            broadcastToGame(gameId, (socket, uid) => {
                const data = game_engine.getGameData(gameGlobals.get(gameId), uid);
                socket.emit(`game:${gameId}:update-game`, data);
            });
        });
    };

    return {
        setGameSockets,
        pickDealerCardSelected,
        cardBetMade,
        thirdCardChoice,
        startGame,
        updateGame,
        rejoinGame,
        removePlayer,
        endGame,
    };
};