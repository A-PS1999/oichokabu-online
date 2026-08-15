module.exports = (preGameSockets) => {
    const broadcastToPregame = (gameId, fn) => {
        const room = preGameSockets.get(gameId);
        if (!room) return;
        room.forEach((sockets, userId) => {
            sockets.forEach(socket => {
                if (socket.connected) fn(socket, userId);
            });
        });
    };

    const enterLobby = (gameId, userId, socket) => {
        if (!preGameSockets.has(gameId)) {
            preGameSockets.set(gameId, new Map());
        }
        const room = preGameSockets.get(gameId);
        if (!room.has(userId)) room.set(userId, new Set());
        room.get(userId).add(socket);
        broadcastToPregame(gameId, (sock) => sock.emit(`pregame-lobby:${gameId}:enter-game`, gameId));
    };

    const rejoinPregame = (gameId, userId, socket, ack) => {
        enterLobby(gameId, userId, socket);
        socket.emit(`pregame-lobby:${gameId}:enter-game`, gameId);
        ack?.({ ok: true });
    };

    const leaveGame = (gameId, userId, username, hostStatus) =>
        broadcastToPregame(gameId, (socket) =>
            socket.emit(`pregame-lobby:${gameId}:leave-game`, {
                gameId,
                userId,
                username,
                hostStatus,
            }),
        );

    const startGame = (gameId, userId, username) =>
        broadcastToPregame(gameId, (socket) =>
            socket.emit(`pregame-lobby:${gameId}:start-game`, {
                gameId,
                userId,
                username,
            }),
        );

    const playerReady = (gameId, userId, username) =>
        broadcastToPregame(gameId, (socket) =>
            socket.emit(`pregame-lobby:${gameId}:player-ready`, {
                gameId,
                userId,
                username,
            }),
        );

    const playerUnready = (gameId, userId, username) =>
        broadcastToPregame(gameId, (socket) =>
            socket.emit(`pregame-lobby:${gameId}:player-unready`, {
                gameId,
                userId,
                username,
            }),
        );

    return {
        enterLobby,
        rejoinPregame,
        leaveGame,
        startGame,
        playerReady,
        playerUnready,
    };
};