import { Router } from 'express';
import { checkLoggedIn } from './middleware/checkLoggedIn';
import { checkGamePlayer } from './middleware/checkGamePlayer';
import { checkGameHost } from './middleware/checkGameHost';
import { PreGame as PreGameDB } from '../db/api';
import { Lobby as LobbySockets, PreGameLobby as PreGameSockets } from '../sockets';

const router = Router();

router.get('/api/pregame-lobby/:gameId/player-info', (request, response) =>
    PreGameDB.getPlayers(Number(request.params.gameId))
        .then(result => response.json(result))
        .catch(error => response.json({ error })),
);

router.get('/api/pregame-lobby/:gameId/player-status', checkLoggedIn, (request, response) =>
    PreGameDB.getPlayerStatuses(Number(request.params.gameId))
        .then(result => response.json(result))
        .catch(error => response.json({ error })),
);

router.post('/api/pregame-lobby/:gameId/join-game', checkLoggedIn, (request, response) => {
    const gameId = Number(request.params.gameId);
    const userId = response.locals.user.id;
    const username = response.locals.user.username;
    return PreGameDB.joinGame(gameId, userId)
        .then(result => {
            LobbySockets.joinGame(gameId, userId, username);
            return response.json(result);
        })
        .catch(error => console.log(error));
});

router.post('/api/pregame-lobby/:gameId/leave-game', checkLoggedIn, checkGamePlayer, (request, response) => {
    const gameId = Number(request.params.gameId);
    const hostStatus = response.locals.player.host;
    const userId = response.locals.user.id;
    const username = response.locals.user.username;
    return PreGameDB.exitGame(gameId, userId)
        .then(result => {
            LobbySockets.leaveGame(gameId, userId, username);
            PreGameSockets.leaveGame(gameId, userId, username, hostStatus);
            return response.json(result);
        })
        .catch(error => console.log(error));
});

router.post('/api/pregame-lobby/:gameId/start-game', checkLoggedIn, checkGamePlayer, checkGameHost, (request, response) => {
    const gameId = Number(request.params.gameId);
    const userId = response.locals.user.id;
    const username = response.locals.user.username;
    return PreGameDB.setGameReady(gameId)
        .then(readyResult => {
            if (readyResult.ready) {
                return PreGameDB.setGameStarted(gameId).then(() => {
                    LobbySockets.startGame(gameId, userId, username);
                    PreGameSockets.startGame(gameId, userId, username);
                    return response.json({ message: readyResult.status });
                });
            } else {
                return response.json({ message: readyResult.status });
            }
        })
        .catch(error => response.json({ error }));
});

router.post('/api/pregame-lobby/:gameId/toggle-ready', checkLoggedIn, checkGamePlayer, (request, response) => {
    const gameId = Number(request.params.gameId);
    const userId = response.locals.user.id;
    const username = response.locals.user.username;
    return PreGameDB.togglePlayerReady(gameId, userId).then(result => {
        const player = result[1][0];
        if (player?.ready) {
            PreGameSockets.playerReady(gameId, userId, username);
        } else {
            PreGameSockets.playerUnready(gameId, userId, username);
        }

        return response.sendStatus(200);
    })
        .catch(error => console.log(error));
});

export default router;