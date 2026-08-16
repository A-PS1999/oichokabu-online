import { useRef } from "react";
import { socketOwner } from "../services";

export const useSocket = () => {
    const socketRef = useRef(socketOwner.current);
    return socketRef.current;
}