import { z } from 'zod';

import { zAccount, zCurrency } from '@/entites';
import { safeEvaluate } from '@/utils/expression';

const zFormula = z.string().refine((value) => undefined !== safeEvaluate(value), 'Must be valid math expression');

const zFormExchangeRate = z.object({
    currencyId: zCurrency.shape.id,
    formula: zFormula.refine((value) => {
        const res = safeEvaluate(value);
        return undefined === res || 0 < res;
    }, 'Must be above 0'),
});

const zFormAccountBalances = z
    .record(zAccount.shape.id, zFormula)
    .refine((o) => Object.keys(o).length > 1, 'Must be at least 1 account');

export const zForm = z.object({
    createdAt: z.coerce.string().datetime({ offset: true }),
    balances: zFormAccountBalances,
    exchangeRates: z.array(zFormExchangeRate).min(1),
});

export type TFormAccountBalances = z.infer<typeof zFormAccountBalances>;

export type TFormExchangeRate = z.infer<typeof zFormExchangeRate>;

export type TForm = z.infer<typeof zForm>;
