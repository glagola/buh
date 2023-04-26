import ArchiveIcon from '@mui/icons-material/Archive';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import { Box, IconButton, List, ListItem, ListItemText, Stack, Typography } from '@mui/material';
import { DateTime } from 'luxon';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useToggle } from 'react-use';

import { type TAccount, type TArchivedAccount } from '@/entites';

import { type THistoryItemForm } from '../form';
import AccountStateInput from './accountStateInput';

type TProps = {
    title: string;
    fieldPath: string;
    archivedAccounts: TArchivedAccount[];
};

const AccountsGroupedByCurrency = (props: TProps) => {
    const [isArchiving, toggleArchive] = useToggle(false);
    const { control } = useFormContext<THistoryItemForm>();
    const acc = useFieldArray({
        name: props.fieldPath,
        control,
    });

    const currentAccounts = new Set(acc.fields.map(({ account }) => account.id));
    const archive = props.archivedAccounts.reduce(
        (res, state) => {
            if (currentAccounts.has(state.account.id)) {
                res.used.add(state.account.id);
            } else {
                res.rest.add(state);
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
            {!!acc.fields.length && (
                <List>
                    {acc.fields.map((state, index) => (
                        <ListItem key={state.id}>
                            <Stack
                                direction='row'
                                sx={{ width: '100%' }}
                                alignItems='center'
                                spacing={2}
                            >
                                <ListItemText
                                    sx={{ flexGrow: 0 }}
                                    primary={`${state.account.title}, ${state.account.currency.isoCode}`}
                                />
                                <div style={{ flexGrow: 1 }}>
                                    <AccountStateInput
                                        control={control}
                                        name={`${props.fieldPath}.${index}.formula`}
                                    />
                                </div>
                                {isArchiving && (
                                    <IconButton
                                        aria-label='archive'
                                        onClick={() => acc.remove(index)}
                                    >
                                        {archive.used.has(state.account.id) ? <ArchiveIcon /> : <HighlightOffIcon />}
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
                                    onClick={() => {
                                        acc.append({
                                            account,
                                            formula: '',
                                        });
                                    }}
                                >
                                    <UnarchiveIcon />
                                </IconButton>
                            }
                        >
                            <ListItemText
                                primary={`${account.title}, ${
                                    account.currency.isoCode
                                } - Last used at ${DateTime.fromJSDate(archivedAt).toLocaleString()}`}
                            />
                        </ListItem>
                    ))}
                </List>
            )}
        </Box>
    );
};

export default AccountsGroupedByCurrency;
