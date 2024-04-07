import { Router } from 'express';

import { AuthRouter } from './Auth.routes';
import { RefreshRouter } from './Refresh.routes';
import { RoleRouter } from './Roles.routes';

const router = Router();

router.use('/refreshToken', RefreshRouter);

router.use('/auth', AuthRouter);

router.use('/role', RoleRouter);

// router.use('/service1', Service1Router);

// router.use('/service2', Service2Router);

export { router };
