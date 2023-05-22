import { type Dispatch, type SetStateAction, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { type TCurrency } from '@/entites';
import { requiredCurrencies } from '@/settings';
import { getPreviouslyUsedCurrencies } from '@/store/history';

export const useCurrencies = () => {
    const fromHistory = useSelector(getPreviouslyUsedCurrencies);

    const [current, setCurrent] = useState<TCurrency[]>([]);

    const res = useMemo<TCurrency[]>(() => {
        const union = [...requiredCurrencies, ...fromHistory, ...current];

        const set = new Set<TCurrency['isoCode']>([]);

        return union.filter(({ isoCode }) => {
            if (set.has(isoCode)) return false;

            set.add(isoCode);
            return true;
        });
    }, [fromHistory, current]);

    return [res, setCurrent] as [TCurrency[], Dispatch<SetStateAction<TCurrency[]>>];
};
