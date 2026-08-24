import { io } from "socket.io-client";
import { serverAddress } from "../settings";

export const socketOwner = { current: null };

export const getSocket = () => {
    if (!socketOwner.current) {
        socketOwner.current = io(serverAddress, {
            withCredentials: true,
            autoConnect: true,
        });
    }
    return socketOwner.current;
};

export const refreshSocketConnection = () => {
    if (socketOwner.current) {
        socketOwner.current.close();
        socketOwner.current = null;
    }
    return getSocket();
};