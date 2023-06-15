import { type DateTime } from 'luxon';

import { type TMoney } from '@/types';

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
