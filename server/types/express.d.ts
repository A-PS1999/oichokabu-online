import type { PlayerInstance, UserInstance } from '../db/types';

declare global {
    namespace Express {
        interface User extends UserInstance {}

        interface Locals {
            user: UserInstance;
            player: PlayerInstance;
        }

        interface Application {
            sockets: typeof import('../sockets');
        }
    }
}

declare module 'http' {
    interface IncomingMessage {
        session?: import('express-session').Session & Partial<import('express-session').SessionData>;
    }
}

declare module 'express-session' {
    interface SessionData {
        passport?: { user?: Express.User };
    }
}

export {};