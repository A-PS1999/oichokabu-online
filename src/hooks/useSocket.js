import { useRef } from "react";
import { getSocket } from "../services";

export const useSocket = () => {
    const socketRef = useRef(getSocket());
    return socketRef.current;
}