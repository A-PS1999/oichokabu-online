checkEnvVariables();

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

function checkEnvVariables() {
    const requiredEnvVars = ['DATABASE_URL', 'SESSION_SECRET', 'CORS_ORIGIN'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
        console.error("Missing environment variables: " + missingVars.join(", "));
        process.exit(1);
    }
}