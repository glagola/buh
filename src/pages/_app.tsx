import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import type { AppType } from 'next/app';
import { Provider } from 'react-redux';

import DBGuard from '@/components/db-guard';
import store from '@/store';
import { api } from '@/utils/api';

const MyApp: AppType = ({ Component, pageProps }) => {
    return (
        <>
            <CssBaseline />
            <LocalizationProvider dateAdapter={AdapterLuxon}>
                <Provider store={store}>
                    <DBGuard>
                        <Component {...pageProps} />
                    </DBGuard>
                </Provider>
            </LocalizationProvider>
        </>
    );
};

export default api.withTRPC(MyApp);
