import { type DateTime } from 'luxon';

import { TCurrency } from '@/entites';

export type TMoney = {
    currency: TCurrency;
    amount: number;
};

export type TRow = {
    createdAt: DateTime;
    totalInTargetCurrency: TMoney;
    totalOfAccountsInTargetCurrency: TMoney;
    totalOfAccountsInOtherCurrenciesInMajorCurrency: TMoney;
    majorToTargetCurrencyExchangeRate: TMoney;
    moneyInMajorCurrencyPercent: number;

    deltaFromPreviuosReportInTargetCurrency: TMoney;
    deltaFromPreviuosReportPercent: number;
    deltaPerMonthAverageInTargetCurrency: TMoney;
};
