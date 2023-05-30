import { DateTime } from 'luxon';
import { useCallback, useMemo } from 'react';
import { type UseFormReturn } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { type TAccount, type TReport } from '@/entites';
import { getAccountByIdMap } from '@/store/buh';
import { formatNumber } from '@/utils/format';

import { getCurrencyByAccountIdMap, getMostRecentReport } from './selector';
import { buildFormExchangeRates, sortBalances } from './utils';
import { type TForm, type TFormAccountBalance } from './validation';

export const useDefaultValues = (reportToEdit?: TReport): TForm => {
    const currencyByAccountId = useSelector(getCurrencyByAccountIdMap);
    const previousReport = useSelector(getMostRecentReport);

    return useMemo(() => {
        const balances: TFormAccountBalance[] = (reportToEdit?.balances ?? previousReport?.balances ?? []).map(
            (accountBalance) => ({
                accountId: accountBalance.accountId,
                formula: reportToEdit ? formatNumber(accountBalance.balance) : '',
            }),
        );

        const exchangeRates = buildFormExchangeRates(
            (reportToEdit?.exchangeRates ?? []).map(({ currencyId, quote }) => ({
                currencyId,
                formula: formatNumber(quote),
            })),

            balances,
            currencyByAccountId,
        );

        return {
            balances,
            exchangeRates,
            createdAt: DateTime.fromISO(
                (reportToEdit?.createdAt ?? DateTime.now().toISO()) as string,
            ) as unknown as string,
        };
    }, [currencyByAccountId, reportToEdit, previousReport]);
};

export const useAccountActions = (form: UseFormReturn<TForm>) => {
    const accountById = useSelector(getAccountByIdMap);
    const currencyByAccountId = useSelector(getCurrencyByAccountIdMap);

    const updateForm = useCallback(
        (balances: TFormAccountBalance[]) => {
            form.setValue('balances', balances);

            form.setValue(
                'exchangeRates',
                buildFormExchangeRates(form.getValues('exchangeRates') ?? [], balances, currencyByAccountId),
            );
        },
        [currencyByAccountId, form],
    );

    const add = useCallback(
        (account: TAccount) => {
            const accountBalance = {
                accountId: account.id,
                formula: '',
            };

            const balances = form.getValues('balances') ?? [];
            balances.push(accountBalance);

            updateForm(sortBalances(balances, accountById));
        },
        [form, updateForm, accountById],
    );

    const remove = useCallback(
        (accountToRemove: TAccount) => {
            updateForm(
                (form.getValues('balances') ?? []).filter((balance) => balance.accountId !== accountToRemove.id),
            );
        },
        [form, updateForm],
    );

    return [add, remove];
};
