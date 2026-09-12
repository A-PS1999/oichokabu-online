import type { Socket } from 'socket.io';
import game_engine from '../../game_logic';
import type { GameState, NewCardBet } from '../../game_logic/types';
import { Game } from '../../db/api';
import type { AckCallback, GameId, UserId, UserSocketMap } from '../types';

const gameGlobals = new Map<GameId, GameState | null>();
const ongoingGames: Record<GameId, { timer: NodeJS.Timeout; timers: NodeJS.Timeout[]; advanceScheduled: boolean }> = {};
const HEARTBEAT_MS = 5000;

export const GameHandler = (gameSockets: UserSocketMap) => {
    const broadcastToGame = (gameId: GameId, fn: (socket: Socket, userId: UserId) => void): void => {
        const room = gameSockets.get(gameId);
        if (!room) return;
        room.forEach((sockets, userId) => {
            sockets.forEach(socket => {
                if (socket.connected) fn(socket, userId);
            });
        });
    };

    const setGameSockets = (gameId: GameId, userId: UserId, socket: Socket): void => {
        if (!gameSockets.has(gameId)) {
            gameSockets.set(gameId, new Map());
            gameGlobals.set(gameId, null);
        }
        const room = gameSockets.get(gameId);
        if (!room) {
            throw new Error(`No game room for ${gameId}`);
        }
        if (!room.has(userId)) room.set(userId, new Set());
        room.get(userId)?.add(socket);
    };

    const broadcastState = (gameId: GameId): void => {
        const state = gameGlobals.get(gameId);
        if (!state) return;
        broadcastToGame(gameId, (socket, userId) => {
            const data = game_engine.getGameData(state, userId);
            socket.emit(`game:${gameId}:update-game`, data);
        });
    };

    const advance = (gameId: GameId): void => {
        const state = gameGlobals.get(gameId);
        if (!state) return;
        if (!state.phaseDurationMs) return;
        if (state.phaseEnteredAt + state.phaseDurationMs > Date.now()) return;
        game_engine.advance(state);
        enforceBusts(gameId);
        if (state.currentPhase === 'endGame') {
            endGame(gameId);
            return;
        }
        broadcastState(gameId);
    };

    const enforceBusts = (gameId: GameId): void => {
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

    const schedule = (gameId: GameId): void => {
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

    const syncGame = (gameId: GameId): void => {
        broadcastState(gameId);
        schedule(gameId);
    };

    const tickGame = (gameId: GameId): void => {
        const state = gameGlobals.get(gameId);
        if (!state) return;

        const room = gameSockets.get(gameId);
        if (!room || room.size === 0) {
            endGame(gameId);
            return;
        }

        const sampleUserId = room.keys().next().value;
        if (sampleUserId === undefined) {
            endGame(gameId);
            return;
        }
        const sample = game_engine.getGameData(state, sampleUserId);
        if (sample.general_data.currentTurn > sample.general_data.turnMax || state.currentPhase === 'endGame') {
            endGame(gameId);
            return;
        }

        broadcastState(gameId);
        advance(gameId);
    };

    const startGame = async (gameId: GameId): Promise<void> => {
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

    const endGame = (gameId: GameId): void => {
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

    const updateGame = (gameId: GameId, _userId: UserId): void => {
        broadcastState(gameId);
    };

    const rejoinGame = async (gameId: GameId, userId: UserId, socket: Socket, ack?: AckCallback): Promise<void> => {
        const gameStatus = await Game.getStatus(gameId);
        if (gameStatus === 'ended') {
            socket.emit(`game:${gameId}:end-game`);
            return ack?.({ ok: false, reason: 'GAME_ENDED' });
        }
        const state = gameGlobals.get(gameId);
        if (state && !state.players.some(player => player.id === userId)) {
            socket.emit(`game:${gameId}:end-game`);
            return ack?.({ ok: false, reason: 'NOT_IN_GAME' });
        }
        if (gameStatus === 'started') {
            setGameSockets(gameId, userId, socket);
            return ack?.({ ok: true });
        }
        setGameSockets(gameId, userId, socket);
        if (state) {
            const data = game_engine.getGameData(state, userId);
            socket.emit(`game:${gameId}:update-game`, data);
        }
        ack?.({ ok: true });
    };

    const pickDealerCardSelected = (gameId: GameId, userId: UserId, cardId: number): void => {
        const state = gameGlobals.get(gameId);
        if (!state) return;
        const choiceInfo = game_engine.pushPickDealerCardSelection(state, { userId, cardId });
        if (!choiceInfo) return;
        broadcastToGame(gameId, (socket, _uid) => {
            socket.emit(`game:${gameId}:pickdealer-card-selected`, { userId, cardId, cardVal: choiceInfo.cardVal });
        });
        syncGame(gameId);
    };

    const cardBetMade = (gameId: GameId, userId: UserId, cardId: number, ownerColumn: number, betAmount: number): void => {
        const state = gameGlobals.get(gameId);
        if (!state) return;
        const betInfo: NewCardBet = { userId, cardId, ownerColumn, betAmount };
        game_engine.pushCardBet(state, betInfo);
        broadcastToGame(gameId, (socket, _uid) => {
            socket.emit(`game:${gameId}:card-bet-made`, { userId, cardId });
        });
        syncGame(gameId);
    };

    const thirdCardChoice = (gameId: GameId, userId: UserId, choiceMade: 'yes' | 'no', isDealer: boolean): void => {
        const state = gameGlobals.get(gameId);
        if (!state) return;
        if (!isDealer) {
            game_engine.handleOptionalThirdPlayerCard(state, userId, choiceMade);
        }
        if (isDealer) {
            game_engine.handleOptionalThirdDealerCard(state, choiceMade);
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