import { zodResolver } from '@hookform/resolvers/zod';
import AddIcon from '@mui/icons-material/Add';
import { Button, Container, Stack } from '@mui/material';
import { type NextPage } from 'next';
import { type FormEvent, useCallback, useMemo, useState } from 'react';
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
import { currenciesOfAccounts } from '@/components/utils';
import { type TCurrency, type TRawAccountDetails } from '@/entites';
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

        const quotes = currenciesOfAccounts(accounts).map((currency) => ({ currency, formula: '' }));

        return {
            accounts,
            quotes,
        };
    }, [accountsOfLastRecord]);

    const form = useForm<THistoryItemForm>({
        defaultValues,
        resolver: zodResolver(historyItemFormSchema),
        mode: 'all',
    });

    const _handleSubmit = () => {
        void 0;
    };

    const handleSubmit = useCallback(
        (e: FormEvent<HTMLFormElement>) => void form.handleSubmit(_handleSubmit)(e),
        [form],
    );

    const handleAccountAdd = useCallback(
        (rawAccount: TRawAccountDetails) => {
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
        },
        [form, toggleNewAccountModal],
    );

    const handleCurrencyAdd = useCallback(
        (currency: TCurrency) => {
            form.setValue(`accounts.${currency.isoCode}`, []);
            setCurrentCurrencies((currencies) => [...currencies, currency]);
            toggleNewCurrencyModal();
        },
        [form, toggleNewCurrencyModal],
    );

    return (
        <>
            <Container>
                <Stack
                    direction='row'
                    gap={3}
                    justifyContent='flex-end'
                    sx={{ mt: 3, mb: 3 }}
                >
                    <Button
                        startIcon={<AddIcon />}
                        variant='outlined'
                        onClick={toggleNewAccountModal}
                    >
                        Account
                    </Button>
                    <Button
                        startIcon={<AddIcon />}
                        variant='outlined'
                        onClick={toggleNewCurrencyModal}
                    >
                        Currency
                    </Button>
                </Stack>
                <FormProvider {...form}>
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={3}>
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
                            <Stack
                                direction='row'
                                gap={3}
                                justifyContent='flex-end'
                            >
                                <Button variant='text'>
                                    Cancel
                                    {
                                        // TODO confirmation needed
                                    }
                                </Button>
                                <Button
                                    variant='contained'
                                    type='submit'
                                >
                                    {
                                        // TODO confirmation needed
                                    }
                                    Save
                                </Button>
                            </Stack>
                        </Stack>
                    </form>
                </FormProvider>
            </Container>

            <AddAccountModal
                currencies={currentCurrencies}
                open={openNewAccountModal}
                onCancel={toggleNewAccountModal}
                onSuccess={handleAccountAdd}
            />

            <AddCurrencyModal
                open={openNewCurrencyModal}
                existingCurrencies={currentCurrencies}
                onCancel={toggleNewCurrencyModal}
                onSuccess={handleCurrencyAdd}
            />
        </>
    );
};

export default TestPage;
