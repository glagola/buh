import { DateTime } from 'luxon';

import { type TCurrency, type TCurrencyQuote } from '@/entites';
import { majorCurrency, targetCurrency } from '@/settings';
import { type TRootState } from '@/store';
import { chronology } from '@/store/history';

import { type TRow } from './types';

const buildConverter = (quotes: TCurrencyQuote[]) => {
    const rates = new Map<TCurrency['isoCode'], TCurrencyQuote['quote']>(
        quotes.map((q) => [q.currency.isoCode, q.quote]),
    );

    return (sum: number, from: TCurrency, to: TCurrency): number => {
        const fromRate = rates.get(from.isoCode);
        const toRate = rates.get(to.isoCode);

        if (undefined === fromRate || undefined === toRate) {
            throw new Error(`No way to convert from ${from.isoCode} to ${to.isoCode}`);
        }

        return (sum * fromRate) / toRate;
    };
};

// TODO move to createSelector
export const prepareRows = (state: TRootState): TRow[] => {
    const history = chronology(state);

    return history.map((hItem) => {
        const exchange = buildConverter(hItem.quotes);

        let totalInTargetCurrency = 0;
        let totalOfAccountsInTargetCurrency = 0;
        let totalOfAccountsInOtherCurrenciesInMajorCurrency = 0;

        for (const accountBalance of hItem.accountBalances) {
            const amountInTargetCurrency = exchange(
                accountBalance.balance,
                accountBalance.account.currency,
                targetCurrency,
            );
            totalInTargetCurrency += amountInTargetCurrency;

            if (targetCurrency.isoCode === accountBalance.account.currency.isoCode) {
                totalOfAccountsInTargetCurrency += amountInTargetCurrency;
            } else {
                totalOfAccountsInOtherCurrenciesInMajorCurrency += exchange(
                    accountBalance.balance,
                    accountBalance.account.currency,
                    majorCurrency,
                );
            }
        }

        return {
            id: hItem.createdAt,

            totalInTargetCurrency: {
                currency: targetCurrency,
                amount: totalInTargetCurrency,
            },
            totalOfAccountsInTargetCurrency: {
                currency: targetCurrency,
                amount: totalOfAccountsInTargetCurrency,
            },
            totalOfAccountsInOtherCurrenciesInMajorCurrency: {
                currency: majorCurrency,
                amount: totalOfAccountsInOtherCurrenciesInMajorCurrency,
            },
            majorToTargetCurrencyExchangeRate: exchange(1, majorCurrency, targetCurrency),

            createdAt: DateTime.fromISO(hItem.createdAt),
        };
    });
};
