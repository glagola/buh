import { type TCurrency } from '@/entites';
import { isNonEmpty } from '@/utils/array';

import { type TAccountStateByCurrency } from './form';

export function getUsedCurrencies(accountsStateByCurrencyCode: TAccountStateByCurrency): TCurrency[] {
    return Object.values(accountsStateByCurrencyCode).reduce<TCurrency[]>((res, states) => {
        if (isNonEmpty(states)) {
            res.push(states[0].account.currency);
        }
        return res;
    }, []);
}
