import { Stack, Typography } from '@mui/material';
import { type FC } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { type TCurrency } from '@/entites';
import { isNonEmpty } from '@/utils/array';

import ExpressionInput from './expressionInput';
import { type THistoryItemForm } from './form';
import { requiredCurrencies } from './hooks';

const CurrenciesQuotes = () => {
    const form = useFormContext<THistoryItemForm>();
    useWatch({ control: form.control });
    const uniqueCurrency = new Set(requiredCurrencies.map((c) => c.isoCode));

    const currencies = Object.values(form.getValues('accounts')).reduce<TCurrency[]>(
        (res, states) => {
            if (isNonEmpty(states) && !uniqueCurrency.has(states[0].account.currency.isoCode)) {
                res.push(states[0].account.currency);
            }
            return res;
        },
        [...requiredCurrencies],
    );

    return (
        <Stack spacing={2}>
            <Typography
                variant='h5'
                component='h2'
            >
                Currency quotes
            </Typography>
            {currencies.map((currency, index) => (
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
