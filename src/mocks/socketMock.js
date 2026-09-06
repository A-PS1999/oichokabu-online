import { vi } from "vitest";
import { socketOwner } from "../services/socket";

const internals = vi.hoisted(() => {
    const state = {
        current: null,
        rejoinResponse: { ok: true },
    };

    class MockSocket {
        constructor() {
            this.connected = true;
            this.id = "mock-socket";
            this.io = {};
            this._listeners = new Map();
            queueMicrotask(() => this._dispatch("connect"));
        }

        on(event, listener) {
            if (!this._listeners.has(event)) {
                this._listeners.set(event, new Set());
            }
            this._listeners.get(event).add(listener);
            return this;
        }

        once(event, listener) {
            const wrap = (...args) => {
                this.off(event, wrap);
                listener(...args);
            };
            return this.on(event, wrap);
        }

        off(event, listener) {
            if (listener === undefined) {
                this._listeners.delete(event);
                return this;
            }
            this._listeners.get(event)?.delete(listener);
            return this;
        }

        emit(event, ...args) {
            if (event === "game:rejoin" || event === "pregame:rejoin") {
                const ack = args[args.length - 1];
                if (typeof ack === "function") {
                    ack(state.rejoinResponse);
                    return;
                }
            }
            return undefined;
        }

        _dispatch(event, ...args) {
            this._listeners.get(event)?.forEach((listener) => listener(...args));
        }

        connect() {
            this.connected = true;
            this._dispatch("connect");
        }

        close() {
            this.connected = false;
            this._dispatch("disconnect");
        }

        disconnect() {
            this.close();
        }
    }

    const createSocket = () => {
        state.current = new MockSocket();
        return state.current;
    };

    return { state, MockSocket, createSocket };
});

vi.mock("socket.io-client", () => ({
    io: () => internals.createSocket(),
}));

export const emitToClient = (event, ...args) => {
    internals.state.current?._dispatch(event, ...args);
};

export const setRejoinResponse = (ok, reason) => {
    internals.state.rejoinResponse = {
        ok,
        ...(reason ? { reason } : {}),
    };
};

export const resetSocketMock = () => {
    internals.state.current = null;
    internals.state.rejoinResponse = { ok: true };
    socketOwner.current = null;
};

export const getMockSocket = () => internals.state.current;