const moneyWithCentsFormatter = new Intl.NumberFormat('ru-RU', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

const moneyRoundFormatter = new Intl.NumberFormat('ru-RU', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat('ru-RU', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 20,
});

export const formatMoneyWithCents = (value: number) => moneyWithCentsFormatter.format(value);

export const formatMoneyRoundUp = (value: number) => moneyRoundFormatter.format(value);

export const formatNumber = (value: number) => numberFormatter.format(value);
