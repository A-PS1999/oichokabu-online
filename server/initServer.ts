import './checkEnv';
import app from './index';
import { init } from './sockets';
import { createServer } from 'node:http';

const httpServer = createServer(app);
const PORT = Number(process.env.PORT) || 5000;

init(httpServer);

httpServer.listen(PORT);
httpServer.on('listening', () => {
    console.log(`Listening on port ${PORT}`);
});