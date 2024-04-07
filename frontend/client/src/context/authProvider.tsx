import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react';
import { UserCache } from '../types/types';
export interface UserContext {
    signedIn: boolean;
    currentUser: UserCache;
    login(inputs: { email: string; password: string }): Promise<void>;
    logout(): Promise<void>;
    getNewAccessToken(): Promise<void | string>;
    apiInstance: AxiosInstance;
}

export const AuthContext = createContext<UserContext>({} as UserContext);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<UserCache | null>(
        JSON.parse(localStorage.getItem('user'))
    );

    const apiInstance = axios.create({
        headers: {
            Authorization: `Bearer ${
                currentUser ? currentUser.accessToken : ''
            }`,
        },
        withCredentials: true,
    });

    const responseInterceptor = apiInstance.interceptors.response.use(
        (res: AxiosResponse) => res,
        async (err: AxiosError) => {
            // O que fazer depois de ter o erro, se o erro for com resposta "x"
            // dar return de uma promise "boa"
            console.log('Caught the error in the inter', err);

            if (
                err.response?.status === 401 &&
                err.response?.data?.message === 'Need new access Token.'
            ) {
                const newToken = await getNewAccessToken();

                console.log('Got the new Access token');
                console.log(newToken);
                if (!newToken) {
                    await logout();
                }
                err.config!.headers.Authorization = `Bearer ${newToken}`;

                // Retry the original request
                return apiInstance(err.config!);
            }
            // Resposta se a refreshToken estiver expirada, dar logout
            else if (
                err.response?.status === 401 &&
                err.response?.data?.message ===
                    'Refresh Token expired. Login again'
            ) {
                console.log('ERROR in RefreshToken');
                await logout();
                return Promise.reject(err);
            }
            return Promise.reject(err);
        }
    );

    useEffect(() => {
        return () => {
            apiInstance.interceptors.response.eject(responseInterceptor);
        };
    }, []);

    // useEffect(() => {
    //     const interceptor = axios.interceptors.response.use(
    //         (response) => response,
    //         (error) => {
    //             const originalReq = error.config;
    //             if (
    //                 error.response.status === 401 &&
    //                 error.response.data.message === 'Need new access Token.'
    //             ) {
    //                 getNewAccessToken().then((newToken) => {
    //                     originalReq.headers.Authorization = `Bearer ${newToken}`;
    //                     console.log('Set the token in Bearer', newToken);
    //                 });
    //             }
    //             return Promise.reject(error);
    //         }
    //     );
    //     return () => {
    //         axios.interceptors.response.eject(interceptor);
    //     };
    // }, []);

    const login = async (inputs: { email: string; password: string }) => {
        await apiInstance
            .post('https://localhost:5000/auth/login', inputs)
            .then((res) => {
                setCurrentUser(res.data);
                localStorage.setItem('user', JSON.stringify(res.data));
            })
            .catch((err) => {
                console.error('Login failed', err);
            });
    };

    const getNewAccessToken = async (): Promise<string> => {
        console.log('Fetching token');

        return await apiInstance
            .get('https://localhost:5000/auth/newAccessToken')
            .then((res) => {
                console.log('Got the token');

                const newUser = {
                    ...currentUser,
                    accessToken: res.data.newAccessToken,
                };
                setCurrentUser(newUser);
                localStorage.setItem('user', JSON.stringify(newUser));
                return res.data.newAccessToken;
            })
            .catch(async (err) => {
                console.error('Error getting new access token', err);
                await logout();
            });
    };

    const logout = async () => {
        await apiInstance
            .post('https://localhost:5000/auth/logout')
            .then((res) => {
                setCurrentUser(null);
                localStorage.removeItem('user');
            })
            .catch((err) => {
                console.log('Error on Logout', err);
            });
    };

    return (
        <AuthContext.Provider
            value={{
                currentUser,
                login,
                getNewAccessToken,
                logout,
                signedIn: Boolean(currentUser),
                apiInstance,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
