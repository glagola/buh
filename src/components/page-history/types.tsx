import { type DateTime } from 'luxon';

import { type TAccount } from '@/entites';

export type TMoney = {
    currency: TAccount['currency'];
    amount: number;
};

export type TRow = {
    createdAt: DateTime;
    totalInTargetCurrency: TMoney;
    totalOfAccountsInTargetCurrency: TMoney;
    totalOfAccountsInOtherCurrenciesInMajorCurrency: TMoney;
    majorToTargetCurrencyExchangeRate: TMoney;
    moneyInMajorCurrencyPercent: TMoney;

    deltaFromPreviuosReportInTargetCurrency: TMoney;
};
