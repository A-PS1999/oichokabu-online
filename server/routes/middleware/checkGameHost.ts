import type { NextFunction, Request, Response } from 'express';

export const checkGameHost = (_request: Request, response: Response, next: NextFunction) => {
    return response.locals.player.getGame().then(game => {
        const status: string = game.status;
        if (response.locals.player.host && status !== 'closed') {
            return next();
        } else {
            return response.status(401).json({
                errorMsg: 'You are not the host, or the game has ended.',
            });
        }
    });
};