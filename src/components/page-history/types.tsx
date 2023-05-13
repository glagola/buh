import { type DateTime } from 'luxon';

import { type TCurrency } from '@/entites';

type TMoney = {
    currency: TCurrency;
    value: number;
};

export type TRow = {
    createdAt: DateTime;
    totalInTargetCurrency: TMoney;
    totalOfAccountsInTargetCurrency: TMoney;
    totalOfAccountsInOtherCurrenciesInMajorCurrency: TMoney;
};
