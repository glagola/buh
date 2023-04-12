import { type NextPage } from 'next';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import AccountsGroup from '@/components/accountsGroup';
import type { TAccountState, TCurrency } from '@/entites';
import { recentlyUsedAccountsGroupByCurrency } from '@/store/history';

const TestPage: NextPage = () => {
    const recent = useSelector(recentlyUsedAccountsGroupByCurrency);

    const [current] = useState(() =>
        [...recent.entries()].map(
            ([currency, accounts]): [TCurrency, TAccountState[]] => [
                currency,
                accounts.map((account) => ({
                    account,
                    formula: '',
                })),
            ],
        ),
    );

    return (
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
    );
};

export default TestPage;
