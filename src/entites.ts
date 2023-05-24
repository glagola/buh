import { z } from 'zod';

const zId = z.string().uuid();
const zDateTime = z.string().datetime({ offset: true });

const zEntity = z.object({
    id: zId,
});

const zRawEntity = zEntity.partial();

export type TRawEntity = z.infer<typeof zRawEntity>;
export type TEntity = z.infer<typeof zEntity>;

export const zCurrencyISOCode = z
    .string()
    .min(3)
    .refine((value) => value.toUpperCase() === value, 'Must be in uppercase');

export const zCurrency = zEntity.extend({
    isoCode: zCurrencyISOCode,
});
const zRawCurrency = zCurrency.merge(zRawEntity);
export type TCurrency = z.infer<typeof zCurrency>;
export type TRawCurrency = z.infer<typeof zRawCurrency>;

const zExchangeRate = z.object({
    currencyId: zId,
    quote: z.number().refine((value) => value > 0, 'Must be above 0'),
});

export type TExchangeRate = z.infer<typeof zExchangeRate>;

export const zAccount = zEntity.extend({
    title: z.string(),
    currencyId: zId,

    createdAt: zDateTime,
});
export type TAccount = z.infer<typeof zAccount>;

const zRawAccount = zAccount.extend({
    id: zId.optional(),
});
export type TRawAccount = z.infer<typeof zRawAccount>;

const zAccountBalance = z.object({
    accountId: zId,
    balance: z.number(),
});

const zReport = zEntity.extend({
    balances: z.array(zAccountBalance),
    exchangeRates: z.array(zExchangeRate),
    createdAt: zDateTime,
});

export type TReport = z.infer<typeof zReport>;

const zRawReport = zReport.extend({
    id: zId.optional(),
});

export type TRawReport = z.infer<typeof zRawReport>;

export const zBuh = z.object({
    reports: z.array(zReport),
    accounts: z.array(zAccount),
    currencies: z.array(zCurrency),
});
export type TBuh = z.infer<typeof zBuh>;

export type TDBContainer = {
    db: TBuh;
    isChanged: boolean;
};
