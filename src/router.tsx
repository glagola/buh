import { createBrowserRouter } from 'react-router-dom';

import HistoryPage from '@/components/page-dashboard';
import ErrorPage from '@/components/page-error';

import ReportFormPage from './components/page-report-form';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <HistoryPage />,
        index: true,
        errorElement: <ErrorPage />,
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
