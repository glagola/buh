import { createAction, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import _ from 'lodash';
import { DateTime } from 'luxon';
import { useSelector } from 'react-redux';

import type { TBuh, TAccount, TCurrency, THistoryItem, TArchivedAccount } from '@/entites';
import { type TRootState } from '@/store';

const initialState: TBuh = {
    history: [],
};

export const name = 'buh';

const loadFromFile = createAction<TBuh>(`${name}/restoreFromFile`);

const slice = createSlice({
    name,
    initialState,
    reducers: {
        storeHistoryItem(state, action: PayloadAction<THistoryItem>): void {
            state.history.push(action.payload);
        },
    },
    extraReducers: (builder) => {
        builder.addCase(loadFromFile, (_, { payload }) => payload);
    },
});

export const actions = {
    ...slice.actions,
    loadFromFile,
};

export const reducer = slice.reducer;

const compareDateTime =
    <T>(getDateTime: (_: T) => DateTime, desc = true) =>
    (a: T, b: T): number => {
        const _a = getDateTime(a);
        const _b = getDateTime(b);

        if (_a.equals(_b)) return 0;

        return (_a < _b ? 1 : -1) * (desc ? 1 : -1);
    };

export const chronology = (_state: TRootState): THistoryItem[] => {
    const state = _state.buh;

    const history = [...state.history];

    history.sort(compareDateTime((item) => DateTime.fromISO(item.createdAt)));

    return history;
};

export const getRecentlyUsedAccounts = (_state: TRootState): TAccount[] => {
    const history = chronology(_state);

    return (history[0]?.accountBalances ?? []).map((accountBalance) => accountBalance.account);
};

const sortMapValues = <K, V>(map: Map<K, V[]>, comparator: (a: V, b: V) => number): void => {
    for (const value of map.values()) {
        value.sort(comparator);
    }
};

const groupBy = <T, U>(items: T[], getKey: (item: T) => U): Map<U, T[]> =>
    items.reduce((res, item) => {
        const key = getKey(item);
        const items = res.get(key) ?? [];
        items.push(item);
        return res.set(key, items);
    }, new Map<U, T[]>());

export const getPreviouslyUsedCurrencies = (state: TRootState): TCurrency[] => {
    const usedCurrencies = state.buh.history
        .map((hItem) => hItem.accountBalances)
        .flat(1)
        .map((accountBalance) => accountBalance.account.currency);

    return _.uniqBy(usedCurrencies, (c) => c.isoCode);
};

export const getArchivedAccountsGroupByCurrency = (_state: TRootState): Map<string, TArchivedAccount[]> => {
    const history = chronology(_state);
    const archivedAccounts = new Map<string, TArchivedAccount>();

    for (const item of history) {
        for (const { account } of item.accountBalances) {
            const acc = archivedAccounts.get(account.id);

            if (!acc || acc.archivedAt < item.createdAt) {
                archivedAccounts.set(account.id, {
                    account,
                    archivedAt: item.createdAt,
                });
            }
        }
    }

    const res = groupBy(
        [...archivedAccounts.values()],
        (account: TArchivedAccount) => account.account.currency.isoCode,
    );

    sortMapValues(
        res,
        compareDateTime((account: TArchivedAccount) => DateTime.fromISO(account.archivedAt)),
    );

    return res;
};

export const useDBExport = () => useSelector((state: TRootState) => state[name]);
