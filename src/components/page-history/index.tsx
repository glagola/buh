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
    `${value ? formatter.format(value) : ''}`;

const columns: GridColDef<TRow>[] = [
    {
        field: 'createdAt',
        headerName: 'Date',
        valueFormatter: (params: GridValueFormatterParams<TRow['createdAt']>) => `${params.value.toLocaleString()}`,
        headerAlign: 'center',
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
        headerName: targetCurrency.isoCode,
        valueGetter,
        valueFormatter: moneyFormatter,
        width: 120,
    },
    {
        type: 'number',
        field: 'totalOfAccountsInOtherCurrenciesInMajorCurrency',
        headerName: majorCurrency.isoCode,
        valueGetter,
        valueFormatter: moneyFormatter,
        width: 120,
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
