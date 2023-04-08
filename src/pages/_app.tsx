import '@/styles/globals.css';

import type { AppType } from 'next/app';
import { Provider } from 'react-redux';

import { api } from '@/utils/api';
import store from '@/store';

const MyApp: AppType = ({ Component, pageProps }) => {
    return (
        <Provider store={store}>
            <Component {...pageProps} />
        </Provider>
    );
};

export default api.withTRPC(MyApp);
