import type { NextFunction, Request, Response } from 'express';

export const checkLoggedIn = (request: Request, response: Response, next: NextFunction): null => {
    const user = request.user;
    if (request.isAuthenticated() && user) {
        response.locals.user = user;
        next();
    } else {
        response.status(401).json({
            errorMsg: 'You are not authenticated. Please log in.',
        });
    }

    return null;
};