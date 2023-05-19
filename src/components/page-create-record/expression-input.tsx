import { TextField } from '@mui/material';
import { useCallback, useState } from 'react';
import { type FieldValues, type UseControllerProps, useController } from 'react-hook-form';

import { safeEvaluate } from '@/utils/expression';
import { formatMoneyWithCents, formatNumber } from '@/utils/format';

type TProps = {
    label?: string;
    formatAsMoney?: boolean;
};

const ExpressionInput = <T extends FieldValues>(props: UseControllerProps<T> & TProps) => {
    const [focused, setFocused] = useState(false);

    const {
        field: { onChange, onBlur, value, name, ref },
        fieldState: { invalid },
    } = useController(props);

    const handleFocus = useCallback(() => setFocused(true), [setFocused]);
    const handleBlur = useCallback(() => {
        setFocused(false);
        onBlur();
    }, [setFocused, onBlur]);

    let processedValues: string | undefined = value;

    if (!focused && !invalid) {
        const evalRes = safeEvaluate(value);

        if (typeof evalRes === 'number') {
            processedValues = props.formatAsMoney ? formatMoneyWithCents(evalRes) : formatNumber(evalRes);
        }
    }

    return (
        <TextField
            fullWidth
            size='small'
            ref={ref}
            name={name}
            label={props.label}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            value={processedValues ?? ''} // TODO: format money properly with spaces
            error={invalid}
        />
    );
};

export default ExpressionInput;
