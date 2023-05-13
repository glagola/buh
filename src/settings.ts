import { type TCurrency } from './entites';

export const targetCurrency: TCurrency = { isoCode: 'RUB' };

export const majorCurrency: TCurrency = { isoCode: 'USD' };

export const requiredCurrencies: TCurrency[] = [targetCurrency, majorCurrency];

// TODO extract Target and Major currencies into settings UI
