import { createBrowserRouter } from 'react-router-dom';

import Dashboard from '@/components/page-dashboard';
import DashboardCurrencies from '@/components/page-dashboard-currencies';
import DashboardReport from '@/components/page-dashboard-report';
import ErrorPage from '@/components/page-error';

import ReportFormPage from './components/page-report-form';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Dashboard />,

        errorElement: <ErrorPage />,
        children: [
            { element: <DashboardReport />, index: true },

            {
                path: 'currencies',
                element: <DashboardCurrencies />,
            },
        ],
    },
    {
        path: '/report',
        element: <ReportFormPage />,
        children: [
            {
                path: ':reportId',
                element: <ReportFormPage />,
            },
        ],
    },
]);
