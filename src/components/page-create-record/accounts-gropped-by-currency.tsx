import ArchiveIcon from '@mui/icons-material/Archive';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import { Box, IconButton, List, ListItem, ListItemText, Stack, Typography } from '@mui/material';
import { DateTime } from 'luxon';
import { useFormContext, useWatch } from 'react-hook-form';
import { useToggle } from 'react-use';

import { type TCurrency, type TAccount, type TArchivedAccount } from '@/entites';

import ExpressionInput from './expression-input';
import { type THistoryItemForm } from './validation';

type TProps = {
    title: string;
    currency: TCurrency;
    archivedAccounts: TArchivedAccount[];
    onAdd: (account: TAccount) => void;
    onRemove: (account: TAccount) => void;
};

const AccountsGroupedByCurrency = (props: TProps) => {
    const [isArchiving, toggleArchive] = useToggle(false);
    const { control, getValues } = useFormContext<THistoryItemForm>();

    useWatch({ control, name: `accounts.${props.currency.isoCode}` });

    const accounts = getValues(`accounts.${props.currency.isoCode}`) ?? [];

    const currentAccounts = new Set(accounts.map(({ account }) => account.id));
    const archive = props.archivedAccounts.reduce(
        (res, accountBalance) => {
            if (currentAccounts.has(accountBalance.account.id)) {
                res.used.add(accountBalance.account.id);
            } else {
                res.rest.add(accountBalance);
            }

            return res;
        },
        { rest: new Set<TArchivedAccount>(), used: new Set<TAccount['id']>() },
    );

    return (
        <Box>
            <Stack
                direction='row'
                justifyContent='space-between'
                alignItems='center'
            >
                <Typography
                    variant='h5'
                    component='h2'
                >
                    {props.title}
                </Typography>
                <IconButton
                    aria-label='edit'
                    onClick={toggleArchive}
                >
                    {isArchiving ? <CloseIcon /> : <EditIcon />}
                </IconButton>
            </Stack>
            {!!accounts.length && (
                <List>
                    {accounts.map((accountBalance, index) => (
                        <ListItem key={accountBalance.account.id}>
                            <Stack
                                direction='row'
                                sx={{ width: '100%' }}
                                alignItems='center'
                                spacing={2}
                            >
                                <ListItemText
                                    sx={{ flexShrink: 0 }}
                                    primary={`${accountBalance.account.title}, ${accountBalance.account.currency.isoCode}`}
                                />
                                <ExpressionInput
                                    control={control}
                                    name={`accounts.${accountBalance.account.currency.isoCode}.${index}.formula`}
                                />

                                {isArchiving && (
                                    <IconButton
                                        aria-label='archive'
                                        onClick={() => {
                                            const accountBalance = accounts[index];
                                            if (accountBalance) {
                                                props.onRemove(accountBalance.account);
                                            }
                                        }}
                                    >
                                        {archive.used.has(accountBalance.account.id) ? <ArchiveIcon /> : <HighlightOffIcon />}
                                    </IconButton>
                                )}
                            </Stack>
                        </ListItem>
                    ))}
                </List>
            )}
            {isArchiving && !!archive.rest.size && (
                <List sx={{ borderTopWidth: 1 }}>
                    {[...archive.rest].map(({ account, archivedAt }) => (
                        <ListItem
                            key={account.id + account.currency.isoCode}
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
                                primary={`${account.title}, ${
                                    account.currency.isoCode
                                } - Last used at ${DateTime.fromISO(archivedAt).toLocaleString()}`}
                            />
                        </ListItem>
                    ))}
                </List>
            )}
        </Box>
    );
};

export default AccountsGroupedByCurrency;
