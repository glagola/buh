import _ from 'lodash';

import { type TCurrency } from '@/entites';
import { isNonEmpty } from '@/utils/array';

import { type TAccountStateByCurrency } from './validation';

export function currenciesOfAccounts(accountsStateByCurrencyCode: TAccountStateByCurrency): TCurrency[] {
    return Object.values(accountsStateByCurrencyCode).reduce<TCurrency[]>((res, states) => {
        if (isNonEmpty(states)) {
            res.push(states[0].account.currency);
        }
        return res;
    }, []);
}

export const uniqueCurrencies = (...sources: TCurrency[][]): TCurrency[] =>
    _.uniqBy(sources.flat(1), ({ isoCode }) => isoCode);
