import { useFormContext, useWatch } from 'react-hook-form';

import { type TCurrency } from '@/entites';
import { isNonEmpty } from '@/utils/array';

import ExpressionInput from './expressionInput';
import { type THistoryItemForm } from './form';

const CurrencyQuotesField = () => {
    const form = useFormContext<THistoryItemForm>();
    useWatch({ control: form.control });

    const currencies = Object.values(form.getValues('accounts')).reduce<TCurrency[]>((res, states) => {
        if (isNonEmpty(states)) {
            res.push(states[0].account.currency);
        }
        return res;
    }, []);

    return (
        <ul>
            {currencies.map((currency, index) => (
                <li key={currency.isoCode}>
                    <ExpressionInput
                        name={`quotes.${index}.formula`}
                        label={`Price of 1 ${currency.isoCode} in Abstract currency`}
                    />
                </li>
            ))}
        </ul>
    );
};

export default CurrencyQuotesField;
