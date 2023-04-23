import { zodResolver } from '@hookform/resolvers/zod';
import {
    Autocomplete,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField,
} from '@mui/material';
import { type FC } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import type { TRawAccountDetails, TAccount, TCurrency } from '@/entites';

const schema = z.object({
    title: z.string().min(3),
    currency: z.object(
        {
            isoCode: z.string().min(3),
        },
        {
            invalid_type_error: 'Required',
        },
    ),
});

const getCurrencyLabel = (currency: TCurrency) => currency.isoCode;

type TProps = {
    open: boolean;
    currencies: TCurrency[];
    accounts: TAccount[];
    onCancel: () => void;
    onSuccess: (rawAccount: TRawAccountDetails) => void;
};

const AddAccountModal: FC<TProps> = (props) => {
    const { handleSubmit, control } = useForm<TRawAccountDetails>({
        mode: 'onBlur',
        resolver: zodResolver(schema),
    });
    const onSubmit = handleSubmit(props.onSuccess);

    return (
        <>
            <Dialog
                open={props.open}
                onClose={props.onCancel}
                fullWidth
                maxWidth='sm'
            >
                <DialogTitle
                    component='h2'
                    variant='h5'
                >
                    Add account
                </DialogTitle>
                <form onSubmit={(...args) => void onSubmit(...args)}>
                    <DialogContent>
                        <Stack
                            direction='column'
                            spacing={3}
                        >
                            <Controller
                                name='title'
                                control={control}
                                render={({ field: { value: _, ...field }, fieldState: { invalid, error } }) => (
                                    <TextField
                                        {...field}
                                        label='Title'
                                        error={invalid}
                                        helperText={error?.message ?? ''}
                                    />
                                )}
                            />

                            <Controller
                                name='currency'
                                control={control}
                                render={({
                                    field: { value: _, onChange, ...field },
                                    fieldState: { invalid, error },
                                }) => (
                                    <Autocomplete
                                        {...field}
                                        onChange={(_, value) => onChange(value)}
                                        disablePortal
                                        options={props.currencies}
                                        getOptionLabel={getCurrencyLabel}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label='Currency'
                                                error={invalid}
                                                helperText={error?.message ?? ''}
                                            />
                                        )}
                                    />
                                )}
                            />
                        </Stack>
                    </DialogContent>
                    <DialogActions>
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
                </form>
            </Dialog>
        </>
    );
};

export default AddAccountModal;
