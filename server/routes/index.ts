import { Router } from 'express';
import authRoute from './authRoute';
import lobbyRoute from './lobbyRoute';
import preGameRoute from './preGameRoute';
import gameRoute from './gameRoute';

const router = Router();

router.use(authRoute);
router.use(lobbyRoute);
router.use(preGameRoute);
router.use(gameRoute);

export default router;