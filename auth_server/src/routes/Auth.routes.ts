import Express from 'express';
import {
    deleteUser,
    getAllUsers,
    loginUser,
    logout,
    registerUser,
    revalidateAccessToken,
} from '../controllers/authController';
import { checkAdmin } from '../middlewares/adminOnly';
import { authenticate } from '../middlewares/authorization';

const AuthRouter = Express.Router();

/**
 * @route   /auth/register
 * @method  POST
 */
AuthRouter.post('/register', authenticate, registerUser);

/**
 * @route   /auth/login
 * @method  POST
 */
AuthRouter.post('/login', loginUser);

/**
 * @route   /auth/logout
 * @method  POST
 */
AuthRouter.post('/logout', logout);

/**
 * @route   /auth/newAccessToken
 * @method  GET
 */
AuthRouter.get('/newAccessToken', revalidateAccessToken);

/**
 * @route   /auth/all
 * @method  GET
 */
AuthRouter.get('/all', authenticate, checkAdmin, getAllUsers);

/**
 * @route   /auth/:id
 * @method  DELETE
 */

AuthRouter.delete('/:id', authenticate, checkAdmin, deleteUser);

export { AuthRouter };
