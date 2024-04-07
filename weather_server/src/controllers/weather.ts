import { Request, Response } from 'express';

import { Roles } from '../types/types';
import { WeatherRecord } from '../types/types';
import { Weather } from '../models/weatherModel';
import { isAfter, isBefore } from 'date-fns';
import axios, { AxiosResponse } from 'axios';

const FORECAST_URL = 'http://localhost:5001';

/**
 * Gets past weather conditions for a specific location.
 * @param req
 * @param res
 */
export const getWeather = async (req: Request, res: Response) => {
    const { location } = req.params;
    const userRole = req.userRole.role;

    const weatherData: WeatherRecord[] = await Weather.aggregate([
        { $match: { 'location.name': location } },
        { $sort: { 'forecast.forecastday.date_epoch': -1 } },
        { $unwind: '$forecast.forecastday' },
        { $group: { _id: '$location.name', location: { $first: '$location' }, forecast: { $push: '$forecast.forecastday' } } },
    ]);

    if (!weatherData[0]) {
        res.status(400).json({ message: 'Location not found' });
        return;
    }

    if (
        weatherData[0].location.country !== 'Portugal' &&
        userRole === Roles.FREE
    ) {
        res.status(404).json({
            message:
                'Your role does not have permission to access this city. Consider upgrading your membership',
        });
        return;
    }

    res.json(weatherData[0]);
}

/**
 * Gets a summary of the weather conditions for a specific location for the past {days} days.
 * /weather/location/{days}
 * @param req
 * @param res
 */
export const getWeatherDays = async (req: Request, res: Response) => {
    const days = Number.parseInt(req.params.days);
    const location = req.params.location;
    const userRole = req.userRole.role;

    if (!(days > 0 && days <= 4)) {
        res.status(400).json({
            message:
                'Invalid number of days. We only support looking up to 4 days in the past',
        });
        return;
    }

    const weatherData: WeatherRecord[] = await Weather.aggregate([
        { $match: { 'location.name': location } },
        { $sort: { 'forecast.forecastday.date_epoch': -1 } },
        { $limit: days },
        { $unwind: '$forecast.forecastday' },
        { $group: { _id: '$location.name', location: { $first: '$location' }, forecast: { $push: '$forecast.forecastday' } } },
    ]);

    if (!weatherData[0]) {
        res.status(400).json({ message: 'Location not found' });
        return;
    }

    if (
        weatherData[0].location.country !== 'Portugal' &&
        userRole === Roles.FREE
    ) {
        res.status(404).json({
            message:
                'Your role does not have permission to access this city. Consider upgrading your membership',
        });
        return;
    }

    res.json(weatherData[0]);
}

/**
 * Gets the weather conditions for a specific location for a specific period of time in the past.
 * @param req
 * @param res
 */
export const getWeatherPeriod = async (req: Request, res: Response) => {
    const userRole = req.userRole.role;
    if (userRole === Roles.FREE) {
        res.status(404).json({
            message:
                'Your role does not have permission to access this endpoint. Consider upgrading your membership',
        });
        return;
    }

    const { location, start, end } = req.params;
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (
        !(
            isAfter(startDate, new Date(2023, 10, 19)) &&
            isBefore(endDate, new Date(2023, 10, 25))
        )
    ) {
        res.status(400).json({
            message: 'We currently only support looking at weather data from 2023-11-20 to 2023-11-24',
        });
        return;
    }

    if (startDate > endDate) {
        res.status(400).json({
            message: 'The start date cannot be after the end date',
        });
        return;
    }
    
    var weatherData: WeatherRecord[] = await Weather.aggregate([
        { $match: { 'location.name': location } },
        { $sort: { 'forecast.forecastday.date_epoch': -1 } },
        { $unwind: '$forecast.forecastday' },
        { $group: { _id: '$location.name', location: { $first: '$location' }, forecast: { $push: '$forecast.forecastday' } } },
        {
            $project: {
                location: 1,
                forecast: {
                    $filter: {
                        input: '$forecast',
                        as: 'item',
                        cond: {
                            $and: [
                                {
                                    $gte: [
                                        '$$item.date_epoch',
                                        startDate.getTime() / 1000,
                                    ],
                                },
                                {
                                    $lte: [
                                        '$$item.date_epoch',
                                        endDate.getTime() / 1000,
                                    ],
                                },
                            ],
                        },
                    },
                },
            },
        },
    ]);

    if (!weatherData[0]) {
        res.status(400).json({ message: 'Location not found' });
        return;
    }

    if (isAfter(endDate, new Date(2023, 10, 23))) {
        const accessToken = req.headers.authorization?.split(' ')[1];
        await axios
            .get(FORECAST_URL + `/forecast/${location}/2023-11-24/${end}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            .then((response: AxiosResponse) => {
                weatherData[0].forecast = response.data[0].forecast.concat(weatherData[0].forecast);
            })
            .catch((error: any) => {
                res.status(error.response.status).json({
                    message: error.response.data.message,
                });
                return;            
            });
    }

    res.json(weatherData[0]);
}