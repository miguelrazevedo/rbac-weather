import { useContext } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { AuthContext, UserContext } from '../context/AuthProvider';
import { Roles } from '../types/types';

export default function Header() {
    const { currentUser, logout } = useContext(AuthContext) as UserContext;
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
            // window.location.reload();
        } catch (error) {
            console.log('Error on Logout BTN;', error);
        }
    };

    return (
        <header
            id='header'
            className='header fixed-top d-flex align-items-center'
        >
            <div className='d-inline-flex align-items-center justify-content-between'>
                <Link to='/' className='logo'>
                    <span className='d-none d-lg-block'>FEUPWeather</span>
                </Link>
                <Link to='/history'>
                    <span className='d-none d-lg-block'>History</span>
                </Link>
            </div>

            <nav className='header-nav ms-auto'>
                <ul className='d-flex align-items-center'>
                    <li className='nav-item dropdown pe-3'>
                        <a
                            className='nav-link nav-profile d-flex align-items-center pe-0'
                            href='#'
                            data-bs-toggle='dropdown'
                        >
                            <img
                                src='src/assets/img/profile-img.jpg'
                                alt='Profile'
                                className='rounded-circle'
                            />
                            <span className='d-none d-md-block dropdown-toggle ps-2'>
                                {currentUser.user.name}
                            </span>
                        </a>

                        <ul
                            className='dropdown-menu dropdown-menu-end dropdown-menu-arrow profile'
                            style={{ cursor: 'pointer' }}
                        >
                            <li className='dropdown-header'>
                                <h6>{currentUser.user.name}</h6>
                                <span>{currentUser.user.role}</span>
                            </li>
                            <li>
                                <hr className='dropdown-divider' />
                            </li>

                            {currentUser.user.role === Roles.ADMIN && (
                                <>
                                    <li
                                        className='dropdown-item d-flex align-items-center'
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <i className='bi bi-border-width'></i>
                                        <span
                                            onClick={() =>
                                                navigate('/dashboard')
                                            }
                                        >
                                            Dashboard
                                        </span>
                                    </li>
                                    <li>
                                        <hr className='dropdown-divider' />
                                    </li>
                                    <li
                                        className='dropdown-item d-flex align-items-center'
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <i className='bi bi-person-plus-fill'></i>
                                        <span
                                            onClick={() =>
                                                navigate('/register')
                                            }
                                        >
                                            Create new user
                                        </span>
                                    </li>
                                    <li>
                                        <hr className='dropdown-divider' />
                                    </li>
                                </>
                            )}

                            <li
                                className='dropdown-item d-flex align-items-center'
                                style={{ cursor: 'pointer' }}
                            >
                                <i className='bi bi-box-arrow-right'></i>
                                <span onClick={handleLogout}>Sign Out</span>
                            </li>
                        </ul>
                    </li>
                </ul>
            </nav>
        </header>
    );
}
