import { io, type Socket } from 'socket.io-client';
import { serverAddress } from '../settings';

export const socketOwner: { current: Socket | null } = { current: null };

export const getSocket = (): Socket => {
    if (!socketOwner.current) {
        socketOwner.current = io(serverAddress, {
            withCredentials: true,
            autoConnect: true,
        });
    }
    return socketOwner.current;
};

export const refreshSocketConnection = (): Socket => {
    if (socketOwner.current) {
        socketOwner.current.close();
        socketOwner.current = null;
    }
    return getSocket();
};
