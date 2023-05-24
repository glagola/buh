import { type ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { useBeforeUnload } from 'react-use';

import { getIsDBChanged } from '@/store/buh';

type TProps = {
    children: ReactElement;
};

const DBGuard = (props: TProps): ReactElement => {
    const changed = useSelector(getIsDBChanged);

    useBeforeUnload(changed, 'You have unsaved changes, are you sure?');

    return props.children;
};

export default DBGuard;
