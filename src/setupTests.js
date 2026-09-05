import { server } from "./mocks/server";
import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';
import { EventEmitter } from 'events';

vi.mock('socket.io-client', () => {
    const mockSocket = new EventEmitter();
    mockSocket.connect = vi.fn();
    mockSocket.close = vi.fn();
    mockSocket.disconnect = vi.fn();
    const io = vi.fn(() => mockSocket);
    return { default: io, io };
});

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());