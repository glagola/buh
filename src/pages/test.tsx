'use client';

import arrayMutators from 'final-form-arrays';
import { type NextPage } from 'next';
import { useMemo, useState } from 'react';
import { Form } from 'react-final-form';
import { useSelector } from 'react-redux';

import AccountsGroup from '@/components/accountsGroup';
import type { TAccountState, TCurrency } from '@/entites';
import { recentlyUsedAccountsGroupByCurrency } from '@/store/history';

type TAccountStateByCurrency = {
    [key: string]: TAccountState[];
};

const TestPage: NextPage = () => {
    const recent = useSelector(recentlyUsedAccountsGroupByCurrency);

    const [current] = useState(() =>
        [...recent.entries()].map(([currency, accounts]): [TCurrency, TAccountState[]] => [
            currency,
            accounts.map((account) => ({
                account,
                formula: '',
            })),
        ]),
    );

    const mutators = useMemo(() => ({ ...arrayMutators }), []);

    const initialValues = useMemo(
        () => ({
            accounts: current.reduce((res: TAccountStateByCurrency, [currency, accounts]) => {
                res[currency.isoCode] = accounts;
                return res;
            }, {}),
        }),
        [current],
    );

    const handleSubmit = () => {
        void 0;
    };

    return (
        <Form
            onSubmit={handleSubmit}
            mutators={mutators}
            initialValues={initialValues}
            render={({ handleSubmit }) => (
                <form onSubmit={(...args) => void handleSubmit(...args)}>
                    <div className='container mx-auto my-20'>
                        {current.map(([currency, accounts]) => (
                            <AccountsGroup
                                key={currency.isoCode}
                                title={`Accounts in ${currency.isoCode}`}
                                currency={currency}
                                accounts={accounts}
                            />
                        ))}
                    </div>
                </form>
            )}
        />
    );
};

export default TestPage;
