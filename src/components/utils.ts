import { type TCurrency } from '@/entites';
import { isNonEmpty } from '@/utils/array';

import { type TAccountStateByCurrency } from './form';

export function currenciesOfAccounts(accountsStateByCurrencyCode: TAccountStateByCurrency): TCurrency[] {
    return Object.values(accountsStateByCurrencyCode).reduce<TCurrency[]>((res, states) => {
        if (isNonEmpty(states)) {
            res.push(states[0].account.currency);
        }
        return res;
    }, []);
}

export const uniqueCurrencies = (...sources: TCurrency[][]): TCurrency[] => {
    const set = new Set<TCurrency['isoCode']>();
    const res: TCurrency[] = [];

    for (const source of sources) {
        for (const currency of source) {
            if (set.has(currency.isoCode)) continue;

            set.add(currency.isoCode);
            res.push(currency);
        }
    }

    return res;
};
