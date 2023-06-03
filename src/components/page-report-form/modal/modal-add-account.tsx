import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material';
import { createSelector } from '@reduxjs/toolkit';
import groupBy from 'lodash/groupBy';
import { useMemo, type FC } from 'react';
import { AutocompleteElement, FormContainer, TextFieldElement } from 'react-hook-form-mui';
import { useDispatch, useSelector } from 'react-redux';
import { type z } from 'zod';

import { type TAccount, type TCurrency, zCurrency, zRawAccount } from '@/entites';
import { actions, getAccountByIdMap, getCurrencies } from '@/store/buh';
import { nowStr } from '@/utils/time';
import { generateUUID } from '@/utils/uuid';

const styleDialogTitle = {
    borderWidth: 1,
};

const autocompleteProps = {
    getOptionLabel: (currency: TCurrency) => currency.isoCode,
    isOptionEqualToValue: (option: TCurrency, value: TCurrency) => option.id === value.id,
};

const styleDialogActions = {
    gap: 3,
    p: 3,
    pt: 0,
};

const zForm = zRawAccount.omit({ currencyId: true }).extend({
    currency: zCurrency,
});

type TForm = z.infer<typeof zForm>;

const getAccountsTitleByCurrencyId = createSelector([getAccountByIdMap], (accounts) =>
    [...accounts.values()].reduce((res, account) => {
        const arr = res.get(account.currencyId) ?? new Set();
        arr.add(account.title);
        res.set(account.currencyId, arr);

        return res;
    }, new Map<TCurrency['id'], Set<TAccount['title']>>()),
);

type TProps = {
    open: boolean;
    onClose: () => void;
    onAdd: (account: TAccount) => void;
};

const AddAccountModal: FC<TProps> = (props) => {
    const dispatch = useDispatch();
    const currencies = useSelector(getCurrencies);
    const accountUniqueIDs = useSelector(getAccountsTitleByCurrencyId);

    const resolver = useMemo(
        () =>
            zodResolver(
                zForm.refine(
                    (rawFormAccount) => {
                        if (!rawFormAccount.currency?.id) return true;

                        const existingTitles = accountUniqueIDs.get(rawFormAccount.currency.id) ?? new Set();

                        return !existingTitles.has(rawFormAccount.title);
                    },
                    { message: 'Must be unique within the currency selected', path: ['title'] },
                ),
            ),
        [accountUniqueIDs],
    );

    return (
        <Dialog
            open={props.open}
            onClose={props.onClose}
            fullWidth
            maxWidth='sm'
        >
            <DialogTitle
                component='h2'
                variant='h5'
                sx={styleDialogTitle}
            >
                Add account
            </DialogTitle>
            <FormContainer<TForm>
                resolver={resolver}
                mode='onBlur'
                onSuccess={({ currency, ...rest }) => {
                    const account: TAccount = {
                        ...rest,
                        id: generateUUID(),
                        createdAt: nowStr(),
                        currencyId: currency.id,
                    };

                    dispatch(actions.storeAccount(account));
                    props.onAdd(account);
                    props.onClose();
                }}
            >
                <DialogContent>
                    <Stack
                        direction='column'
                        spacing={3}
                    >
                        <TextFieldElement
                            name='title'
                            label='Title'
                        />

                        <AutocompleteElement
                            name='currency'
                            label='Currency'
                            autocompleteProps={autocompleteProps}
                            options={currencies}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={styleDialogActions}>
                    <Button
                        variant='text'
                        onClick={props.onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant='contained'
                        type='submit'
                    >
                        Add
                    </Button>
                </DialogActions>
            </FormContainer>
        </Dialog>
    );
};

export default AddAccountModal;
