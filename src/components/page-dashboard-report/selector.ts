import { createSelector } from '@reduxjs/toolkit';
import { DateTime } from 'luxon';

import { reserveCurrency, targetCurrency } from '@/settings';
import { getAccountByIdMap, getCurrencyByIdMap, getReportsChronologically } from '@/store/buh';
import { buildConverter } from '@/utils/currencyExchange';

import { type TRow } from './types';

export const prepareRows = createSelector(
    [getReportsChronologically, getAccountByIdMap, getCurrencyByIdMap],
    (reports, accountById, currencyById): TRow[] => {
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
                    totalOfAccountsInOtherCurrenciesInMajorCurrency += exchange(balance, currency, reserveCurrency);
                }
            }

            const majorToTargetCurrencyExchangeRate = exchange(1, reserveCurrency, targetCurrency);

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
                    currency: reserveCurrency,
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
                    currency: reserveCurrency,
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
