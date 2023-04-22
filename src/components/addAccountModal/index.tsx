import { zodResolver } from '@hookform/resolvers/zod';
import { Autocomplete, Box, Button, Modal, TextField, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { type FC } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import type { TRawAccountDetails, TAccount, TCurrency } from '@/entites';

import * as S from './_styles';

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

const style = {
    position: 'absolute',
    top: '100px',
    left: '50%',
    transform: 'translate(-50%, 0)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

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
        <Modal
            open={props.open}
            onClose={props.onCancel}
        >
            <Box sx={style}>
                <Typography
                    component='h2'
                    variant='h5'
                    sx={{
                        borderBottom: '1px solid',
                        borderBottomColor: grey[300],
                        pb: 1,
                        mb: 3,
                    }}
                >
                    Add account
                </Typography>
                <S.Form onSubmit={onSubmit}>
                    <Controller
                        name='title'
                        control={control}
                        render={({ field: { value: _, ...field }, fieldState: { invalid, error } }) => (
                            <TextField
                                {...field}
                                label='Title'
                                error={invalid}
                                helperText={error?.message}
                            />
                        )}
                    />

                    <Controller
                        name='currency'
                        control={control}
                        render={({ field: { value: _, onChange, ...field }, fieldState: { invalid, error } }) => (
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
                                        helperText={error?.message}
                                    />
                                )}
                            />
                        )}
                    />

                    <S.Buttons>
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
                    </S.Buttons>
                </S.Form>
            </Box>
        </Modal>
    );
};

export default AddAccountModal;
