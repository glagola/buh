import { type ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { useBeforeUnload } from 'react-use';

import { isDBChanged } from '@/store/history';

type TProps = {
    children: ReactElement;
};

const DBGuard = (props: TProps): ReactElement => {
    const changed = useSelector(isDBChanged);

    useBeforeUnload(changed, 'You have unsaved changes, are you sure?');

    return props.children;
};

export default DBGuard;
