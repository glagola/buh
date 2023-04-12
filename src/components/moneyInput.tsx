import { evaluate } from 'mathjs';
import { type FC, useMemo, useState } from 'react';

import { type TCurrency } from '@/entites';

import { clsxm } from './utils/classNames';

type TProps = {
    title: string;
    currency: TCurrency;
    value: string;
};

const MoneyInput: FC<TProps> = (props) => {
    const [focused, setFocused] = useState(false);
    const [formula, setFormula] = useState(props.value);

    const [value, isError] = useMemo(() => {
        try {
            const res = evaluate(formula) as number | undefined;
            const exprValue = undefined === res ? '' : res.toFixed(2);
            return [focused ? formula : exprValue, '' === exprValue];
        } catch (error) {
            return [formula, true];
        }
    }, [focused, formula]);

    return (
        <>
            <div>
                {props.title}, {props.currency.isoCode}
            </div>
            <input
                type='text'
                className={clsxm(
                    'rounded border-2 border-gray-300 bg-transparent p-2 shadow-sm focus:border-indigo-700 focus:outline-none',
                    {
                        'border-rose-500 focus:border-rose-500': isError,
                    },
                )}
                value={value}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onChange={(e) =>
                    setFormula(
                        e.target.value
                            .replace(',', '.')
                            .replace(/[^0-9. +-\/*]/m, ''),
                    )
                }
            />
        </>
    );
};

export default MoneyInput;
