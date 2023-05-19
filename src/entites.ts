import { z } from 'zod';

const ZUUID = z.string().uuid();

const ZHistoryItemId = ZUUID;

export type THistoryItemId = z.infer<typeof ZHistoryItemId>;

export const ZCurrencyISOCode = z
    .string()
    .min(3)
    .refine((value) => value.toUpperCase() === value, 'Must be in uppercase');

export const ZCurrency = z.object({
    isoCode: ZCurrencyISOCode,
});
export type TCurrency = z.infer<typeof ZCurrency>;

const ZCurrencyQuote = z.object({
    currency: ZCurrency,
    quote: z.number().refine((value) => value > 0, 'Must be above 0'),
});

export type TCurrencyQuote = z.infer<typeof ZCurrencyQuote>;

const ZRawAccountDetails = z.object({
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

const ZArchivedAccount = z.object({
    account: ZAccount,
    archivedAt: z.string().datetime({ offset: true }),
});
export type TArchivedAccount = z.infer<typeof ZArchivedAccount>;

const ZAccountHistoryBalance = z.object({
    account: ZAccount,
    balance: z.number(),
});

const ZHistoryItem = z.object({
    id: ZHistoryItemId.optional(),
    accountBalances: z.array(ZAccountHistoryBalance),
    quotes: z.array(ZCurrencyQuote),
    createdAt: z.string().datetime({ offset: true }),
});

export type THistoryItem = z.infer<typeof ZHistoryItem>;

export const ZBuh = z.object({
    history: z.array(ZHistoryItem),
});
export type TBuh = z.infer<typeof ZBuh>;

export type TBuhContainer = {
    db: TBuh;
    isChanged: boolean;
};
