import { Request, Response } from 'express';

import { ForecastRecord, Roles } from '../types/types';
import { Forecast } from '../models/forecastRecordModel';

import { differenceInDays, isAfter, isBefore } from 'date-fns';

/**
 * Gets the weather forecast for a specific location for the next 10 days.
 * @param req
 * @param res
 */
export const getForecast = async (req: Request, res: Response) => {
    const { location } = req.params;
    const userRole = req.userRole.role;

    const forecastData = await Forecast.findOne({
        'location.name': location,
    });

    if (!forecastData) {
        res.status(400).json({ message: 'Location not found' });
        return;
    }

    if (
        forecastData.location.country !== 'Portugal' &&
        userRole === Roles.FREE
    ) {
        res.status(404).json({
            message:
                'Your role does not have permission to access this city. Consider upgrading your membership',
        });
        return;
    }

    res.json(forecastData);
};

/**
 * Gets a summary of the weather forecast for a specific location for the next {days} days.
 * /forecast/Location/{days}
 * @param req
 * @param res
 */
export const getForecastDays = async (req: Request, res: Response) => {
    const days = Number.parseInt(req.params.days);
    const location = req.params.location;
    const userRole = req.userRole.role;

    if (!(days > 0 && days <= 10)) {
        res.status(400).json({
            message:
                'Invalid number of days. It must be between 1 and 10 (included)',
        });
        return;
    }

    const forecastData = await Forecast.findOne(
        {
            'location.name': location,
        },
        { forecast: { $slice: days } }
    );

    if (!forecastData) {
        res.status(400).json({ message: 'Location not found' });
        return;
    }

    if (
        forecastData.location.country !== 'Portugal' &&
        userRole === Roles.FREE
    ) {
        res.status(404).json({
            message:
                'Your role does not have permission to access this city. Consider upgrading your membership',
        });
        return;
    }

    res.json(forecastData);
};

/**
 * Gets the forecast conditions for a specific location for a specific period of time.
 * @param req
 * @param res
 */
export const getForecastBetween = async (req: Request, res: Response) => {
    // Route only accessible for premium and admin users
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

    const differenceDays = differenceInDays(endDate, startDate);

    if (differenceDays > 10) {
        res.status(400).json({
            message: 'Invalid number of days. It has to be 10 days maximum',
        });
        return;
    }

    if (
        !(
            isAfter(startDate, new Date(2023, 10, 23)) &&
            isBefore(endDate, new Date(2023, 11, 4))
        )
    ) {
        res.status(400).json({
            message: 'The dates are not available in the DB',
        });
        return;
    }

    const agg = [
        {
            $project: {
                location: 1,
                current: 1,
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
        {
            $match: {
                'location.name': {
                    $eq: location,
                },
            },
        },
    ];

    const forecastData = await Forecast.aggregate(agg);

    if (!forecastData || forecastData.length === 0) {
        res.status(400).json({ message: 'Location not found' });
        return;
    }

    res.json(forecastData);
};
