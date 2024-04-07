import {
    Navigate,
    Outlet,
    RouterProvider,
    createBrowserRouter,
} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import { useContext } from 'react';
import { AuthContext, UserContext } from './context/AuthProvider';
import Header from './components/Header';
import { Roles } from './types/types';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
function App() {
    const { signedIn, currentUser } = useContext(AuthContext) as UserContext;

    const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
        if (!signedIn) {
            return <Navigate to='/login' />;
        }
        return children;
    };

    const Layout = () => {
        return (
            <>
                <Header />
                <Outlet />
            </>
        );
    };
    const router = createBrowserRouter([
        {
            path: '/',
            element: (
                <ProtectedRoute>
                    <Layout />
                </ProtectedRoute>
            ),
            children: [
                {
                    path: '/',
                    element: <Home />,
                },
                {
                    path: '/dashboard',
                    element: <Dashboard />,
                },
                {
                    path: '/history',
                    element: <History />,
                },
                {
                    path: '/register',
                    element: <Register />,
                },
            ],
        },
        {
            path: '/login',
            element: <Login />,
        },
    ]);

    return <RouterProvider router={router} />;
}

export default App;
