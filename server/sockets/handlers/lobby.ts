import type { Socket } from 'socket.io';
import type { GameId, SocketMeta, UserId } from '../types';

export const LobbyHandler = (socketMeta: Map<string, SocketMeta>) => {
    const emitAll = (event: string, data: unknown): void =>
        socketMeta.forEach(({ socket }) => {
            if (socket.connected) socket.emit(event, data);
        });

    return {
        createGame: (gameId: GameId, userId: UserId, username: string, roomName: string, playerCap: number, turnMax: number, betMax: number): void =>
            emitAll('lobby:create-game', {
                gameId,
                userId,
                username,
                roomName,
                playerCap,
                turnMax,
                betMax,
            }),
        joinGame: (gameId: GameId, userId: UserId, username: string): void =>
            emitAll('lobby:join-game', { gameId, userId, username }),
        leaveGame: (gameId: GameId, userId: UserId, username: string): void =>
            emitAll('lobby:leave-game', { gameId, userId, username }),
        startGame: (gameId: GameId, userId: UserId, username: string): void =>
            emitAll('lobby:start-game', { gameId, userId, username }),
        endGame: (gameId: GameId, userId: UserId, username: string): void =>
            emitAll('lobby:end-game', { gameId, userId, username }),
    };
};