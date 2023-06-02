import { DateTime } from 'luxon';
import { useCallback, useMemo } from 'react';
import { type UseFormReturn } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { type TAccount, type TReport } from '@/entites';
import { formatNumber } from '@/utils/format';

import { getCurrencyByAccountIdMap, getMostRecentReport } from './selector';
import { buildFormExchangeRates } from './utils';
import { type TFormAccountBalances, type TForm } from './validation';

export const useDefaultValues = (reportToEdit?: TReport): TForm => {
    const currencyByAccountId = useSelector(getCurrencyByAccountIdMap);
    const previousReport = useSelector(getMostRecentReport);

    return useMemo(() => {
        const balances = (reportToEdit?.balances ?? previousReport?.balances ?? []).reduce<TFormAccountBalances>(
            (res, { accountId, balance }) => {
                res[accountId] = reportToEdit ? formatNumber(balance) : '';

                return res;
            },
            {},
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
    const currencyByAccountId = useSelector(getCurrencyByAccountIdMap);

    const updateForm = useCallback(
        (balances: TFormAccountBalances) => {
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
            const balances = {
                ...(form.getValues('balances') ?? {}),
                [account.id]: '',
            };

            updateForm(balances);
        },
        [form, updateForm],
    );

    const remove = useCallback(
        (accountToRemove: TAccount) => {
            const { [accountToRemove.id]: _, ...balances } = form.getValues('balances') ?? {};

            updateForm(balances);
        },
        [form, updateForm],
    );

    return [add, remove];
};
