import ArchiveIcon from '@mui/icons-material/Archive';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import { IconButton, List, ListItem, ListItemText, Stack, Typography } from '@mui/material';
import { DateTime } from 'luxon';
import { Fragment, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useToggle } from 'react-use';

import { type TCurrency, type TAccount } from '@/entites';
import { getAccountByIdMap, getAccountLastUsageById, getAccountsByCurrencyId, getCurrencyByIdMap } from '@/store/buh';
import { compareDateTime } from '@/utils/time';

import * as S from './_styles';
import ExpressionInput from './expression-input';
import { getCurrencyByAccountIdMap } from './selector';
import { TFormAccountBalance, type TForm } from './validation';

type TProps = {
    currency: TCurrency;
    onAdd: (account: TAccount) => void;
    onRemove: (account: TAccount) => void;
};

const useArchivedAccounts = (currency: TCurrency, balances: TFormAccountBalance[]): TAccount[] => {
    const accountsByCurrencyId = useSelector(getAccountsByCurrencyId);

    return useMemo(() => {
        const accounts = accountsByCurrencyId.get(currency.id) ?? [];
        const inUsage = balances.reduce((res, { accountId }) => res.add(accountId), new Set());

        return accounts
            .filter(({ id }) => !inUsage.has(id))
            .sort(compareDateTime((item) => DateTime.fromISO(item.createdAt)));
    }, [accountsByCurrencyId, balances, currency.id]);
};

const AccountsGroupedByCurrency = (props: TProps) => {
    const [isArchiving, toggleArchive] = useToggle(false);
    const form = useFormContext<TForm>();

    useWatch({ control: form.control, name: 'balances' });

    const currencyByAccountId = useSelector(getCurrencyByAccountIdMap);
    const balances = (form.getValues('balances') ?? []).filter((acc) => {
        const currency = currencyByAccountId.get(acc.accountId);

        if (!currency) return false;

        return currency.id === props.currency.id;
    });
    const archivedAccounts = useArchivedAccounts(props.currency, balances);

    const accountById = useSelector(getAccountByIdMap);
    const currencyById = useSelector(getCurrencyByIdMap);
    const accountLastUsageById = useSelector(getAccountLastUsageById);

    return (
        <>
            <S.Row>
                <Stack
                    direction='row'
                    justifyContent='space-between'
                    alignItems='center'
                >
                    <Typography
                        variant='h5'
                        component='h2'
                    >
                        {`Accounts in ${props.currency.isoCode}`}
                    </Typography>
                    <IconButton
                        aria-label='edit'
                        onClick={toggleArchive}
                    >
                        {isArchiving ? <CloseIcon /> : <EditIcon />}
                    </IconButton>
                </Stack>
            </S.Row>

            {!!balances.length &&
                balances.map((balance, index) => {
                    const account = accountById.get(balance.accountId);
                    if (!account) return null;

                    const currency = currencyById.get(account.currencyId);
                    if (!currency) return null;

                    return (
                        <Fragment key={account.id}>
                            <ListItemText primary={`${account.title}, ${currency.isoCode}`} />

                            <S.ColumnInput archiving={isArchiving}>
                                <ExpressionInput
                                    control={form.control}
                                    name={`balances.${index}.formula`}
                                    formatAsMoney
                                />
                            </S.ColumnInput>
                            {isArchiving && (
                                <IconButton
                                    aria-label='archive'
                                    onClick={() => {
                                        props.onRemove(account);
                                    }}
                                >
                                    <ArchiveIcon />
                                </IconButton>
                            )}
                        </Fragment>
                    );
                })}

            {isArchiving && !!archivedAccounts.length && (
                <S.Row as={List}>
                    {archivedAccounts.map((account) => {
                        const currency = currencyById.get(account.currencyId);
                        if (!currency) return null;

                        const lastUsedAt = accountLastUsageById.get(account.id);

                        return (
                            <ListItem
                                key={account.id}
                                secondaryAction={
                                    <IconButton
                                        edge='end'
                                        aria-label='unarchive'
                                        onClick={() => props.onAdd(account)}
                                    >
                                        <UnarchiveIcon />
                                    </IconButton>
                                }
                            >
                                <ListItemText
                                    primary={`${account.title}, ${currency.isoCode}${
                                        lastUsedAt ? `- Last used at ${lastUsedAt.toLocaleString()}` : ''
                                    }`}
                                />
                            </ListItem>
                        );
                    })}
                </S.Row>
            )}
        </>
    );
};

export default AccountsGroupedByCurrency;
