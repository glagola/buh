import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Container, Stack } from '@mui/material';
import { type NextPage } from 'next';
import { useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useToggle } from 'react-use';

import AddAccountModal from '@/components/addAccountModal';
import { type THistoryItemForm, historyItemFormSchema } from '@/components/form';
import AccountsGroupedByCurrency from '@/components/new/accountsGroupedByCurrency';
import { type TAccountState, type TCurrency, type TRawAccountDetails } from '@/entites';
import {
    archivedAccountsGroupByCurrencyAndSortByUsage,
    currencies,
    recentlyUsedAccountsGroupByCurrency,
} from '@/store/history';

type TAccountStateByCurrency = Record<TCurrency['isoCode'], TAccountState[]>;

const TestPage: NextPage = () => {
    const [showModal, toggleModal] = useToggle(false);
    const recent = useSelector(recentlyUsedAccountsGroupByCurrency);
    const archivedAccontsByCurrency = useSelector(archivedAccountsGroupByCurrencyAndSortByUsage);
    const usedCurencies = useSelector(currencies);

    const [current] = useState(() =>
        [...recent.entries()].map(([currency, accounts]): [TCurrency, TAccountState[]] => [
            currency,
            accounts.map((account) => ({
                account,
                formula: '',
            })),
        ]),
    );

    const initialValues = useMemo(
        () =>
            current.reduce((res: TAccountStateByCurrency, [currency, accounts]) => {
                res[currency.isoCode] = accounts;
                return res;
            }, {}),
        [current],
    );

    const _handleSubmit = () => {
        void 0;
    };

    const form = useForm<THistoryItemForm>({
        defaultValues: initialValues,
        resolver: zodResolver(historyItemFormSchema),
        mode: 'all',
    });

    return (
        <>
            <Button
                variant='contained'
                onClick={toggleModal}
            >
                Create new account
            </Button>
            <Container>
                <FormProvider {...form}>
                    <form onSubmit={(...args) => void form.handleSubmit(_handleSubmit)(...args)}>
                        <Stack spacing={3}>
                            {Object.entries(form.getValues()).map(([isoCode]) => (
                                <AccountsGroupedByCurrency
                                    key={isoCode}
                                    title={`Accounts in ${isoCode}`}
                                    fieldPath={isoCode}
                                    archivedAccounts={archivedAccontsByCurrency.get(isoCode) ?? []}
                                />
                            ))}
                        </Stack>
                    </form>
                </FormProvider>
            </Container>

            <AddAccountModal
                currencies={usedCurencies}
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

                    const states = form.getValues()[currencyIsoCode] ?? [];
                    states.push(accountState);
                    form.setValue(currencyIsoCode, states);
                }}
            />
        </>
    );
};

export default TestPage;
