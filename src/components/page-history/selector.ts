import { createSelector } from '@reduxjs/toolkit';
import { DateTime } from 'luxon';

import { type TCurrency, type TExchangeRate } from '@/entites';
import { majorCurrency, targetCurrency } from '@/settings';
import { getAccountByIdMap, getCurrencyByIdMap, getReportsChronologically } from '@/store/buh';

const buildConverter = (quotes: TExchangeRate[]) => {
    const rates = new Map<TCurrency['id'], TExchangeRate['quote']>(quotes.map((q) => [q.currencyId, q.quote]));

    return (sum: number, from: TCurrency, to: TCurrency): number => {
        const fromRate = rates.get(from.id);
        const toRate = rates.get(to.id);

        if (undefined === fromRate || undefined === toRate) {
            throw new Error(`No way to convert from ${from.isoCode} to ${to.isoCode}`);
        }

        return (sum * fromRate) / toRate;
    };
};

export const prepareRows = createSelector(
    [getReportsChronologically, getAccountByIdMap, getCurrencyByIdMap],
    (reports, accountById, currencyById) => {
        const res = reports.map((report) => {
            const exchange = buildConverter(report.exchangeRates);

            let totalInTargetCurrency = 0;
            let totalOfAccountsInTargetCurrency = 0;
            let totalOfAccountsInOtherCurrenciesInMajorCurrency = 0;

            for (const { accountId, balance } of report.balances) {
                const account = accountById.get(accountId);
                if (undefined === account) continue;
                const currency = currencyById.get(account.currencyId);
                if (undefined === currency) continue;

                const amountInTargetCurrency = exchange(balance, currency, targetCurrency);
                totalInTargetCurrency += amountInTargetCurrency;

                if (targetCurrency.id === currency.id) {
                    totalOfAccountsInTargetCurrency += amountInTargetCurrency;
                } else {
                    totalOfAccountsInOtherCurrenciesInMajorCurrency += exchange(balance, currency, majorCurrency);
                }
            }

            const majorToTargetCurrencyExchangeRate = exchange(1, majorCurrency, targetCurrency);

            return {
                id: report.id,

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

                createdAt: DateTime.fromISO(report.createdAt),
            };
        });

        for (let i = 0; i < res.length - 1; ++i) {
            const current = res[i];
            const prev = res[i + 1];

            if (current && prev) {
                current.deltaFromPreviuosReportInTargetCurrency.amount =
                    current.totalInTargetCurrency.amount - prev.totalInTargetCurrency.amount;

                current.deltaFromPreviuosReportPercent =
                    current.deltaFromPreviuosReportInTargetCurrency.amount / prev.totalInTargetCurrency.amount;

                current.deltaPerMonthAverageInTargetCurrency.amount =
                    (current.deltaFromPreviuosReportInTargetCurrency.amount /
                        current.createdAt.diff(prev.createdAt).as('days')) *
                    (365 / 12);
            }
        }

        return res;
    },
);
