import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material';
import { type FC } from 'react';
import { AutocompleteElement, FormContainer, TextFieldElement } from 'react-hook-form-mui';
import { z } from 'zod';

import type { TRawAccountDetails, TCurrency } from '@/entites';

const resolver = zodResolver(
    z.object({
        title: z.string().min(3),
        currency: z.object(
            {
                isoCode: z.string().min(3),
            },
            {
                invalid_type_error: 'Required',
            },
        ),
    }),
);

const getCurrencyLabel = (currency: TCurrency) => currency.isoCode;

type TProps = {
    open: boolean;
    currencies: TCurrency[];
    onCancel: () => void;
    onSuccess: (rawAccount: TRawAccountDetails) => void;
};

const AddAccountModal: FC<TProps> = (props) => (
    <Dialog
        open={props.open}
        onClose={props.onCancel}
        fullWidth
        maxWidth='sm'
    >
        <DialogTitle
            component='h2'
            variant='h5'
            sx={{
                borderWidth: 1,
            }}
        >
            Add account
        </DialogTitle>
        <FormContainer
            resolver={resolver}
            mode='onBlur'
            onSuccess={props.onSuccess}
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
                        autocompleteProps={{
                            disablePortal: true,
                            getOptionLabel: getCurrencyLabel,
                        }}
                        options={props.currencies}
                    />
                </Stack>
            </DialogContent>
            <DialogActions sx={{ gap: 3, p: 3, pt: 0 }}>
                <Button
                    variant='text'
                    onClick={props.onCancel}
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

export default AddAccountModal;
