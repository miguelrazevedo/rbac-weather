import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { AuthContext, UserContext } from '../context/AuthProvider';
import { z } from 'zod';

function useQuery() {
    const { search } = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function Login() {
    // Contexts
    const { login, signedIn } = useContext(AuthContext) as UserContext;
    const navigate = useNavigate();
    let query = useQuery();

    // States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        const emailSchema = z
            .string({ required_error: 'Email is required' })
            .email();
        const passwordSchema = z.string({
            required_error: 'Password is required to login',
        });

        const emailRes = await emailSchema.safeParseAsync(email);
        const passRes = await passwordSchema.safeParseAsync(password);

        if (!emailRes.success || !passRes.success) {
            console.log('Error on parsing some element');
            return;
        }

        try {
            await login({ email: emailRes.data, password: passRes.data });
            navigate('/');
        } catch (error) {
            /* empty */
        }
    };

    if (signedIn) {
        return <Navigate to='/' />;
    }

    return (
        <div className='container'>
            <section className='section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4'>
                <div className='container'>
                    {query.get('message') === 'success' &&
                        query.get('message') !== null && (
                            <div className='alert alert-success' role='alert'>
                                Account has been created successfuly! Make sure
                                to login below.
                            </div>
                        )}

                    {query.get('message') === 'error' &&
                        query.get('message') !== null && (
                            <div className='alert alert-danger' role='alert'>
                                You need to login to access that page.
                            </div>
                        )}
                    <div className='row justify-content-center'>
                        <div className='col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center'>
                            {/* <div className='d-flex justify-content-center py-4'>
                                <a
                                    href='index.html'
                                    className='logo d-flex align-items-center w-auto'
                                >
                                    <img src='assets/img/logo.png' alt='' />
                                    <span className='d-none d-lg-block'>
                                        NiceAdmin
                                    </span>
                                </a>
                            </div> */}

                            <div className='card mb-3'>
                                <div className='card-body'>
                                    <div className='pt-4 pb-2'>
                                        <h5 className='card-title text-center pb-0 fs-4'>
                                            Login to Your Account
                                        </h5>
                                        <p className='text-center small'>
                                            Enter your username & password to
                                            login
                                        </p>
                                    </div>

                                    <form
                                        className='row g-3 needs-validation'
                                        onSubmit={handleLogin}
                                    >
                                        <div className='col-12'>
                                            <label
                                                htmlFor='email'
                                                className='form-label'
                                            >
                                                Email
                                            </label>
                                            <div className='input-group has-validation'>
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
                                                    Please enter your email.
                                                </div>
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
                                            >
                                                Login
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
