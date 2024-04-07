import Express from 'express';
import { handleRefreshToken } from '../controllers/refreshTokenController';

const RefreshRouter = Express.Router();

/**
 * @route   /refreshToken
 * @method  GET
 */
RefreshRouter.get('/', handleRefreshToken);

export { RefreshRouter };
