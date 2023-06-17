import { type GridValueFormatterParams, type GridColDef, type GridValueGetterParams } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';

import { reserveCurrency, targetCurrency } from '@/settings';
import { type TMoney } from '@/types';
import { formatMoneyWithCents } from '@/utils/format';

import { type TRow } from './types';
import { type TMoneyAmount } from '@/entites';

const valueGetter = (params: GridValueGetterParams<TRow, TMoney>) => params.value?.amount;
const moneyFormatter = ({ value }: GridValueFormatterParams<TMoneyAmount | undefined>) =>
    `${undefined === value ? '' : formatMoneyWithCents(value)}`;

const percentFormatter = ({ value }: GridValueFormatterParams<number>) => `${formatMoneyWithCents(value * 100)} %`;

const defaults = {
    flex: 1,
};

export const totalInTargetCurrencyHeader = {
    ...defaults,
    type: 'number',
    field: 'totalInTargetCurrency',
    headerName: `Total, ${targetCurrency.title}`,
    valueGetter,
    valueFormatter: moneyFormatter,
    maxWidth: 112,
};

export const totalOfAccountsInOtherCurrenciesInMajorCurrencyHeader = {
    ...defaults,
    type: 'number',
    field: 'totalOfAccountsInOtherCurrenciesInMajorCurrency',
    headerName: `Non ${targetCurrency.title} assets, ${reserveCurrency.title}`,
    valueGetter,
    valueFormatter: moneyFormatter,
    maxWidth: 150,
};

export const columns: GridColDef<TRow>[] = [
    {
        ...defaults,
        type: 'number',
        field: 'deltaFromPreviuosReportPercent',
        headerName: `Difference, %`,
        valueFormatter: percentFormatter,
        maxWidth: 100,
    },

    {
        ...defaults,
        type: 'number',
        field: 'deltaFromPreviuosReportInTargetCurrency',
        headerName: `Difference, ${targetCurrency.title}`,
        valueGetter,
        valueFormatter: moneyFormatter,
        maxWidth: 111,
    },

    {
        ...defaults,
        type: 'number',
        field: 'deltaPerMonthAverageInTargetCurrency',
        headerName: `AVG per month diff, ${targetCurrency.title}`,
        valueGetter,
        valueFormatter: moneyFormatter,
    },
    {
        ...defaults,
        maxWidth: 93,
        field: 'createdAt',
        headerName: 'Report date',
        valueFormatter: ({ value }: GridValueFormatterParams<TRow['createdAt']>) => {
            return `${(value && value.toISODate()) ?? ''}`;
        },

        renderCell: (params) => <Link to={`/report/${encodeURIComponent(params.id)}`}>{params.formattedValue}</Link>,
    },
    totalInTargetCurrencyHeader,
    {
        ...defaults,
        type: 'number',
        field: 'totalOfAccountsInTargetCurrency',
        headerName: `Assets, ${targetCurrency.title}`,
        valueGetter,
        valueFormatter: moneyFormatter,
        maxWidth: 112,
    },
    totalOfAccountsInOtherCurrenciesInMajorCurrencyHeader,
    {
        ...defaults,
        type: 'number',
        field: 'moneyInMajorCurrencyPercent',
        headerName: `Non ${targetCurrency.title} assets, %`,
        valueFormatter: percentFormatter,
        maxWidth: 131,
    },

    {
        ...defaults,
        type: 'number',
        field: 'majorToTargetCurrencyExchangeRate',
        headerName: `${reserveCurrency.title}/${targetCurrency.title}`,
        valueGetter,
        valueFormatter: moneyFormatter,
        maxWidth: 71,
    },

    {
        ...defaults,
        type: 'number',
        field: 'totalInMajorCurrency',
        headerName: `Total, ${reserveCurrency.title}`,
        valueGetter,
        valueFormatter: moneyFormatter,
        maxWidth: 91,
    },

    // TODO add remove&edit record action buttons
];
