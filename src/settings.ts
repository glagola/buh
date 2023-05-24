import { type TCurrency } from './entites';

export const targetCurrency: TCurrency = {
    isoCode: 'RUB',
    id: '932db883-2811-4666-8b29-507b93dbb3b2',
};

export const majorCurrency: TCurrency = {
    isoCode: 'USD',
    id: '686e8eda-254c-4667-a87a-ed40cea65375',
};

export const requiredCurrencies: TCurrency[] = [targetCurrency, majorCurrency];

// TODO extract Target and Major currencies into settings UI
