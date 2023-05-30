import { createAction, createSelector, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import uniqBy from 'lodash/uniqBy';
import { DateTime } from 'luxon';

import {
    type TDBContainer,
    type TBuh,
    type TRawReport,
    type TRawAccount,
    type TEntity,
    type TRawCurrency,
    type TAccount,
} from '@/entites';
import { requiredCurrencies } from '@/settings';
import { type TRootState } from '@/store';
import { buildItemByIdMap } from '@/utils/entity';
import { compareDateTime, nowStr } from '@/utils/time';
import { generateUUID } from '@/utils/uuid';

const initialState: TDBContainer = {
    db: {
        reports: [],
        accounts: [],
        currencies: [],
    },
    isChanged: false,
};

export const name = 'buh';
const getSliceRoot = (_state: TRootState): TDBContainer => _state[name];

const createOrReplace = <T extends TEntity>(arr: T[], rawItem: Partial<T>): T[] => {
    const theItem = (
        undefined === rawItem.id
            ? {
                  ...rawItem,
                  id: generateUUID(),
              }
            : rawItem
    ) as T;

    if (undefined === rawItem.id) {
        return [...arr, theItem];
    }

    let replaced = false;
    const newArr = [];
    for (const item of arr) {
        const same = item.id === theItem.id;
        replaced ||= same;
        newArr.push(same ? theItem : item);
    }

    if (!replaced) {
        newArr.push(theItem);
    }

    return newArr;
};

const loadFromFile = createAction<TBuh>(`${name}/restoreFromFile`);

const slice = createSlice({
    name,
    initialState,
    reducers: {
        storeReport(state, action: PayloadAction<TRawReport>): void {
            state.db.reports = createOrReplace(state.db.reports, action.payload);
            state.isChanged = true;
        },

        storeAccount(state, action: PayloadAction<TRawAccount>): void {
            action.payload.createdAt ??= nowStr();
            state.db.accounts = createOrReplace(state.db.accounts, action.payload);
            state.isChanged = true;
        },

        storeCurrency(state, action: PayloadAction<TRawCurrency>): void {
            state.db.currencies = createOrReplace(state.db.currencies, action.payload);
            state.isChanged = true;
        },

        changesSaved(state): void {
            state.isChanged = false;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(loadFromFile, (_, { payload: db }) => ({
            db,
            isChanged: false,
        }));
    },
});

export const actions = {
    ...slice.actions,
    loadFromFile,
};
export const reducer = slice.reducer;

export const getIsDBChanged = (_state: TRootState): boolean => getSliceRoot(_state).isChanged;

const getDB = (_state: TRootState) => getSliceRoot(_state).db;

export const getReports = (_state: TRootState) => getDB(_state).reports;
export const getAccounts = (_state: TRootState) => getDB(_state).accounts;
export const getCurrencies = createSelector([getDB], ({ currencies }) =>
    uniqBy([...requiredCurrencies, ...currencies], ({ id }) => id),
);

export const getReportByIdMap = createSelector([getReports], buildItemByIdMap);

export const getAccountByIdMap = createSelector([getAccounts], buildItemByIdMap);

export const getCurrencyByIdMap = createSelector([getCurrencies], buildItemByIdMap);

export const getExportDB = createSelector(
    [getReports, getAccountByIdMap, getCurrencyByIdMap],
    (reports, accountById, currencyById): TBuh => {
        const accounts = [];
        const currencies = [];

        for (const { balances } of reports) {
            for (const { accountId } of balances) {
                const account = accountById.get(accountId);
                if (undefined === account) continue;

                const currency = currencyById.get(account.currencyId);
                if (undefined === currency) continue;

                accounts.push(account);
                currencies.push(currency);
            }
        }

        return {
            reports,
            accounts,
            currencies,
        };
    },
);

export const getAccountLastUsageById = createSelector([getReports], (reports) => {
    const res = new Map<TAccount['id'], DateTime>();

    for (const { balances, createdAt } of reports) {
        const reportCreatedAt = DateTime.fromISO(createdAt);

        for (const { accountId } of balances) {
            const prevCreatedAt = res.get(accountId);

            if (undefined === prevCreatedAt || prevCreatedAt < reportCreatedAt) {
                res.set(accountId, reportCreatedAt);
            }
        }
    }

    return res;
});

export const getAccountsByCurrencyId = createSelector([getAccounts], (accounts) =>
    accounts.reduce((res, account) => {
        const other = res.get(account.currencyId) ?? [];

        other.push(account);
        res.set(account.currencyId, other);

        return res;
    }, new Map<TAccount['currencyId'], TAccount[]>()),
);

export const getReportsChronologically = createSelector([getReports], (reports) =>
    [...reports].sort(compareDateTime((report) => DateTime.fromISO(report.createdAt))),
);
