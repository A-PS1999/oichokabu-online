import type { Socket } from 'socket.io';

export type UserId = number;
export type GameId = number;

export type SocketMeta = {
    socket: Socket;
    userId: UserId;
};

export type UserSocketMap = Map<GameId, Map<UserId, Set<Socket>>>;

export type AckResponse = {
    ok: boolean;
    reason?: string;
};

export type AckCallback = (response: AckResponse) => void;