import { type TCurrency } from './entites';

export const targetCurrency: TCurrency = {
    title: 'RUB',
    id: '932db883-2811-4666-8b29-507b93dbb3b2',
};

export const reserveCurrency: TCurrency = {
    title: 'USD',
    id: '686e8eda-254c-4667-a87a-ed40cea65375',
};

export const requiredCurrencies: TCurrency[] = [targetCurrency, reserveCurrency];

// TODO extract Target and Major currencies into settings UI
