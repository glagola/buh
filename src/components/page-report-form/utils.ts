import uniqBy from 'lodash/uniqBy';

import { type TAccount, type TCurrency } from '@/entites';
import { requiredCurrencies } from '@/settings';

import { type TFormAccountBalances, type TFormExchangeRate } from './validation';

export function buildFormExchangeRates(
    current: TFormExchangeRate[],
    balances: TFormAccountBalances,
    currencyByAccountId: Map<TAccount['id'], TCurrency>,
): TFormExchangeRate[] {
    const unqiueCurrencies = uniqBy(
        [
            ...requiredCurrencies,
            ...Object.keys(balances).reduce<TCurrency[]>((res, accountId) => {
                const currency = currencyByAccountId.get(accountId);
                if (currency) {
                    res.push(currency);
                }

                return res;
            }, []),
        ],
        (currency) => currency.id,
    );

    const formulaByCurrencyId = new Map(current.map((item) => [item.currencyId, item.formula]));

    return unqiueCurrencies.map(({ id: currencyId }) => ({
        currencyId,
        formula: formulaByCurrencyId.get(currencyId) ?? '',
    }));
}
