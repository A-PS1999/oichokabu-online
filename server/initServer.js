if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set. Please set it in your .env file.");
    process.exit(1);
}

let app = require('./index');
let { init: SocketInit } = require('./sockets');
const { createServer } = require('http');
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

SocketInit(httpServer);

httpServer.listen(PORT);
httpServer.on('listening', onListen)

function onListen() {
    console.log(`Listening on port ${PORT}`)
}