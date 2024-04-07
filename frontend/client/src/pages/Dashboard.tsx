/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthProvider';
import { Roles, User } from '../types/types';
import { Navigate } from 'react-router-dom';

export default function Dashboard() {
    const { currentUser, apiInstance, logout } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);
    const [userList, setUserList] = useState<User[]>([]);

    useEffect(() => {
        const getUsers = async () => {
            await apiInstance
                .get('https://localhost:5000/auth/all')
                .then((res) => {
                    setUserList(res.data);
                    setIsLoading(false);
                })
                .catch((err) =>
                    console.log('Error in getUsers (dashboard)', err)
                );
        };
        getUsers();
    }, []);

    const deleteUser = async (e: React.SyntheticEvent, userId: string) => {
        e.preventDefault();
        await apiInstance
            .delete(`https://localhost:5000/auth/${userId}`)
            .then((res) => {
                setUserList(userList.filter((user) => user._id !== userId));
            })
            .catch((err) => console.log('Error deleting user', err));
    };

    if (currentUser.user.role !== Roles.ADMIN) {
        return <Navigate to='/' />;
    }

    return (
        <div>
            {isLoading ? (
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
                        <h1>Admin Dashboard</h1>
                    </div>

                    <table
                        className='table'
                        style={{
                            border: 'none',
                            borderRadius: 5,
                            boxShadow: '0px 0 30px rgba(1, 41, 112, 0.1)',
                        }}
                    >
                        <thead>
                            <tr>
                                <th scope='col'>Name</th>
                                <th scope='col'>Email</th>
                                <th scope='col'>Role</th>
                                <th scope='col'>Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userList.map((user, index) => {
                                return (
                                    <tr key={index}>
                                        <th scope='row'>{user.name}</th>
                                        <td>{user.email}</td>
                                        <td>{user.role}</td>
                                        <td>
                                            <button
                                                type='button'
                                                className='btn btn-danger'
                                                onClick={(e) =>
                                                    deleteUser(e, user._id)
                                                }
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </main>
            )}
        </div>
    );
}
