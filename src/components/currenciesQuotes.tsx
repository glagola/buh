import { Stack, Typography } from '@mui/material';
import { useFormContext, useWatch } from 'react-hook-form';

import { type TCurrency } from '@/entites';
import { isNonEmpty } from '@/utils/array';

import ExpressionInput from './expressionInput';
import { type THistoryItemForm } from './form';

const CurrenciesQuotes = () => {
    const form = useFormContext<THistoryItemForm>();
    useWatch({ control: form.control });

    const currencies = Object.values(form.getValues('accounts')).reduce<TCurrency[]>((res, states) => {
        if (isNonEmpty(states)) {
            res.push(states[0].account.currency);
        }
        return res;
    }, []);

    return (
        <>
            <Typography
                variant='h5'
                component='h2'
                sx={{ mb: 2 }}
            >
                Currency quotes
            </Typography>
            <Stack spacing={2}>
                {currencies.map((currency, index) => (
                    <ExpressionInput
                        key={currency.isoCode}
                        name={`quotes.${index}.formula`}
                        label={`Price of 1 ${currency.isoCode} in Abstract currency`}
                    />
                ))}
            </Stack>
        </>
    );
};

export default CurrenciesQuotes;
