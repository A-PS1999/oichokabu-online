import { useRef } from 'react';
import type { Socket } from 'socket.io-client';
import { getSocket } from '../services';

export const useSocket = (): Socket => {
    const socketRef = useRef<Socket>(getSocket());
    return socketRef.current;
};
