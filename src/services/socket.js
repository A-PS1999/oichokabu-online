import { io } from "socket.io-client";
import { serverAddress } from "../settings";

export const socketOwner = {
    current: io(serverAddress, { withCredentials: true, autoConnect: true })
}

export const refreshSocketConnection = () => {
    if (socketOwner.current) {
        socketOwner.current.close();
    }
    socketOwner.current = io.connect(serverAddress, { withCredentials: true, forceNew: true });
}