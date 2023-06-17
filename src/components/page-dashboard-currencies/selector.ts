import { createSelector } from '@reduxjs/toolkit';
import { DateTime } from 'luxon';
import { isZero } from 'mathjs';

import { type TCurrency, type TMoneyAmount, type TReport } from '@/entites';
import { reserveCurrency, targetCurrency } from '@/settings';
import {
    getAccountByIdMap,
    getCurrencies,
    getCurrencyByAccountIdMap,
    getMostRecentReport,
    getReportByIdMap,
    getReports,
} from '@/store/buh';
import { buildConverter } from '@/utils/currencyExchange';

import { type TRow } from './types';

export type TAmountData = {
    x: DateTime;
    y: TMoneyAmount;
    currency: TCurrency;
};

const getMoneyAmountByCurrencyIdByReportIdMap = createSelector(
    [getReports, getCurrencyByAccountIdMap],
    (reports, currencyByAccountIdMap) => {
        const res = new Map<TReport['id'], Map<TCurrency['id'], TMoneyAmount>>();

        for (const report of reports) {
            const perReportRes = new Map<TCurrency['id'], TMoneyAmount>();

            for (const accountBalance of report.balances) {
                const accCurrency = currencyByAccountIdMap.get(accountBalance.accountId);
                if (!accCurrency) continue;

                if (!isZero(accountBalance.balance)) {
                    perReportRes.set(accCurrency.id, (perReportRes.get(accCurrency.id) ?? 0) + accountBalance.balance);
                }
            }

            res.set(report.id, perReportRes);
        }

        return res;
    },
);

export const getChartDataSourceByCurrencyIdMap = createSelector(
    [getMoneyAmountByCurrencyIdByReportIdMap, getReportByIdMap, getCurrencies],
    (moneyAmountByCurrencyIdByReportIdMap, reportByIdMap, currencies) => {
        const res = new Map<TCurrency['id'], TAmountData[]>();

        for (const [reportId, moneyAmountByCurrencyIdMap] of moneyAmountByCurrencyIdByReportIdMap.entries()) {
            const report = reportByIdMap.get(reportId);
            if (!report) continue;

            for (const currency of currencies) {
                const data = res.get(currency.id) ?? [];

                data.push({
                    x: DateTime.fromISO(report.createdAt),
                    y: moneyAmountByCurrencyIdMap.get(currency.id) ?? 0,
                    currency,
                });

                res.set(currency.id, data);
            }
        }

        return res;
    },
);

const buildGetCurrencyUsedAtByCurrencyIdMap = (
    comparator: (current: DateTime, reportCreatedAt: DateTime) => DateTime,
) =>
    createSelector([getReports, getAccountByIdMap], (reports, accountByIdMap) => {
        const res = new Map<TCurrency['id'], DateTime>();

        for (const report of reports) {
            for (const balance of report.balances) {
                const account = accountByIdMap.get(balance.accountId);
                if (!account) continue;

                const current = res.get(account.currencyId);
                const reportCreatedAt = DateTime.fromISO(report.createdAt);

                if (undefined === current) {
                    res.set(account.currencyId, reportCreatedAt);
                } else {
                    res.set(account.currencyId, comparator(current, reportCreatedAt));
                }
            }
        }

        return res;
    });

const getFirstUsedAtByCurrencyIdMap = buildGetCurrencyUsedAtByCurrencyIdMap(
    (current: DateTime, reportCreatedAt: DateTime): DateTime => (reportCreatedAt < current ? reportCreatedAt : current),
);

const getLastUsedAtByCurrencyIdMap = buildGetCurrencyUsedAtByCurrencyIdMap(
    (current: DateTime, reportCreatedAt: DateTime): DateTime => (reportCreatedAt < current ? current : reportCreatedAt),
);

type TRowContext = {
    report: TReport;
    rows: TRow[];
};

export const prepareRowsContext = createSelector(
    [
        getMostRecentReport,
        getMoneyAmountByCurrencyIdByReportIdMap,
        getCurrencies,
        getFirstUsedAtByCurrencyIdMap,
        getLastUsedAtByCurrencyIdMap,
    ],
    (
        report,
        moneyAmountByCurrencyIdByReportIdMap,
        currencies,
        firstUsedAtByCurrencyIdMap,
        lastUsedAtByCurrencyIdMap,
    ): TRowContext | undefined => {
        if (!report) return;

        const moneyAmountByCurrencyIdMap = moneyAmountByCurrencyIdByReportIdMap.get(report.id);
        if (!moneyAmountByCurrencyIdMap) return;

        const convert = buildConverter(report.exchangeRates);

        const rows = currencies.map((currency): TRow => {
            const total = {
                currency,
                amount: moneyAmountByCurrencyIdMap.get(currency.id) ?? 0,
            };

            return {
                id: total.currency.id,

                title: total.currency.title,

                createdAt: firstUsedAtByCurrencyIdMap.get(currency.id),
                lastReportAt: lastUsedAtByCurrencyIdMap.get(currency.id),

                total,

                totalInTargetCurrency: {
                    currency: targetCurrency,
                    amount: convert(total.amount, total.currency, targetCurrency),
                },

                totalInReserveCurrency: {
                    currency: reserveCurrency,
                    amount: convert(total.amount, total.currency, reserveCurrency),
                },
            };
        });

        return {
            report,
            rows,
        };
    },
);
