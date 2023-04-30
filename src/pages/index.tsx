import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Container, Stack } from '@mui/material';
import { type NextPage } from 'next';
import { useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useToggle } from 'react-use';

import AccountsGroupedByCurrency from '@/components/accountsGroupedByCurrency';
import AddAccountModal from '@/components/addAccountModal';
import AddCurrencyModal from '@/components/addCurrencyModal';
import CurrenciesQuotes from '@/components/currenciesQuotes';
import {
    type THistoryItemForm,
    historyItemFormSchema,
    type TAccountState,
    type TAccountStateByCurrency,
} from '@/components/form';
import { getUsedCurrencies } from '@/components/utils';
import { type TRawAccountDetails } from '@/entites';
import {
    archivedAccountsGroupByCurrencyAndSortByUsage,
    currencies,
    recentlyUsedAccountsGroupByCurrency,
} from '@/store/history';

const TestPage: NextPage = () => {
    const [openNewAccountModal, toggleNewAccountModal] = useToggle(false);
    const [openNewCurrencyModal, toggleNewCurrencyModal] = useToggle(false);

    const accountsOfLastRecord = useSelector(recentlyUsedAccountsGroupByCurrency);
    const archivedAccontsByCurrency = useSelector(archivedAccountsGroupByCurrencyAndSortByUsage);
    const currenciesEverUsed = useSelector(currencies);

    const [currentCurrencies, setCurrentCurrencies] = useState(currenciesEverUsed);

    const defaultValues = useMemo(() => {
        const accounts = [...accountsOfLastRecord.entries()].reduce<TAccountStateByCurrency>(
            (res, [currency, accounts]) => {
                res[currency.isoCode] = accounts.map((account) => ({ account, formula: '' }));
                return res;
            },
            {},
        );

        const quotes = getUsedCurrencies(accounts).map((currency) => ({ currency, formula: '' }));
        return {
            accounts,
            quotes,
        };
    }, [accountsOfLastRecord]);

    const _handleSubmit = () => {
        void 0;
    };

    const form = useForm<THistoryItemForm>({
        defaultValues,
        resolver: zodResolver(historyItemFormSchema),
        mode: 'all',
    });

    return (
        <>
            <Button
                variant='contained'
                onClick={toggleNewAccountModal}
            >
                Create new account
            </Button>
            <Button
                variant='outlined'
                onClick={toggleNewCurrencyModal}
            >
                Create new currency
            </Button>
            <Container>
                <FormProvider {...form}>
                    <form onSubmit={(...args) => void form.handleSubmit(_handleSubmit)(...args)}>
                        <Stack spacing={3}>
                            {Object.entries(form.getValues('accounts')).map(([isoCode]) => (
                                <AccountsGroupedByCurrency
                                    key={isoCode}
                                    title={`Accounts in ${isoCode}`}
                                    currency={{ isoCode }}
                                    archivedAccounts={archivedAccontsByCurrency.get(isoCode) ?? []}
                                />
                            ))}
                        </Stack>
                        <CurrenciesQuotes />
                    </form>
                </FormProvider>
            </Container>

            <AddAccountModal
                currencies={currentCurrencies}
                open={openNewAccountModal}
                onCancel={toggleNewAccountModal}
                onSuccess={(rawAccount: TRawAccountDetails) => {
                    toggleNewAccountModal();
                    const accountState: TAccountState = {
                        account: {
                            ...rawAccount,
                            id: rawAccount.title,
                            createdAt: new Date(),
                        },
                        formula: '',
                    };
                    const currencyIsoCode = rawAccount.currency.isoCode;

                    const states = form.getValues('accounts')[currencyIsoCode] ?? [];
                    states.push(accountState);
                    form.setValue(`accounts.${currencyIsoCode}`, states);
                }}
            />

            <AddCurrencyModal
                open={openNewCurrencyModal}
                existingCurrencies={currentCurrencies}
                onCancel={toggleNewCurrencyModal}
                onSuccess={(currency) => {
                    form.setValue(`accounts.${currency.isoCode}`, []);
                    setCurrentCurrencies((currencies) => [...currencies, currency]);
                    toggleNewCurrencyModal();
                }}
            />
        </>
    );
};

export default TestPage;
