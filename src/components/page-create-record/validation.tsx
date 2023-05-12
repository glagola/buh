import { z } from 'zod';

import { type TCurrency, ZAccount, ZCurrency, ZCurrencyISOCode } from '@/entites';
import { safeEvaluate } from '@/utils/expression';

const ZFormula = z.string().refine((value) => undefined !== safeEvaluate(value), 'Must be valid math expression');

const ZAccountBalance = z.object({
    account: ZAccount,
    formula: ZFormula,
});

const ZCurrencyQuoteFormula = z.object({
    currency: ZCurrency,
    formula: ZFormula.refine((value) => {
        const res = safeEvaluate(value);
        return undefined === res || 0 < res;
    }, 'Must be above 0'),
});

export const historyItemFormSchema = z.object({
    accounts: z
        .record(ZCurrencyISOCode, z.array(ZAccountBalance))
        .refine((value) => JSON.stringify(value) !== '{}', 'Must have at least one account'),
    quotes: z.array(ZCurrencyQuoteFormula),
});

type TAccountBalance = z.infer<typeof ZAccountBalance>;

export type TCurrencyQuoteByFormula = z.infer<typeof ZCurrencyQuoteFormula>;

export type THistoryItemForm = z.infer<typeof historyItemFormSchema>;

export type TAccountBalanceByCurrency = Record<TCurrency['isoCode'], TAccountBalance[]>;
