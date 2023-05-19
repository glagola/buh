import { type GridValueFormatterParams, type GridColDef, type GridValueGetterParams } from '@mui/x-data-grid';

import { majorCurrency, targetCurrency } from '@/settings';
import { formatMoneyWithCents } from '@/utils/format';

import { type TRow, type TMoney } from './types';

const valueGetter = (params: GridValueGetterParams<TRow, TMoney>) => params.value?.amount;
const moneyFormatter = ({ value }: GridValueFormatterParams<TMoney['amount'] | undefined>) =>
    `${undefined === value ? '' : formatMoneyWithCents(value)}`;

const percentFormatter = ({ value }: GridValueFormatterParams<number>) => `${formatMoneyWithCents(value * 100)} %`;

export const totalInTargetCurrencyHeader = {
    type: 'number',
    field: 'totalInTargetCurrency',
    headerName: `Total, ${targetCurrency.isoCode}`,
    valueGetter,
    valueFormatter: moneyFormatter,
    flex: 1,
    maxWidth: 112,
};

export const totalOfAccountsInOtherCurrenciesInMajorCurrencyHeader = {
    type: 'number',
    field: 'totalOfAccountsInOtherCurrenciesInMajorCurrency',
    headerName: `Non ${targetCurrency.isoCode} assets, ${majorCurrency.isoCode}`,
    valueGetter,
    valueFormatter: moneyFormatter,
    flex: 1,
    maxWidth: 150,
};

export const columns: GridColDef<TRow>[] = [
    {
        type: 'number',
        field: 'deltaFromPreviuosReportPercent',
        headerName: `Difference, %`,
        valueFormatter: percentFormatter,
        flex: 1,
        maxWidth: 100,
    },

    {
        type: 'number',
        field: 'deltaFromPreviuosReportInTargetCurrency',
        headerName: `Difference, ${targetCurrency.isoCode}`,
        valueGetter,
        valueFormatter: moneyFormatter,
        flex: 1,
        maxWidth: 111,
    },

    {
        type: 'number',
        field: 'deltaPerMonthAverageInTargetCurrency',
        headerName: `AVG per month diff, ${targetCurrency.isoCode}`,
        valueGetter,
        valueFormatter: moneyFormatter,
        flex: 1,
    },

    {
        field: 'createdAt',
        headerName: 'Report date',
        valueFormatter: ({ value }: GridValueFormatterParams<TRow['createdAt']>) =>
            `${(value && value.toISODate()) ?? ''}`,
        flex: 1,
        maxWidth: 93,
    },
    totalInTargetCurrencyHeader,
    {
        type: 'number',
        field: 'totalOfAccountsInTargetCurrency',
        headerName: `Assets, ${targetCurrency.isoCode}`,
        valueGetter,
        valueFormatter: moneyFormatter,
        flex: 1,
        maxWidth: 112,
    },
    totalOfAccountsInOtherCurrenciesInMajorCurrencyHeader,
    {
        type: 'number',
        field: 'moneyInMajorCurrencyPercent',
        headerName: `Non ${targetCurrency.isoCode} assets, %`,
        valueFormatter: percentFormatter,
        flex: 1,
        maxWidth: 131,
    },

    {
        type: 'number',
        field: 'majorToTargetCurrencyExchangeRate',
        headerName: `${majorCurrency.isoCode}/${targetCurrency.isoCode}`,
        valueGetter,
        valueFormatter: moneyFormatter,
        flex: 1,
        maxWidth: 71,
    },

    {
        type: 'number',
        field: 'totalInMajorCurrency',
        headerName: `Total, ${majorCurrency.isoCode}`,
        valueGetter,
        valueFormatter: moneyFormatter,
        flex: 1,
        maxWidth: 91,
    },

    // TODO add remove&edit record action buttons
];