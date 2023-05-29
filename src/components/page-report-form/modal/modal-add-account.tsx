import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material';
import { type FC } from 'react';
import { AutocompleteElement, FormContainer, TextFieldElement } from 'react-hook-form-mui';
import { useDispatch, useSelector } from 'react-redux';
import { z } from 'zod';

import { TAccount, TCurrency, TRawAccount, zCurrency, zRawAccount } from '@/entites';
import { actions, getCurrencies } from '@/store/buh';
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

const resolver = zodResolver(zForm);

type TProps = {
    open: boolean;
    onClose: () => void;
    onAdd: (account: TAccount) => void;
};

const AddAccountModal: FC<TProps> = (props) => {
    const dispatch = useDispatch();
    const currencies = useSelector(getCurrencies);

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
