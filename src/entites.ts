import { z } from 'zod';

const zMoneyAmount = z.number();
export type TMoneyAmount = z.infer<typeof zMoneyAmount>;

const zId = z.string().uuid();
export const zDateTime = z.string().datetime({ offset: true });

export const zEntity = z.object({
    id: zId,
});

const zRawEntity = zEntity.partial();

export type TRawEntity = z.infer<typeof zRawEntity>;
export type TEntity = z.infer<typeof zEntity>;

const zDBEntity = zEntity.extend({
    createdAt: zDateTime,
});

export const zCurrencyTitle = z.string().min(3);

export const zCurrency = zEntity.extend({
    title: zCurrencyTitle,
});
const zRawCurrency = zCurrency.merge(zRawEntity);
export type TCurrency = z.infer<typeof zCurrency>;
export type TRawCurrency = z.infer<typeof zRawCurrency>;

const zExchangeRate = z.object({
    currencyId: zId,
    quote: zMoneyAmount.refine((value) => value > 0, 'Must be above 0'),
});

export type TExchangeRate = z.infer<typeof zExchangeRate>;

const zAccountDetails = z.object({
    title: z.string().min(3),
    currencyId: zId,
});

export const zRawAccount = zAccountDetails.merge(zDBEntity.partial());
export type TRawAccount = z.infer<typeof zRawAccount>;

export const zAccount = zAccountDetails.merge(zDBEntity);
export type TAccount = z.infer<typeof zAccount>;

const zAccountBalance = z.object({
    accountId: zId,
    balance: zMoneyAmount,
});

export type TAccountBalance = z.infer<typeof zAccountBalance>;

export const zReportDetails = z.object({
    balances: z.array(zAccountBalance).min(1),
    exchangeRates: z.array(zExchangeRate).min(1),
});

const zReport = zReportDetails.merge(zDBEntity);
export type TReport = z.infer<typeof zReport>;

export const zRawReport = zReportDetails.merge(zDBEntity.partial());
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
