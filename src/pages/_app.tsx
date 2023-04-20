import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import type { AppType } from 'next/app';
import { Provider } from 'react-redux';

import store from '@/store';
import '@/styles/globals.css';
import { api } from '@/utils/api';

const MyApp: AppType = ({ Component, pageProps }) => {
    return (
        <Provider store={store}>
            <Component {...pageProps} />
        </Provider>
    );
};

export default api.withTRPC(MyApp);
