import { z } from 'zod';

import { type TCurrency, ZAccount, ZCurrency, ZCurrencyISOCode } from '@/entites';
import { safeEvaluate } from '@/utils/expression';

const ZFormula = z.string().refine((value) => undefined !== safeEvaluate(value), 'Must be valid math expression');

const ZAccountState = z.object({
    account: ZAccount,
    formula: ZFormula,
});
export type TAccountState = z.infer<typeof ZAccountState>;

export const historyItemFormSchema = z.object({
    accounts: z
        .record(ZCurrencyISOCode, z.array(ZAccountState))
        .refine((value) => JSON.stringify(value) !== '{}', 'Must have at least one account'),
    quotes: z.array(
        z.object({
            currency: ZCurrency,
            formula: ZFormula.refine((value) => {
                const res = safeEvaluate(value);
                return undefined === res || 0 < res;
            }, 'Must be above 0'),
        }),
    ),
});

export type THistoryItemForm = z.infer<typeof historyItemFormSchema>;

export type TAccountStateByCurrency = Record<TCurrency['isoCode'], TAccountState[]>;
