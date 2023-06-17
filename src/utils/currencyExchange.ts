import { isZero } from 'mathjs';

import { type TCurrency, type TExchangeRate } from '@/entites';

export const buildConverter = (quotes: TExchangeRate[]) => {
    const rates = new Map<TCurrency['id'], TExchangeRate['quote']>(quotes.map((q) => [q.currencyId, q.quote]));

    return (sum: number, from: TCurrency, to: TCurrency): number => {
        if (isZero(sum)) return 0;

        const fromRate = rates.get(from.id);
        const toRate = rates.get(to.id);

        if (undefined === fromRate || undefined === toRate) {
            throw new Error(`No way to convert from ${from.title} to ${to.title}`);
        }

        return (sum * fromRate) / toRate;
    };
};
