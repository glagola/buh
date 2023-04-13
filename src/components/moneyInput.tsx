import { evaluate } from 'mathjs';
import { type FC, useState } from 'react';

import { safeEvaluate } from '@/utils/expression';

import { clsxm } from './utils/classNames';

type TProps = {
    title: string;
    value: string;
    error?: string;
    onChange: (event: React.ChangeEvent<HTMLElement> | string) => void;
};

const MoneyInput: FC<TProps> = (props) => {
    const [focused, setFocused] = useState(false);
    const isError = !!props.error;

    const evalResult = safeEvaluate(props.value);

    // TODO: format money properly with spaces
    const value = focused || isError ? props.value : undefined === evalResult ? '' : evalResult.toFixed(2);

    return (
        <>
            <div>{props.title}</div>
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
                onChange={(e) => props.onChange(e.target.value.replace(',', '.').replace(/[^0-9. +-\/*]/m, ''))}
            />
        </>
    );
};

export default MoneyInput;
