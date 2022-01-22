import { io } from "socket.io-client";
import { serverAddress } from "../settings";

export let socket = io(serverAddress, {
    withCredentials: true,
    autoConnect: true,
});

export const refreshSocketConnection = () => {
    socket.close();
    socket = io.connect(serverAddress, { withCredentials: true, forceNew: true });
}