import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { AuthContextProvider } from './context/AuthProvider.tsx';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <AuthContextProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <App />
            </LocalizationProvider>
        </AuthContextProvider>
    </React.StrictMode>
);
