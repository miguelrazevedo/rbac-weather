/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext, useEffect, useState } from 'react';
import { AuthContext, UserContext } from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { AxiosError, AxiosResponse } from 'axios';
import { Day, WeatherRecord, Roles } from '../types/types';
import { OtherCities, PortugueseCities } from '../constants';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';

const FREE_MIN = '2023-11-21';
const FREE_MAX = '2023-11-24';

export default function History() {
    const { currentUser, apiInstance, logout } = useContext(
        AuthContext
    ) as UserContext;
    const [weather, setWeather] = useState<WeatherRecord>({} as WeatherRecord);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCity, setSelectedCity] = useState('Lisbon');

    const [startDate, setStartDate] = useState<Dayjs | null>(
        dayjs('2023-11-21')
    );
    const [endDate, setEndDate] = useState<Dayjs | null>(dayjs('2023-11-23'));

    const navigate = useNavigate();
    useEffect(() => {
        const getWeather = async () => {
            setIsLoading(true);
            const start =
                startDate === null
                    ? '2023-11-20'
                    : `${startDate.get('year')}-${
                          startDate.get('month') + 1
                      }-${startDate.get('date')}`;
            const end =
                endDate === null
                    ? '2023-11-23'
                    : `${endDate.get('year')}-${
                          endDate.get('month') + 1
                      }-${endDate.get('date')}`;
            const URL =
                currentUser.user.role === Roles.FREE
                    ? `https://localhost:5002/weather/${selectedCity}/`
                    : `https://localhost:5002/weather/${selectedCity}/${start}/${end}`;
            await apiInstance
                .get(URL)
                .then((res: AxiosResponse) => {
                    console.log('res in home27');
                    console.log(res);
                    // For some reason, it is returning an array with the role is not free
                    if (currentUser.user.role === Roles.FREE) {
                        setWeather(res.data);
                    } else {
                        setWeather(res.data);
                        console.log('weather in home28');
                        console.log(weather);
                    }
                    setIsLoading(false);
                })
                .catch(async (err: AxiosError) => {
                    console.log('err in home28');
                    console.log(err);

                    if (
                        err.response?.data.message ===
                        'Refresh Token expired. Login again'
                    ) {
                        console.log('Loggin out');

                        await logout();
                        navigate('/');
                    } else if (err.response.status === 400) {
                        console.log('Dates must be between ');
                    }
                });
        };
        getWeather();
    }, [selectedCity, startDate, endDate]);

    // const handleDateChange = (value: Dayjs, date: string) => {
    //     const day = value.get('date');
    //     const month = value.get('month') + 1;
    //     const year = value.get('year');

    //     if (date === 'start') {
    //         if (value.isBefore('2023-11-20') || value.isAfter('2023-11-24')) {
    //             // error
    //             console.log('Err');
    //         } else {
    //             if (
    //                 value.diff(endDate, 'day') > 2 &&
    //                 currentUser.user.role === Roles.FREE
    //             ) {
    //                 // Can only see up to 2 days
    //                 console.log('Up to 2 days because of role (start)');
    //             } else if (value.diff(endDate, 'day') > 5) {
    //                 // Can only see max 5 days
    //                 console.log('Up to 5 days (start)');
    //             } else {
    //                 setStartDate(value);
    //             }
    //         }
    //     } else {
    //         if (value.isBefore('2023-11-20') || value.isAfter('2023-11-24')) {
    //             // error
    //             console.log('Err');
    //         } else {
    //             if (
    //                 value.diff(startDate, 'day') > 2 &&
    //                 currentUser.user.role === Roles.FREE
    //             ) {
    //                 // Can only see up to 2 days
    //                 console.log('Up to 2 days because of role (start)');
    //             } else if (value.diff(startDate, 'day') > 5) {
    //                 // Can only see max 5 days
    //                 console.log('Up to 5 days (start)');
    //             } else {
    //                 setEndDate(value);
    //             }
    //         }
    //     }
    // };

    return (
        <>
            {isLoading || !selectedCity ? (
                <div
                    style={{
                        width: '100vw',
                        height: '100vh',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        opacity: 0.5,
                    }}
                >
                    <div className='spinner-grow text-primary' role='status'>
                        <span className='visually-hidden'>Loading...</span>
                    </div>
                </div>
            ) : (
                <main id='main' className='main'>
                    <div className='pagetitle'>
                        <h1>Weather History</h1>
                    </div>

                    <section>
                        <div className='card' style={{ margin: 'auto' }}>
                            <div className='card-header d-flex align-items-center justify-content-between'>
                                {currentUser.user.role !== Roles.FREE ? (
                                    <div
                                        className='d-flex align-items-center'
                                        style={{ gap: '5px' }}
                                    >
                                        <DatePicker
                                            label='Start date'
                                            value={startDate}
                                            onChange={(newValue) =>
                                                setStartDate(newValue)
                                            }
                                            format='DD-MM-YYYY'
                                        />
                                        <DatePicker
                                            label='End date'
                                            value={endDate}
                                            onChange={(newValue) => {
                                                setEndDate(newValue);
                                            }}
                                            format='DD-MM-YYYY'
                                        />
                                    </div>
                                ) : (
                                    <div></div>
                                )}

                                <div className='dropdown'>
                                    <button
                                        className='btn btn-info dropdown-toggle'
                                        type='button'
                                        data-bs-toggle='dropdown'
                                        aria-expanded='false'
                                    >
                                        {selectedCity}
                                    </button>
                                    <ul className='dropdown-menu'>
                                        {currentUser.user.role === Roles.FREE
                                            ? PortugueseCities.map(
                                                  (city, index) => {
                                                      return (
                                                          <li key={index}>
                                                              <span
                                                                  className='dropdown-item'
                                                                  style={{
                                                                      cursor: 'pointer',
                                                                      backgroundColor:
                                                                          selectedCity ===
                                                                          city
                                                                              ? 'rgb(211, 217, 234, 0.4)'
                                                                              : 'white',
                                                                  }}
                                                                  onClick={() =>
                                                                      setSelectedCity(
                                                                          city
                                                                      )
                                                                  }
                                                              >
                                                                  {city}
                                                              </span>
                                                          </li>
                                                      );
                                                  }
                                              )
                                            : PortugueseCities.concat(
                                                  OtherCities
                                              ).map((city, index) => {
                                                  return (
                                                      <li key={index}>
                                                          <span
                                                              className='dropdown-item'
                                                              style={{
                                                                  cursor: 'pointer',
                                                                  backgroundColor:
                                                                      selectedCity ===
                                                                      city
                                                                          ? 'rgb(211, 217, 234, 0.4)'
                                                                          : 'white',
                                                              }}
                                                              onClick={() =>
                                                                  setSelectedCity(
                                                                      city
                                                                  )
                                                              }
                                                          >
                                                              {city}
                                                          </span>
                                                      </li>
                                                  );
                                              })}
                                    </ul>
                                </div>
                            </div>

                            <div className='card-body'>
                                <div className='container text-center'>
                                    <div className='row row-cols-5'>
                                        {weather.forecast.map(
                                            (val: Day, index: number) => {
                                                return (
                                                    <div
                                                        key={index}
                                                        className='col'
                                                        style={{
                                                            backgroundColor:
                                                                '#F8F9FA',
                                                            borderRadius:
                                                                '10px',
                                                            margin: '10px',
                                                        }}
                                                    >
                                                        <h5 className='card-title'>
                                                            {val.date}
                                                            <br />
                                                            {
                                                                weather.location
                                                                    .name
                                                            }
                                                            ,{' '}
                                                            {
                                                                weather.location
                                                                    .country
                                                            }
                                                        </h5>
                                                        <div className='d-flex flex-column text-center mt-5 mb-4'>
                                                            <h6
                                                                className='display-4 mb-0 font-weight-bold'
                                                                style={{
                                                                    color: '#1C2331',
                                                                }}
                                                            >
                                                                {' '}
                                                                {
                                                                    val.day
                                                                        .avgtemp_c
                                                                }
                                                                ºC{' '}
                                                            </h6>
                                                            <span
                                                                className='small'
                                                                style={{
                                                                    color: '#868B94',
                                                                }}
                                                            >
                                                                {
                                                                    val.day
                                                                        .condition
                                                                        .text
                                                                }
                                                            </span>
                                                        </div>

                                                        <div className='d-flex align-items-center'>
                                                            <div
                                                                className='flex-grow-1'
                                                                style={{
                                                                    fontSize:
                                                                        '1rem',
                                                                }}
                                                            >
                                                                <div>
                                                                    <i
                                                                        className='fas fa-wind fa-fw'
                                                                        style={{
                                                                            color: '#868B94',
                                                                        }}
                                                                    ></i>{' '}
                                                                    <span className='ms-1'>
                                                                        {' '}
                                                                        {
                                                                            val
                                                                                .day
                                                                                .maxwind_kph
                                                                        }
                                                                        km/h
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <i
                                                                        className='fas fa-tint fa-fw'
                                                                        style={{
                                                                            color: '#868B94',
                                                                        }}
                                                                    ></i>{' '}
                                                                    <span className='ms-1'>
                                                                        {' '}
                                                                        {
                                                                            val
                                                                                .day
                                                                                .daily_chance_of_rain
                                                                        }
                                                                        %{' '}
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <i
                                                                        className='fas fa-sun fa-fw'
                                                                        style={{
                                                                            color: '#868B94',
                                                                        }}
                                                                    ></i>{' '}
                                                                    <span className='ms-1'>
                                                                        {' '}
                                                                        0.2h{' '}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <img
                                                                    src={
                                                                        val.day
                                                                            .condition
                                                                            .icon
                                                                    }
                                                                    width='100px'
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            )}
        </>
    );
}
