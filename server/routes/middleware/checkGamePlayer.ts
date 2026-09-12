import { Auth } from '../../db/api';
import type { NextFunction, Request, Response } from 'express';

export const checkGamePlayer = (request: Request, response: Response, next: NextFunction) => {
    const userId = request.user?.id;
    if (userId === undefined) {
        return response.status(401).json({ error: 'NOT_IN_GAME' });
    }

    return Auth.findPlayer(Number(request.params.gameId), userId)
        .then(result => {
            if (result) {
                response.locals.player = result;
                next();
                return result;
            } else {
                return response.status(401).json({ error: 'NOT_IN_GAME' });
            }
        })
        .catch(error => {
            return response.json({ error });
        });
};