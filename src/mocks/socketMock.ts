import { vi } from 'vitest';
import { socketOwner } from '../services/socket';

type Listener = (...args: unknown[]) => void;

type RejoinResponse = {
    ok: boolean;
    reason?: string;
};

type MockSocketLike = {
    _dispatch: (event: string, ...args: unknown[]) => void;
};

type MockState = {
    current: MockSocketLike | null;
    rejoinResponse: RejoinResponse;
};

const internals = vi.hoisted(() => {
    const state: MockState = {
        current: null,
        rejoinResponse: { ok: true },
    };

    class MockSocket {
        connected = true;
        id = 'mock-socket';
        io = {};
        private _listeners = new Map<string, Set<Listener>>();

        constructor() {
            queueMicrotask(() => this._dispatch('connect'));
        }

        on(event: string, listener: Listener): this {
            if (!this._listeners.has(event)) {
                this._listeners.set(event, new Set());
            }
            this._listeners.get(event)?.add(listener);
            return this;
        }

        once(event: string, listener: Listener): this {
            const wrap: Listener = (...args) => {
                this.off(event, wrap);
                listener(...args);
            };
            return this.on(event, wrap);
        }

        off(event: string, listener?: Listener): this {
            if (listener === undefined) {
                this._listeners.delete(event);
                return this;
            }
            this._listeners.get(event)?.delete(listener);
            return this;
        }

        emit(event: string, ...args: unknown[]): undefined {
            if (event === 'game:rejoin' || event === 'pregame:rejoin') {
                const ack = args[args.length - 1];
                if (typeof ack === 'function') {
                    (ack as (response: RejoinResponse) => void)(state.rejoinResponse);
                }
            }
            return undefined;
        }

        _dispatch(event: string, ...args: unknown[]): void {
            this._listeners.get(event)?.forEach((listener) => listener(...args));
        }

        connect(): void {
            this.connected = true;
            this._dispatch('connect');
        }

        close(): void {
            this.connected = false;
            this._dispatch('disconnect');
        }

        disconnect(): void {
            this.close();
        }
    }

    const createSocket = (): MockSocketLike => {
        state.current = new MockSocket();
        return state.current;
    };

    return { state, MockSocket, createSocket };
});

vi.mock('socket.io-client', () => ({
    io: () => internals.createSocket(),
}));

export const emitToClient = (event: string, ...args: unknown[]): void => {
    internals.state.current?._dispatch(event, ...args);
};

export const setRejoinResponse = (ok: boolean, reason?: string): void => {
    internals.state.rejoinResponse = {
        ok,
        ...(reason ? { reason } : {}),
    };
};

export const resetSocketMock = (): void => {
    internals.state.current = null;
    internals.state.rejoinResponse = { ok: true };
    socketOwner.current = null;
};

export const getMockSocket = (): MockSocketLike | null => internals.state.current;
