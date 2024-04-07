import { Schema, model } from 'mongoose';
import { WeatherRecord } from '../types/types';

const location = new Schema({
    name: String,
    region: String,
    country: String,
    lat: Number,
    lon: Number,
    tz_id: String,
    localtime_epoch: Number,
    localtime: String,
});

const day = new Schema({
    date: String,
    date_epoch: Number,
    day: {
        maxtemp_c: Number,
        maxtemp_f: Number,
        mintemp_c: Number,
        mintemp_f: Number,
        avgtemp_c: Number,
        avgtemp_f: Number,
        maxwind_mph: Number,
        maxwind_kph: Number,
        totalprecip_mm: Number,
        totalprecip_in: Number,
        totalsnow_cm: Number,
        avgvis_km: Number,
        avgvis_miles: Number,
        avghumidity: Number,
        daily_will_it_rain: Number,
        daily_chance_of_rain: Number,
        daily_will_it_snow: Number,
        daily_chance_of_snow: Number,
        condition: {
            text: String,
            icon: String,
            code: Number,
        },
        uv: Number,
    },
    astro: {
        sunrise: String,
        sunset: String,
        moonrise: String,
        moonset: String,
        moon_phase: String,
        moon_illumination: Number,
        is_moon_up: Number,
        is_sun_up: Number,
    },
});

const forecastday = {
    forecastday: [day],
};

const weatherschema = new Schema<WeatherRecord>({
    location: location,
    forecast: [day],
});

const Weather = model<WeatherRecord>('Weather', weatherschema);

export { Weather };