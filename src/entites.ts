import { z } from 'zod';

export const ZCurrencyISOCode = z
    .string()
    .min(3)
    .refine((value) => value.toUpperCase() === value, 'Must be in uppercase');

export const ZCurrency = z.object({
    isoCode: ZCurrencyISOCode,
});
export type TCurrency = z.infer<typeof ZCurrency>;

export const ZCurrencyQuote = z.object({
    currency: ZCurrency,
    quote: z.number().refine((value) => value > 0, 'Must be above 0'),
});

export type TCurrencyQuote = z.infer<typeof ZCurrencyQuote>;

export const ZRawAccountDetails = z.object({
    title: z.string(),
    currency: ZCurrency,
});
export type TRawAccountDetails = z.infer<typeof ZRawAccountDetails>;

export const ZAccount = z.object({
    title: z.string(),
    currency: ZCurrency,
    id: z.string(),
    createdAt: z.string().datetime(),
});
export type TAccount = z.infer<typeof ZAccount>;

export const ZArchivedAccount = z.object({
    account: ZAccount,
    archivedAt: z.string().datetime(),
});
export type TArchivedAccount = z.infer<typeof ZArchivedAccount>;

export const ZAccountHistoryState = z.object({
    account: ZAccount,
    value: z.number(),
});
export type TAccountHistoryState = z.infer<typeof ZAccountHistoryState>;

const ZRawHistoryItem = z.object({
    accounts: z.array(ZAccountHistoryState),
    quotes: z.array(ZCurrencyQuote),
});

export type TRawHistoryItem = z.infer<typeof ZRawHistoryItem>;

export const ZHistoryItem = ZRawHistoryItem.extend({
    createdAt: z.string().datetime(),
});
export type THistoryItem = z.infer<typeof ZHistoryItem>;

export const ZBuh = z.object({
    history: z.array(ZHistoryItem),
});
export type TBuh = z.infer<typeof ZBuh>;
