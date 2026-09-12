import type { Socket } from 'socket.io';
import type { AckCallback, GameId, UserId, UserSocketMap } from '../types';

export const PreGameHandler = (preGameSockets: UserSocketMap) => {
    const broadcastToPregame = (gameId: GameId, fn: (socket: Socket, userId: UserId) => void): void => {
        const room = preGameSockets.get(gameId);
        if (!room) return;
        room.forEach((sockets, userId) => {
            sockets.forEach(socket => {
                if (socket.connected) fn(socket, userId);
            });
        });
    };

    const enterLobby = (gameId: GameId, userId: UserId, socket: Socket): void => {
        if (!preGameSockets.has(gameId)) {
            preGameSockets.set(gameId, new Map());
        }
        const room = preGameSockets.get(gameId);
        if (!room) {
            throw new Error(`No pregame room for ${gameId}`);
        }
        if (!room.has(userId)) room.set(userId, new Set());
        room.get(userId)?.add(socket);
        broadcastToPregame(gameId, (sock) => sock.emit(`pregame-lobby:${gameId}:enter-game`, gameId));
    };

    const rejoinPregame = (gameId: GameId, userId: UserId, socket: Socket, ack?: AckCallback): void => {
        enterLobby(gameId, userId, socket);
        socket.emit(`pregame-lobby:${gameId}:enter-game`, gameId);
        ack?.({ ok: true });
    };

    const leaveGame = (gameId: GameId, userId: UserId, username: string, hostStatus: boolean): void =>
        broadcastToPregame(gameId, (socket) =>
            socket.emit(`pregame-lobby:${gameId}:leave-game`, {
                gameId,
                userId,
                username,
                hostStatus,
            }),
        );

    const startGame = (gameId: GameId, userId: UserId, username: string): void =>
        broadcastToPregame(gameId, (socket) =>
            socket.emit(`pregame-lobby:${gameId}:start-game`, {
                gameId,
                userId,
                username,
            }),
        );

    const playerReady = (gameId: GameId, userId: UserId, username: string): void =>
        broadcastToPregame(gameId, (socket) =>
            socket.emit(`pregame-lobby:${gameId}:player-ready`, {
                gameId,
                userId,
                username,
            }),
        );

    const playerUnready = (gameId: GameId, userId: UserId, username: string): void =>
        broadcastToPregame(gameId, (socket) =>
            socket.emit(`pregame-lobby:${gameId}:player-unready`, {
                gameId,
                userId,
                username,
            }),
        );

    return {
        enterLobby,
        rejoinPregame,
        leaveGame,
        startGame,
        playerReady,
        playerUnready,
    };
};