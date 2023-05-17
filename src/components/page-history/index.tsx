import AddIcon from '@mui/icons-material/Add';
import { Button, Container, Stack } from '@mui/material';
import { DataGrid, type GridValueFormatterParams, type GridColDef, type GridValueGetterParams } from '@mui/x-data-grid';
import NextJSLink from 'next/link';
import { useSelector } from 'react-redux';

import { majorCurrency, targetCurrency } from '@/settings';

import ExportDB from './db-export';
import ImportDB from './db-import';
import { prepareRows } from './store-selectors';
import { type TRow, type TMoney } from './types';

const formatter = new Intl.NumberFormat('ru-RU', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

const valueGetter = (params: GridValueGetterParams<TRow, TMoney>) => params.value?.amount;
const moneyFormatter = ({ value }: GridValueFormatterParams<TMoney['amount'] | undefined>) =>
    `${undefined === value ? '' : formatter.format(value)}`;

const percentFormatter = ({ value }: GridValueFormatterParams<TMoney['amount'] | undefined>) =>
    `${undefined === value ? '' : formatter.format(value * 100)}%`;

const columns: GridColDef<TRow>[] = [
    {
        type: 'number',
        field: 'deltaFromPreviuosReportInTargetCurrency',
        headerName: `Difference, ${targetCurrency.isoCode}`,
        valueGetter,
        valueFormatter: moneyFormatter,
        width: 120,
    },

    {
        field: 'createdAt',
        headerName: 'Report date',
        headerAlign: 'center',
        valueFormatter: ({ value }: GridValueFormatterParams<TRow['createdAt']>) =>
            `${(value && value.toISODate()) ?? ''}`,
    },
    {
        type: 'number',
        field: 'totalInTargetCurrency',
        headerName: `Total, ${targetCurrency.isoCode}`,
        valueGetter,
        valueFormatter: moneyFormatter,
        width: 120,
    },
    {
        type: 'number',
        field: 'totalOfAccountsInTargetCurrency',
        headerName: `Assets, ${targetCurrency.isoCode}`,
        valueGetter,
        valueFormatter: moneyFormatter,
        width: 120,
    },
    {
        type: 'number',
        field: 'totalOfAccountsInOtherCurrenciesInMajorCurrency',
        headerName: `Non ${targetCurrency.isoCode} assets, ${majorCurrency.isoCode}`,
        valueGetter,
        valueFormatter: moneyFormatter,
        width: 150,
    },
    {
        type: 'number',
        field: 'moneyInMajorCurrencyPercent',
        headerName: `Non ${targetCurrency.isoCode} assets, %`,
        valueGetter,
        valueFormatter: percentFormatter,
        width: 140,
    },

    {
        type: 'number',
        field: 'majorToTargetCurrencyExchangeRate',
        headerName: `${majorCurrency.isoCode}/${targetCurrency.isoCode}`,
        valueGetter,
        valueFormatter: moneyFormatter,
        width: 100,
    },

    {
        type: 'number',
        field: 'totalInMajorCurrency',
        headerName: `Total, ${majorCurrency.isoCode}`,
        valueGetter,
        valueFormatter: moneyFormatter,
        width: 100,
    },

    // TODO add remove&edit record action buttons
];

const HistoryPage = () => {
    const rows = useSelector(prepareRows);

    return (
        <Container>
            <Stack>
                <Stack
                    direction='row'
                    gap={3}
                    justifyContent='flex-end'
                    sx={{ mt: 3, mb: 3 }}
                >
                    <ImportDB />
                    <ExportDB />

                    <Button
                        startIcon={<AddIcon />}
                        variant='outlined'
                        component={NextJSLink}
                        href='/add'
                    >
                        Report
                    </Button>
                </Stack>
                <DataGrid
                    autoHeight
                    density='compact'
                    rows={rows}
                    columns={columns}
                />
            </Stack>
        </Container>
    );
};

export default HistoryPage;
