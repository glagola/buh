import { z } from 'zod';

import { safeEvaluate } from './utils/expression';

export const ZCurrency = z.object({
    isoCode: z.string(),
});
export type TCurrency = z.infer<typeof ZCurrency>;

export const ZRawAccountDetails = z.object({
    title: z.string(),
    currency: ZCurrency,
});
export type TRawAccountDetails = z.infer<typeof ZRawAccountDetails>;

export const ZAccount = z.object({
    title: z.string(),
    currency: ZCurrency,
    id: z.string(),
    createdAt: z.date(),
});
export type TAccount = z.infer<typeof ZAccount>;

export const ZArchivedAccount = z.object({
    account: ZAccount,
    archivedAt: z.date(),
});
export type TArchivedAccount = z.infer<typeof ZArchivedAccount>;

export const ZAccountState = z.object({
    account: ZAccount,
    formula: z.string().refine((value) => undefined !== safeEvaluate(value)),
});
export type TAccountState = z.infer<typeof ZAccountState>;

export const ZAccountHistoryState = z.object({
    account: ZAccount,
    value: z.number(),
});
export type TAccountHistoryState = z.infer<typeof ZAccountHistoryState>;

export const ZHistoryItem = z.object({
    accounts: z.array(ZAccountHistoryState),
    createdAt: z.date(),
});
export type THistoryItem = z.infer<typeof ZHistoryItem>;

export const ZBuh = z.object({
    history: z.array(ZHistoryItem),
});
export type TBuh = z.infer<typeof ZBuh>;
