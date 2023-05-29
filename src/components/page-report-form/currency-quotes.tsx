import { Stack, Typography } from '@mui/material';
import { useFormContext, useWatch } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { getCurrencyByIdMap } from '@/store/buh';

import ExpressionInput from './expression-input';
import { type TForm } from './validation';

const CurrenciesQuotes = () => {
    const form = useFormContext<TForm>();

    useWatch({ control: form.control, name: 'exchangeRates' });
    const currencyById = useSelector(getCurrencyByIdMap);
    const exchangeRates = form.getValues('exchangeRates');

    console.log({ exchangeRates });

    return (
        <Stack spacing={2}>
            <Typography
                variant='h5'
                component='h2'
            >
                Currency quotes
            </Typography>
            {exchangeRates.map(({ currencyId }, index) => {
                const currency = currencyById.get(currencyId);
                if (undefined === currency) return null;

                return (
                    <ExpressionInput
                        key={currency.isoCode}
                        name={`quotes.${index}.formula`}
                        label={`Price of 1 ${currency.isoCode} in Abstract currency`}
                    />
                );
            })}
        </Stack>
    );
};

export default CurrenciesQuotes;
