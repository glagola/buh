import { type GridValueFormatterParams, type GridColDef, type GridValueGetterParams } from '@mui/x-data-grid';
import { DateTime } from 'luxon';
import { Link } from 'react-router-dom';

import { TReport, type TMoneyAmount } from '@/entites';
import { reserveCurrency, targetCurrency } from '@/settings';
import { type TMoney } from '@/types';
import { formatMoneyWithCents } from '@/utils/format';

import { type TRow } from './types';

const valueGetter = (params: GridValueGetterParams<TRow, TMoney>) => params.value?.amount;
const moneyFormatter = ({ value }: GridValueFormatterParams<TMoneyAmount | undefined>) =>
    `${undefined === value ? '' : formatMoneyWithCents(value)}`;

export const totalInTargetCurrencyHeader = {
    type: 'number',
    field: 'totalInTargetCurrency',
    headerName: `Total, ${targetCurrency.title}`,
    valueGetter,
    valueFormatter: moneyFormatter,
    flex: 1,
    maxWidth: 112,
};

export const totalOfAccountsInOtherCurrenciesInMajorCurrencyHeader = {
    type: 'number',
    field: 'totalOfAccountsInOtherCurrenciesInMajorCurrency',
    headerName: `Non ${targetCurrency.title} assets, ${reserveCurrency.title}`,
    valueGetter,
    valueFormatter: moneyFormatter,
    flex: 1,
    maxWidth: 150,
};

const defaults = {
    flex: 1,
};

const valueFormatter = ({ value }: GridValueFormatterParams<TReport>) =>
    `${(value && DateTime.fromISO(value.createdAt).toISODate()) ?? ''}`;

export const columns: GridColDef<TRow>[] = [
    {
        ...defaults,
        field: 'title',
        headerName: `Currency`,
    },

    {
        ...defaults,
        type: 'number',
        field: 'total',
        headerName: 'Amount',
        valueGetter,
        valueFormatter: moneyFormatter,
    },

    {
        ...defaults,
        type: 'number',
        field: 'totalInTargetCurrency',
        headerName: `Amount, ${targetCurrency.title}`,
        valueGetter,
        valueFormatter: moneyFormatter,
    },

    {
        ...defaults,
        type: 'number',
        field: 'totalInReserveCurrency',
        headerName: `Amount, ${reserveCurrency.title}`,
        valueGetter,
        valueFormatter: moneyFormatter,
    },

    {
        ...defaults,
        field: 'firstReport',
        headerName: 'First Usage',
        valueFormatter,
        renderCell: (params) => {
            const report = params.value as TReport;
            return report && <Link to={`/report/${encodeURIComponent(report.id)}`}>{params.formattedValue}</Link>;
        },
    },
    {
        ...defaults,
        field: 'lastReport',
        headerName: 'Last usage',
        valueFormatter,
        renderCell: (params) => {
            const report = params.value as TReport;
            return report && <Link to={`/report/${encodeURIComponent(report.id)}`}>{params.formattedValue}</Link>;
        },
    },
];
