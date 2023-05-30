import { createSelector } from '@reduxjs/toolkit';
import _ from 'lodash';

import { type TAccount, type TCurrency } from '@/entites';
import { requiredCurrencies } from '@/settings';
import { getAccounts, getCurrencies, getCurrencyByIdMap, getReportsChronologically } from '@/store/buh';

export const getCurrencyByAccountIdMap = createSelector([getAccounts, getCurrencyByIdMap], (accounts, currencyById) => {
    const res = new Map<TAccount['id'], TCurrency>();

    for (const account of accounts) {
        const currency = currencyById.get(account.currencyId);

        if (currency) {
            res.set(account.id, currency);
        }
    }

    return res;
});

export const getMostRecentReport = createSelector([getReportsChronologically], (reports) => reports.at(0));

export const getCurrenciesToShow = createSelector([getCurrencies], (currencies) => {
    return _.uniqBy([...requiredCurrencies, ...currencies], (currency) => currency.id);
});
