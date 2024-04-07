# RBAC - Weather and Forecast Web App

## Service 1: Weather Service

-   `GET` /weather/{location}: Retrieves past weather conditions for a specific location.
-   `GET` /weather/{location}/{days}: Retrieves weather conditions for a specific location for the past {days} days.
-   `GET` /weather/{location}/{start}/{end}: Retrieves the weather conditions for a specific location for a specific period of time in the past.

## Service 2: Forecast Service

-   `GET` /forecast/{location}: Retrieves the weather forecast for a specific location for the next 10 days.
-   `GET` /forecast/{location}/{days}: Retrieves a summary of the weather forecast for a specific location for the next {days} days.
-   `GET` /forecast/{location}/{start}/{end}: Retrieves the forecast conditions for a specific location for a specific period of time.

## Calls

| Weather Service | Calls                                   |
| --------------- | --------------------------------------- |
| Endpoint 1      | -                                       |
| Endpoint 2      | Can call Endpoint 1 of Forecast Service |
| Endpoint 3      | Can call Endpoint 1 of Forecast Service |

## Roles

| Role         | Service 1 | Service 2 | Locations            |
| ------------ | --------- | --------- | -------------------- |
| User         | 1,2       | 1,2       | cities               |
| Premium User | 1,2,3     | 1,2,3     | cities               |
| Admin        | 1,2,3     | 1,2,3     | cities and countries |

## Auth server endpoints

Server running on port 5000.

| Authentication (/auth)                               | Roles (/role) | Refresh Token (/refreshToken) |
| ---------------------------------------------------- | ------------- | ----------------------------- |
| `POST` /register (body: email, name, password, role) | `GET` /       | `GET` /                       |
| `POST` /login (body: email, password)                |               |                               |

## Architecture

![architecture](./architecture.png 'Web App Architecture')

## OAuth 2.0

![Architecture using OAuth 2.0](./oauth.png 'OAuth 2.0')
