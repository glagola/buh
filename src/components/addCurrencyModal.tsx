import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { type FormEvent, type FC, useCallback } from 'react';
import { TextFieldElement, useForm } from 'react-hook-form-mui';

import { type TCurrency, ZCurrency } from '@/entites';

const styleDialogTitle = {
    borderWidth: 1,
};

const styleDialogActions = {
    gap: 3,
    p: 3,
    pt: 0,
};

const resolver = zodResolver(ZCurrency);

type TProps = {
    open: boolean;
    existingCurrencies: TCurrency[];
    onCancel: () => void;
    onSuccess: (rawCurrency: TCurrency) => void;
};

const fieldName = 'isoCode';

const AddCurrencyModal: FC<TProps> = (props) => {
    const form = useForm<TCurrency>({
        resolver,
        mode: 'all',
        defaultValues: {
            isoCode: '',
        },
    });

    const { existingCurrencies, onSuccess } = props;
    const handleSubmit = useCallback(
        (e: FormEvent<HTMLFormElement>) =>
            void form.handleSubmit((data) => {
                const alreadyExists = existingCurrencies.some(({ isoCode }) => isoCode === data.isoCode);

                if (alreadyExists) {
                    return form.setError(fieldName, { type: 'unique', message: 'Must be unique' });
                }

                onSuccess(data);
            })(e),
        [form, existingCurrencies, onSuccess],
    );

    const handleDialogAnimationEnd = useCallback(() => form.reset(), [form]);

    return (
        <Dialog
            open={props.open}
            onClose={props.onCancel}
            fullWidth
            maxWidth='sm'
            onAnimationEnd={handleDialogAnimationEnd}
        >
            <DialogTitle
                component='h2'
                variant='h5'
                sx={styleDialogTitle}
            >
                Add currency
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <TextFieldElement
                        fullWidth
                        control={form.control}
                        name={fieldName}
                        label='ISO currency code'
                    />
                </DialogContent>
                <DialogActions sx={styleDialogActions}>
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
    );
};

export default AddCurrencyModal;
