import Express from 'express';
import { getWeather, getWeatherDays, getWeatherPeriod } from '../controllers/weather';

const router = Express.Router();

router.get('/:location', getWeather);

router.get('/:location/:days', getWeatherDays);

router.get('/:location/:start/:end', getWeatherPeriod);

export default router;