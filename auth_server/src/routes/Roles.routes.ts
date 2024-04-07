import Express from 'express';
import { authenticate } from '../middlewares/authorization';
import { getUserRole } from '../controllers/roleController';

const RoleRouter = Express.Router();

/**
 * @route   /role/
 * @method  GET
 */
RoleRouter.get('/', authenticate, getUserRole);

export { RoleRouter };
