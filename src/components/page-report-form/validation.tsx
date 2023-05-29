import { z } from 'zod';

import { zAccount, zCurrency, zDateTime, zReportDetails } from '@/entites';
import { safeEvaluate } from '@/utils/expression';

const zFormula = z.string().refine((value) => undefined !== safeEvaluate(value), 'Must be valid math expression');

const zFormAccountBalance = z.object({
    accountId: zAccount.shape.id,
    formula: zFormula,
});

const zFormExchangeRate = z.object({
    currencyId: zCurrency.shape.id,
    formula: zFormula.refine((value) => {
        const res = safeEvaluate(value);
        return undefined === res || 0 < res;
    }, 'Must be above 0'),
});

export const zForm = z.object({
    createdAt: zDateTime.optional(),
    balances: z.array(zFormAccountBalance).min(1),
    exchangeRates: z.array(zFormExchangeRate).min(1),
});

export type TFormAccountBalance = z.infer<typeof zFormAccountBalance>;

export type TFormExchangeRate = z.infer<typeof zFormExchangeRate>;

export type TForm = z.infer<typeof zForm>;
