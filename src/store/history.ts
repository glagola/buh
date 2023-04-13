import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type {
    TBuh,
    TAccountHistoryState,
    TAccount,
    TCurrency,
    THistoryItem,
    TArchivedAccount,
} from '@/entites';
import { type TRootState } from '@/store';

const currentDate = new Date();
const pastDate1 = new Date(currentDate.getFullYear() - 1, 0, 1);
const pastDate2 = new Date(currentDate.getFullYear() - 2, 0, 1);
const pastDate3 = new Date(currentDate.getFullYear() - 3, 0, 1);

const sampleCurrency1 = { isoCode: 'USD' };
const sampleCurrency2 = { isoCode: 'EUR' };
const sampleCurrency3 = sampleCurrency1;

const sampleAccount1 = {
    id: '123',
    title: 'My USD Account',
    currency: sampleCurrency1,
    createdAt: pastDate1,
};

const sampleAccount2 = {
    id: '456',
    title: 'My EUR Account',
    currency: sampleCurrency2,
    createdAt: pastDate2,
};

const sampleAccount3 = {
    id: '789',
    title: 'My JPY Account',
    currency: sampleCurrency3,
    createdAt: pastDate3,
};

const sampleAccountHistoryState1 = {
    account: sampleAccount1,
    value: 100,
};

const sampleAccountHistoryState2 = {
    account: sampleAccount2,
    value: 200,
};

const sampleAccountHistoryState3 = {
    account: sampleAccount3,
    value: 300,
};

const initialState: TBuh = {
    history: [
        {
            accounts: [sampleAccountHistoryState1],
            createdAt: pastDate3,
        },
        {
            accounts: [sampleAccountHistoryState1, sampleAccountHistoryState2],
            createdAt: pastDate1,
        },
        {
            accounts: [
                sampleAccountHistoryState1,
                sampleAccountHistoryState2,
                sampleAccountHistoryState3,
            ],
            createdAt: pastDate3,
        },
    ],
};

export const name = 'buh';

const slice = createSlice({
    name,
    initialState,
    reducers: {
        storeHistoryItem: (
            state,
            action: PayloadAction<TAccountHistoryState[]>,
        ) => {
            state.history.push({
                accounts: action.payload,

                createdAt: new Date(),
            });
        },
    },
});

export const actions = slice.actions;

const compareDateTime =
    <T>(getDateTime: (_: T) => Date, desc = true) =>
    (a: T, b: T): number => {
        const _a = getDateTime(a);
        const _b = getDateTime(b);

        if (_a.getTime() === _b.getTime()) return 0;

        return (_a < _b ? 1 : -1) * (desc ? 1 : -1);
    };

const chronology = (_state: TRootState): THistoryItem[] => {
    const state = _state.buh;

    const history = [...state.history];

    history.sort(compareDateTime((item) => item.createdAt));

    return history;
};

const recentlyUsedAccounts = (_state: TRootState): TAccount[] => {
    const history = chronology(_state);

    return (history[0]?.accounts ?? []).map(
        (accountState) => accountState.account,
    );
};

const sortMapValues = <K, V>(
    map: Map<K, V[]>,
    comparator: (a: V, b: V) => number,
): void => {
    for (const value of map.values()) {
        value.sort(comparator);
    }
};

const groupByCurrency = <T>(
    items: T[],
    getCurrency: (item: T) => TCurrency,
): Map<TCurrency, T[]> =>
    items.reduce((res, item) => {
        const currency = getCurrency(item);
        const items = res.get(currency) ?? [];
        items.push(item);
        return res.set(currency, items);
    }, new Map<TCurrency, T[]>());

export const recentlyUsedAccountsGroupByCurrency = (
    _state: TRootState,
): Map<TCurrency, TAccount[]> => {
    const recentlyAccounts = recentlyUsedAccounts(_state);

    const res = groupByCurrency(
        recentlyAccounts,
        (account: TAccount) => account.currency,
    );

    sortMapValues(res, (a, b) => {
        if (a.title === b.title) return 0;

        return a.title < b.title ? 1 : -1;
    });

    return res;
};

export const archivedAccountsGroupByCurrencyAndSortByUsage = (
    _state: TRootState,
): Map<TCurrency, TArchivedAccount[]> => {
    const history = chronology(_state);
    const archivedAccounts = new Map<string, TArchivedAccount>();

    for (const item of history) {
        for (const { account } of item.accounts) {
            const acc = archivedAccounts.get(account.id);

            if (!acc || acc.archivedAt < item.createdAt) {
                archivedAccounts.set(account.id, {
                    account,
                    archivedAt: item.createdAt,
                });
            }
        }
    }

    const recentlyAccounts = new Set(
        recentlyUsedAccounts(_state).map((account) => account.id),
    );

    const archivedAccountsExcludeRecent = [...archivedAccounts.values()].filter(
        (archivedAccount) => !recentlyAccounts.has(archivedAccount.account.id),
    );

    const res = groupByCurrency(
        archivedAccountsExcludeRecent,
        (account: TArchivedAccount) => account.account.currency,
    );

    sortMapValues(
        res,
        compareDateTime((account: TArchivedAccount) => account.archivedAt),
    );

    return res;
};

export const reducer = slice.reducer;
