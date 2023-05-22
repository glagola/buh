import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';

import DBGuard from '@/components/db-guard';
import store from '@/store';

import { router } from './router';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <StrictMode>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterLuxon}>
            <Provider store={store}>
                <DBGuard>
                    <RouterProvider router={router} />
                </DBGuard>
            </Provider>
        </LocalizationProvider>
    </StrictMode>,
);