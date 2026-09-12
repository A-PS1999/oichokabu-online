import path from 'node:path';
import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import session from './db/session';
import * as sockets from './sockets';
import { passport } from './passport';
import routes from './routes';

const app = express();
const repoRoot = path.resolve(__dirname, '..', '..');

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));

app.use(express.static(path.join(repoRoot, 'public/cards')));
app.use(express.static(path.join(repoRoot, 'build')));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session);
app.sockets = sockets;

app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

app.get(/(.*)/, function (req, res) {
    res.sendFile(path.join(repoRoot, 'public/index.html'));
});

app.use(function (req, res) {
    res.status(404).send('Unable to find requested resource');
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    req.logout((logoutError: unknown) => {
        if (logoutError) { return next(logoutError); }
    });
    console.error(err.stack);
    res.status(err.status || 500).send(err.message);
});

export default app;