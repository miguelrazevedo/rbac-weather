/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios';
import { useContext, useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { AuthContext } from '../context/AuthProvider';
import { Roles } from '../types/types';

export default function Register() {
    // Contexts
    const navigate = useNavigate();
    const [message, setMessage] = useSearchParams();
    const [success, setSuccess] = useState(false);

    const { signedIn, currentUser, apiInstance } = useContext(AuthContext);

    // States
    const [role, setRole] = useState('Select your role');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.SyntheticEvent) => {
        setSuccess(false);
        e.preventDefault();

        const nameSchema = z.string({
            required_error: 'Name is required to register.',
        });

        const emailSchema = z
            .string({ required_error: 'Email is required to register.' })
            .email();

        const passwordSchema = z.string({
            required_error: 'Password is required to register.',
        });

        const nameRes = await nameSchema.safeParseAsync(name);
        const emailRes = await emailSchema.safeParseAsync(email);
        const passRes = await passwordSchema.safeParseAsync(password);

        if (!emailRes.success || !passRes.success || !nameRes.success) {
            console.log('Error on parsing some element');
            console.log(emailRes.error);
            console.log(passRes.error);
            console.log(nameRes.error);

            return;
        }

        try {
            await apiInstance.post('https://localhost:5000/auth/register', {
                name,
                email,
                password,
                role: role.toLowerCase(),
            });
            setMessage(new URLSearchParams({ message: 'success' }));
            setSuccess(true);
        } catch (error) {
            console.log(error);
        }
    };

    if (signedIn && currentUser.user.role !== Roles.ADMIN) {
        return <Navigate to='/' />;
    }

    return (
        <div className='container'>
            <section className='section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4'>
                <div className='container'>
                    {success && (
                        <div
                            className='alert alert-success'
                            role='alert'
                            style={{
                                margin: 10,
                                boxShadow: '0px 0 30px rgba(1, 41, 112, 0.1)',
                            }}
                        >
                            Account has been created successfuly!
                        </div>
                    )}
                    <div className='row justify-content-center'>
                        <div className='col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center'>
                            <div className='card mb-3'>
                                <div className='card-body'>
                                    <div className='pt-4 pb-2'>
                                        <h5 className='card-title text-center pb-0 fs-4'>
                                            Create an Account
                                        </h5>
                                        <p className='text-center small'>
                                            Enter your personal details to
                                            create account
                                        </p>
                                    </div>

                                    <form className='row g-3 needs-validation'>
                                        <div className='col-12'>
                                            <label htmlFor='role'>Role</label>
                                            <div className='dropdown'>
                                                <button
                                                    className='btn btn-primary dropdown-toggle'
                                                    type='button'
                                                    data-bs-toggle='dropdown'
                                                    aria-expanded='false'
                                                >
                                                    {role}
                                                </button>
                                                <ul className='dropdown-menu'>
                                                    <li>
                                                        <a
                                                            className='dropdown-item'
                                                            href='#'
                                                            onClick={() =>
                                                                setRole('Admin')
                                                            }
                                                        >
                                                            Admin
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a
                                                            className='dropdown-item'
                                                            href='#'
                                                            onClick={() =>
                                                                setRole('Free')
                                                            }
                                                        >
                                                            Free
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a
                                                            className='dropdown-item'
                                                            href='#'
                                                            onClick={() =>
                                                                setRole(
                                                                    'Premium'
                                                                )
                                                            }
                                                        >
                                                            Premium
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className='col-12'>
                                            <label
                                                htmlFor='name'
                                                className='form-label'
                                            >
                                                Your Name
                                            </label>
                                            <input
                                                type='text'
                                                name='name'
                                                className='form-control'
                                                id='name'
                                                required
                                                onChange={(e) =>
                                                    setName(e.target.value)
                                                }
                                            />
                                            <div className='invalid-feedback'>
                                                Please, enter your name!
                                            </div>
                                        </div>

                                        <div className='col-12'>
                                            <label
                                                htmlFor='email'
                                                className='form-label'
                                            >
                                                Your Email
                                            </label>
                                            <input
                                                type='email'
                                                name='email'
                                                className='form-control'
                                                id='email'
                                                required
                                                onChange={(e) =>
                                                    setEmail(e.target.value)
                                                }
                                            />
                                            <div className='invalid-feedback'>
                                                Please enter a valid Email
                                                adddress!
                                            </div>
                                        </div>

                                        <div className='col-12'>
                                            <label
                                                htmlFor='password'
                                                className='form-label'
                                            >
                                                Password
                                            </label>
                                            <input
                                                type='password'
                                                name='password'
                                                className='form-control'
                                                id='password'
                                                required
                                                onChange={(e) =>
                                                    setPassword(e.target.value)
                                                }
                                            />
                                            <div className='invalid-feedback'>
                                                Please enter your password!
                                            </div>
                                        </div>
                                        <div className='col-12'>
                                            <button
                                                className='btn btn-primary w-100'
                                                type='submit'
                                                onClick={handleSubmit}
                                            >
                                                Create Account
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
