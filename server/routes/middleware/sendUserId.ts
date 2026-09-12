import type { Request, Response } from 'express';

export const sendUserId = (_request: Request, response: Response): null => {
    const id = response.locals.user.id;
    const host = response.locals.player;
    response.json({ id, host });
    return null;
};