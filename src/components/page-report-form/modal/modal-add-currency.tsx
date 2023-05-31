import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { type FC, useCallback, useMemo } from 'react';
import { TextFieldElement, useForm } from 'react-hook-form-mui';
import { useDispatch, useSelector } from 'react-redux';
import { z } from 'zod';

import { type TCurrency, zCurrencyISOCode, type TRawCurrency } from '@/entites';
import { actions, getCurrencies } from '@/store/buh';

const styleDialogTitle = {
    borderWidth: 1,
};

const styleDialogActions = {
    gap: 3,
    p: 3,
    pt: 0,
};

type TProps = {
    open: boolean;
    onClose: () => void;
};

const useValidation = () => {
    const currencies = useSelector(getCurrencies);

    return useMemo(() => {
        const usedIsoCodes = currencies.reduce((res, { isoCode }) => res.add(isoCode), new Set());

        return zodResolver(
            z.object({
                isoCode: zCurrencyISOCode.refine((value) => !usedIsoCodes.has(value), 'Already exists'),
            }),
        );
    }, [currencies]);
};

const AddCurrencyModal: FC<TProps> = (props) => {
    const resolver = useValidation();
    const dispatch = useDispatch();

    const form = useForm<TCurrency>({
        resolver,
        mode: 'all',
        defaultValues: {
            isoCode: '',
        },
    });

    const handleDialogAnimationEnd = useCallback(() => form.reset(), [form]);

    return (
        <Dialog
            open={props.open}
            onClose={props.onClose}
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
            <form
                onSubmit={form.handleSubmit((data: TRawCurrency) => {
                    dispatch(actions.storeCurrency(data));
                    props.onClose();
                })}
            >
                <DialogContent>
                    <TextFieldElement
                        fullWidth
                        control={form.control}
                        name='isoCode'
                        label='ISO currency code'
                    />
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
            </form>
        </Dialog>
    );
};

export default AddCurrencyModal;
