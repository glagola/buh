import _ from 'lodash';

import { type TCurrency } from '@/entites';
import { isNonEmpty } from '@/utils/array';

import { type TAccountBalanceByCurrency } from './validation';

export function currenciesOfAccounts(accountsBalancesByCurrency: TAccountBalanceByCurrency): TCurrency[] {
    return Object.values(accountsBalancesByCurrency).reduce<TCurrency[]>((res, balances) => {
        if (isNonEmpty(balances)) {
            res.push(balances[0].account.currency);
        }
        return res;
    }, []);
}

export const uniqueCurrencies = (...sources: TCurrency[][]): TCurrency[] =>
    _.uniqBy(sources.flat(1), ({ isoCode }) => isoCode);
