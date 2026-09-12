import type { Socket } from 'socket.io';
import { Server } from 'socket.io';
import session from '../db/session';
import { LobbyHandler, PreGameHandler, GameHandler } from './handlers';
import type { GameId, SocketMeta, UserId } from './types';

const io = new Server();

export const init = (server: Parameters<Server['attach']>[0]): void => {
    io.attach(server, {
        cors: {
            origin: process.env.CORS_ORIGIN,
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });

    io.engine.use(session);
};

const socketMetadata = new Map<string, SocketMeta>();
const userSockets = new Map<UserId, Set<string>>();
const gameSockets = new Map<GameId, Map<UserId, Set<Socket>>>();
const preGameSockets = new Map<GameId, Map<UserId, Set<Socket>>>();

const gameHandler = GameHandler(gameSockets);
const preGameHandler = PreGameHandler(preGameSockets);
const lobbyHandler = LobbyHandler(socketMetadata);

io.on('connection', socket => {
    const passport = socket.request.session?.passport;
    if (!passport || !passport.user) {
        socket.disconnect();
        return;
    }

    const userId = Number(passport.user);
    socketMetadata.set(socket.id, { socket, userId });
    if (!userSockets.has(userId)) {
        userSockets.set(userId, new Set());
    }
    userSockets.get(userId)?.add(socket.id);

    socket.on('game:rejoin', ({ gameId }, ack) => gameHandler.rejoinGame(Number(gameId), userId, socket, ack));
    socket.on('pregame:rejoin', ({ gameId }, ack) =>
        preGameHandler.rejoinPregame(Number(gameId), userId, socket, ack),
    );

    socket.on('disconnect', () => {
        socketMetadata.delete(socket.id);
        userSockets.get(userId)?.delete(socket.id);

        gameSockets.forEach((room, gameId) => {
            const userSocketsInRoom = room.get(userId);
            if (userSocketsInRoom) {
                userSocketsInRoom.delete(socket);
                if (userSocketsInRoom.size === 0) room.delete(userId);
            }
            if (room.size === 0) {
                gameHandler.endGame(gameId);
            }
        });
        preGameSockets.forEach(room => {
            const userSocketsInRoom = room.get(userId);
            if (userSocketsInRoom) {
                userSocketsInRoom.delete(socket);
                if (userSocketsInRoom.size === 0) room.delete(userId);
            }
        });
    });
});

export {
    gameHandler as Game,
    lobbyHandler as Lobby,
    preGameHandler as PreGameLobby,
};