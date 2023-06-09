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
import { type TForm, type TFormAccountBalances } from './validation';

const useAccs = (currency: TCurrency, balances: TFormAccountBalances): [TAccount[], TAccount[]] => {
    const accountsByCurrencyId = useSelector(getAccountsByCurrencyId);
    const accountById = useSelector(getAccountByIdMap);

    return useMemo(() => {
        const accounts = accountsByCurrencyId.get(currency.id) ?? [];
        const current = [];
        const archived = [];

        for (const account of accounts) {
            if (account.id in balances) {
                current.push(account);
            } else {
                archived.push(account);
            }
        }

        current.sort((a, b) => {
            const _a = accountById.get(a.id);
            const _b = accountById.get(b.id);

            if (!_a || !_b) return 0;

            return _a.title.localeCompare(_b.title);
        });

        archived.sort(compareDateTime((item) => DateTime.fromISO(item.createdAt)));

        return [current, archived];
    }, [accountById, accountsByCurrencyId, balances, currency.id]);
};

type TProps = {
    currency: TCurrency;
    onAdd: (account: TAccount) => void;
    onRemove: (account: TAccount) => void;
};

const AccountsGroupedByCurrency = (props: TProps) => {
    const [isArchiving, toggleArchive] = useToggle(false);
    const form = useFormContext<TForm>();

    useWatch({ control: form.control, name: 'balances' });

    const [currentAccounts, archivedAccounts] = useAccs(props.currency, form.getValues('balances'));

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
                        {`Accounts in ${props.currency.title}`}
                    </Typography>
                    <IconButton
                        aria-label='edit'
                        onClick={toggleArchive}
                    >
                        {isArchiving ? <CloseIcon /> : <EditIcon />}
                    </IconButton>
                </Stack>
            </S.Row>

            {!!currentAccounts.length &&
                currentAccounts.map((account) => {
                    const currency = currencyById.get(account.currencyId);
                    if (!currency) return null;

                    return (
                        <Fragment key={account.id}>
                            <ListItemText primary={`${account.title}, ${currency.title}`} />

                            <S.ColumnInput archiving={isArchiving}>
                                <ExpressionInput
                                    control={form.control}
                                    name={`balances.${account.id}`}
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
                                    primary={`${account.title}, ${currency.title}${
                                        lastUsedAt ? ` - Last used at ${lastUsedAt.toLocaleString()}` : ''
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
