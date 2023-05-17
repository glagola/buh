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

    const res = history.map((hItem) => {
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

        const majorToTargetCurrencyExchangeRate = exchange(1, majorCurrency, targetCurrency);

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
            majorToTargetCurrencyExchangeRate: {
                currency: targetCurrency,
                amount: majorToTargetCurrencyExchangeRate,
            },
            moneyInMajorCurrencyPercent: Math.min(
                1,
                (totalOfAccountsInOtherCurrenciesInMajorCurrency * majorToTargetCurrencyExchangeRate) /
                    totalInTargetCurrency,
            ),

            totalInMajorCurrency: {
                currency: majorCurrency,
                amount: totalInTargetCurrency / majorToTargetCurrencyExchangeRate,
            },

            deltaFromPreviuosReportInTargetCurrency: {
                currency: targetCurrency,
                amount: 0,
            },

            deltaPerMonthAverageInTargetCurrency: {
                currency: targetCurrency,
                amount: 0,
            },

            deltaFromPreviuosReportPercent: 0,

            createdAt: DateTime.fromISO(hItem.createdAt),
        };
    });

    for (let i = 0; i < res.length - 1; ++i) {
        const current = res[i];
        const prev = res[i + 1];

        if (current && prev) {
            current.deltaFromPreviuosReportInTargetCurrency.amount =
                current.totalInTargetCurrency.amount - prev.totalInTargetCurrency.amount;

            current.deltaFromPreviuosReportPercent =
                current.deltaFromPreviuosReportInTargetCurrency.amount / current.totalInTargetCurrency.amount;

            current.deltaPerMonthAverageInTargetCurrency.amount =
                (current.deltaFromPreviuosReportInTargetCurrency.amount /
                    current.createdAt.diff(prev.createdAt).as('days')) *
                (365 / 12);
        }
    }

    return res;
};
