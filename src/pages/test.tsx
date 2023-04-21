import { Button } from '@mui/material';
import arrayMutators from 'final-form-arrays';
import { type NextPage } from 'next';
import { useMemo, useState } from 'react';
import { Form } from 'react-final-form';
import { useSelector } from 'react-redux';
import { useToggle } from 'react-use';

import AccountsGroup from '@/components/accountsGroup';
import AddAccountModal from '@/components/addAccountModal';
import type { TAccountState, TCurrency } from '@/entites';
import {
    archivedAccountsGroupByCurrencyAndSortByUsage,
    currencies,
    recentlyUsedAccountsGroupByCurrency,
} from '@/store/history';

type TAccountStateByCurrency = Record<TCurrency['isoCode'], TAccountState[]>;

const TestPage: NextPage = () => {
    const [showModal, toggleModal] = useToggle(true);
    const recent = useSelector(recentlyUsedAccountsGroupByCurrency);
    const archivedAccontsByCurrency = useSelector(archivedAccountsGroupByCurrencyAndSortByUsage);
    const usedCurencies = useSelector(currencies);
    const usedAccounts = [...archivedAccontsByCurrency.values()].flat().map(({ account }) => account);

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
        <Form<{ accounts: TAccountStateByCurrency | undefined }>
            onSubmit={handleSubmit}
            mutators={mutators}
            initialValues={initialValues}
            render={({ handleSubmit, values }) => (
                <>
                    <Button
                        variant='contained'
                        onClick={toggleModal}
                    >
                        Create new account
                    </Button>
                    <form onSubmit={(...args) => void handleSubmit(...args)}>
                        <div className='container mx-auto my-20'>
                            {Object.entries(values.accounts ?? {}).map(([isoCode]) => (
                                <AccountsGroup
                                    key={isoCode}
                                    fieldName={`accounts.${isoCode}`}
                                    title={`Accounts in ${isoCode}`}
                                    archivedAccounts={archivedAccontsByCurrency.get(isoCode) ?? []}
                                />
                            ))}
                        </div>
                    </form>
                    <AddAccountModal
                        currencies={usedCurencies}
                        accounts={usedAccounts}
                        open={showModal}
                        onCancel={toggleModal}
                    />
                </>
            )}
        />
    );
};

export default TestPage;
