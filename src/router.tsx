import { createBrowserRouter } from 'react-router-dom';

import ErrorPage from '@/components/page-error';
import HistoryPage from '@/components/page-history';

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
