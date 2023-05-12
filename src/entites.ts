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
    createdAt: z.string().datetime({ offset: true }),
});
export type TAccount = z.infer<typeof ZAccount>;

export const ZArchivedAccount = z.object({
    account: ZAccount,
    archivedAt: z.string().datetime({ offset: true }),
});
export type TArchivedAccount = z.infer<typeof ZArchivedAccount>;

export const ZAccountHistoryBalance = z.object({
    account: ZAccount,
    balance: z.number(),
});
export type TAccountHistoryState = z.infer<typeof ZAccountHistoryBalance>;

const ZRawHistoryItem = z.object({
    accountBalances: z.array(ZAccountHistoryBalance),
    quotes: z.array(ZCurrencyQuote),
});

export type TRawHistoryItem = z.infer<typeof ZRawHistoryItem>;

export const ZHistoryItem = ZRawHistoryItem.extend({
    createdAt: z.string().datetime({ offset: true }),
});
export type THistoryItem = z.infer<typeof ZHistoryItem>;

export const ZBuh = z.object({
    history: z.array(ZHistoryItem),
});
export type TBuh = z.infer<typeof ZBuh>;
