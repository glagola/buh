import { zodResolver } from '@hookform/resolvers/zod';
import AddIcon from '@mui/icons-material/Add';
import { Button, Container, Stack } from '@mui/material';
import { useCallback, useMemo, type FormEvent } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useToggle } from 'react-use';

import AccountsGroupedByCurrency from '@/components/accountsGroupedByCurrency';
import AddAccountModal from '@/components/addAccountModal';
import AddCurrencyModal from '@/components/addCurrencyModal';
import CurrenciesQuotes from '@/components/currenciesQuotes';
import {
    historyItemFormSchema,
    type TCurrencyQuoteByFormula,
    type TAccountStateByCurrency,
    type THistoryItemForm,
} from '@/components/form';
import { requiredCurrencies, useCurrencies } from '@/components/hooks';
import { currenciesOfAccounts, uniqueCurrencies } from '@/components/utils';
import type { TAccount, TCurrency, TRawAccountDetails } from '@/entites';
import { archivedAccountsGroupByCurrencyAndSortByUsage, recentlyUsedAccountsGroupByCurrency } from '@/store/history';
import { actions } from '@/store/history';
import { evaluateForSure } from '@/utils/expression';
import { now } from '@/utils/time';

const buildCurrencyQuotes = (
    accounts: TAccountStateByCurrency,
    previous: TCurrencyQuoteByFormula[] = [],
): TCurrencyQuoteByFormula[] => {
    const formulaByCurrencyISOCode = new Map<
        TCurrencyQuoteByFormula['currency']['isoCode'],
        TCurrencyQuoteByFormula['formula']
    >(previous.map(({ currency: { isoCode }, formula }) => [isoCode, formula]));

    return uniqueCurrencies(requiredCurrencies, currenciesOfAccounts(accounts)).map((currency) => ({
        currency,
        formula: formulaByCurrencyISOCode.get(currency.isoCode) ?? '',
    }));
};

const CreateRecordPage = () => {
    const [openNewAccountModal, toggleNewAccountModal] = useToggle(false);
    const [openNewCurrencyModal, toggleNewCurrencyModal] = useToggle(false);

    const accountsOfLastRecord = useSelector(recentlyUsedAccountsGroupByCurrency);
    const archivedAccontsByCurrency = useSelector(archivedAccountsGroupByCurrencyAndSortByUsage);

    const [currentCurrencies, setCurrentCurrencies] = useCurrencies();

    const defaultValues = useMemo(() => {
        const accounts = [...accountsOfLastRecord.entries()].reduce<TAccountStateByCurrency>(
            (res, [currency, accounts]) => {
                res[currency.isoCode] = accounts.map((account) => ({ account, formula: '' }));
                return res;
            },
            {},
        );

        return {
            accounts,
            quotes: buildCurrencyQuotes(accounts),
        };
    }, [accountsOfLastRecord]);

    const form = useForm<THistoryItemForm>({
        defaultValues,
        resolver: zodResolver(historyItemFormSchema),
        mode: 'all',
    });

    const dispatch = useDispatch();
    const _handleSubmit = useCallback(
        (data: THistoryItemForm): void => {
            const accounts = Object.values(data.accounts)
                .flat(1)
                .map(({ account, formula }) => ({
                    value: evaluateForSure(formula),
                    account,
                }));

            const quotes = data.quotes.map(({ formula, currency }) => ({
                currency,
                quote: evaluateForSure(formula),
            }));
            
            dispatch(actions.storeHistoryItem({ accounts, quotes }));
        },
        [dispatch],
    );

    const handleSubmit = useCallback(
        (e: FormEvent<HTMLFormElement>) => void form.handleSubmit(_handleSubmit)(e),
        [_handleSubmit, form],
    );

    const handleAccountAdd = useCallback(
        (account: TAccount) => {
            const accountState = {
                account,
                formula: '',
            };
            const currencyIsoCode = account.currency.isoCode;

            const states = form.getValues(`accounts.${currencyIsoCode}`) ?? [];
            states.push(accountState);
            form.setValue(`accounts.${currencyIsoCode}`, states);

            form.setValue(`quotes`, buildCurrencyQuotes(form.getValues('accounts'), form.getValues('quotes')));
        },
        [form],
    );

    const handleAccountRemove = useCallback(
        (account: TAccount) => {
            const isoCode = account.currency.isoCode;
            const states = form.getValues(`accounts.${isoCode}`) ?? [];

            form.setValue(
                `accounts.${isoCode}`,
                states.filter((curr) => curr.account.id !== account.id),
            );

            form.setValue(`quotes`, buildCurrencyQuotes(form.getValues('accounts'), form.getValues('quotes')));
        },
        [form],
    );

    const handleRawAccountAdd = useCallback(
        (rawAccount: TRawAccountDetails) => {
            toggleNewAccountModal();
            handleAccountAdd({
                ...rawAccount,
                id: rawAccount.title,
                createdAt: now(),
            });
        },
        [handleAccountAdd, toggleNewAccountModal],
    );

    const handleCurrencyAdd = useCallback(
        (currency: TCurrency) => {
            form.setValue(`accounts.${currency.isoCode}`, []);
            setCurrentCurrencies((currencies) => [...currencies, currency]);
            toggleNewCurrencyModal();
        },
        [form, toggleNewCurrencyModal, setCurrentCurrencies],
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
                                        onAdd={handleAccountAdd}
                                        onRemove={handleAccountRemove}
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
                                    disabled={!form.formState.isValid}
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
                onSuccess={handleRawAccountAdd}
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

export default CreateRecordPage;
