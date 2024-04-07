/**
 * Global packages
 */
declare global {
    namespace Express {
        interface Request {
            userRole: UserRoleResponse;
        }
    }
}

export type UserRoleResponse = {
    message: string;
    userId: string;
    role: string;
};

export enum Roles {
    ADMIN = 'admin',
    FREE = 'free',
    PREMIUM = 'premium',
}

export type WeatherRecord = {
    location: Location;
    forecast: Day[];
};

type Location = {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    tz_id: string;
    localtime_epoch: number;
    localtime: string;
};

type Day = {
    date: string;
    date_epoch: number;
    day: {
        maxtemp_c: number;
        maxtemp_f: number;
        mintemp_c: number;
        mintemp_f: number;
        avgtemp_c: number;
        avgtemp_f: number;
        maxwind_mph: number;
        maxwind_kph: number;
        totalprecip_mm: number;
        totalprecip_in: number;
        totalsnow_cm: number;
        avgvis_km: number;
        avgvis_miles: number;
        avghumidity: number;
        daily_will_it_rain: number;
        daily_chance_of_rain: number;
        daily_will_it_snow: number;
        daily_chance_of_snow: number;
        condition: {
            text: string;
            icon: string;
            code: number;
        };
        uv: number;
    };
    astro: {
        sunrise: string;
        sunset: string;
        moonrise: string;
        moonset: string;
        moon_phase: string;
        moon_illumination: number;
        is_moon_up: number;
        is_sun_up: number;
    };
};
