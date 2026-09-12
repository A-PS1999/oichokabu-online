import type { NextFunction, Request, Response } from 'express';

export const checkNotLoggedIn = (request: Request, response: Response, next: NextFunction): null => {
    if (!request.isAuthenticated()) {
        next();
    } else {
        response.sendStatus(404);
    }
    return null;
};