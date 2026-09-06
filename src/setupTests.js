import { server } from "./mocks/server";
import "./mocks/socketMock";
import '@testing-library/jest-dom/vitest';
import { afterEach, afterAll } from 'vitest';
import { resetSocketMock } from './mocks/socketMock';

server.listen({ onUnhandledRequest: 'warn' });

afterEach(() => {
    server.resetHandlers();
    resetSocketMock();
});
afterAll(() => server.close());