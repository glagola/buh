import { Stack, Typography } from '@mui/material';
import { useFormContext, useWatch } from 'react-hook-form';

import ExpressionInput from '../expressionInput';
import { type THistoryItemForm } from './validation';

const CurrenciesQuotes = () => {
    const form = useFormContext<THistoryItemForm>();

    useWatch({ control: form.control, name: 'quotes' });
    return (
        <Stack spacing={2}>
            <Typography
                variant='h5'
                component='h2'
            >
                Currency quotes
            </Typography>
            {form.getValues('quotes').map(({ currency }, index) => (
                <ExpressionInput
                    key={currency.isoCode}
                    name={`quotes.${index}.formula`}
                    label={`Price of 1 ${currency.isoCode} in Abstract currency`}
                />
            ))}
        </Stack>
    );
};

export default CurrenciesQuotes;
