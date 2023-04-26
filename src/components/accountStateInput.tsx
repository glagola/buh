import { TextField } from '@mui/material';
import { useCallback, useState } from 'react';
import { type FieldValues, type UseControllerProps, useController } from 'react-hook-form';

import { safeEvaluate } from '@/utils/expression';

const AccountStateInput = <T extends FieldValues>(props: UseControllerProps<T>) => {
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

    return (
        <TextField
            fullWidth
            size='small'
            ref={ref}
            name={name}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            value={focused || invalid ? value : safeEvaluate(value) ?? ''} // TODO: format money properly with spaces
            error={invalid}
        />
    );
};

export default AccountStateInput;
