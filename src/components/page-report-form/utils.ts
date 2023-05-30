import uniqBy from 'lodash/uniqBy';

import { type TAccount, type TCurrency } from '@/entites';
import { requiredCurrencies } from '@/settings';

import { type TFormAccountBalance, type TFormExchangeRate } from './validation';

export function buildFormExchangeRates(
    current: TFormExchangeRate[],
    balances: TFormAccountBalance[],
    currencyByAccountId: Map<TFormAccountBalance['accountId'], TCurrency>,
): TFormExchangeRate[] {
    const unqiueCurrencies = uniqBy(
        [
            ...requiredCurrencies,
            ...balances.reduce<TCurrency[]>((res, { accountId }) => {
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

export const sortBalances = (accounts: TFormAccountBalance[], accountById: Map<TAccount['id'], TAccount>) =>
    accounts.sort((a, b) => {
        const _a = accountById.get(a.accountId);
        const _b = accountById.get(b.accountId);

        if (!_a || !_b) return 0;

        return _a.title.localeCompare(_b.title);
    });
