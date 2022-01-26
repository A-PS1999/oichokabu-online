let app = require('./index');
let { init: SocketInit } = require('./sockets');
const { createServer } = require('http');
const httpServer = createServer(app);
const SERVER_PORT = process.env.SERVER_PORT || 5000;

SocketInit(httpServer);

httpServer.listen(SERVER_PORT);
httpServer.on('listening', onListen)

function onListen() {
    console.log(`Listening on port ${SERVER_PORT}`)
}