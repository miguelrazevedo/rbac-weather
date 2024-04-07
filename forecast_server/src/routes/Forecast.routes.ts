import Express from 'express';
import {
    getForecast,
    getForecastBetween,
    getForecastDays,
} from '../controllers/forecast';

const router = Express.Router();

router.get('/:location', getForecast);

router.get('/:location/:days', getForecastDays);

router.get('/:location/:start/:end', getForecastBetween);

export default router;
