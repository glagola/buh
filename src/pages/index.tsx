import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Container, Stack } from '@mui/material';
import { type NextPage } from 'next';
import { useMemo, useState } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useToggle } from 'react-use';

import AccountsGroupedByCurrency from '@/components/accountsGroupedByCurrency';
import AddAccountModal from '@/components/addAccountModal';
import AddCurrencyModal from '@/components/addCurrencyModal';
import CurrencyQuotesField from '@/components/currencyQuotesField';
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
    const [showModal, toggleModal] = useToggle(false);
    const [showCurrencyModal, toggleCurrencyModal] = useToggle(false);
    const recent = useSelector(recentlyUsedAccountsGroupByCurrency);
    const archivedAccontsByCurrency = useSelector(archivedAccountsGroupByCurrencyAndSortByUsage);
    const usedCurencies = useSelector(currencies);

    const [currentCurrencies, setCurrentCurrencies] = useState(usedCurencies);

    const defaultValues = useMemo(() => {
        const accounts = [...recent.entries()].reduce<TAccountStateByCurrency>((res, [currency, accounts]) => {
            res[currency.isoCode] = accounts.map((account) => ({ account, formula: '' }));
            return res;
        }, {});

        const quotes = getUsedCurrencies(accounts).map((currency) => ({ currency, formula: '' }));
        return {
            accounts,
            quotes,
        };
    }, [recent]);

    const _handleSubmit = () => {
        void 0;
    };

    const form = useForm<THistoryItemForm>({
        defaultValues,
        resolver: zodResolver(historyItemFormSchema),
        mode: 'all',
    });

    useWatch({ control: form.control });

    console.log(form.getValues());

    return (
        <>
            <Button
                variant='contained'
                onClick={toggleModal}
            >
                Create new account
            </Button>
            <Button
                variant='outlined'
                onClick={toggleCurrencyModal}
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
                        <CurrencyQuotesField />
                    </form>
                </FormProvider>
            </Container>

            <AddAccountModal
                currencies={currentCurrencies}
                open={showModal}
                onCancel={toggleModal}
                onSuccess={(rawAccount: TRawAccountDetails) => {
                    toggleModal();
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
                open={showCurrencyModal}
                existingCurrencies={currentCurrencies}
                onCancel={toggleCurrencyModal}
                onSuccess={(currency) => {
                    form.setValue(`accounts.${currency.isoCode}`, []);
                    setCurrentCurrencies((currencies) => [...currencies, currency]);
                    toggleCurrencyModal();
                }}
            />
        </>
    );
};

export default TestPage;
