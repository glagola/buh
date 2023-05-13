import AddIcon from '@mui/icons-material/Add';
import { Button, Container, Stack } from '@mui/material';
import { DataGrid, type GridValueFormatterParams, type GridColDef, type GridValueGetterParams } from '@mui/x-data-grid';
import NextJSLink from 'next/link';
import { useSelector } from 'react-redux';

import { majorCurrency, targetCurrency } from '@/settings';

import { prepareRows } from './store-selectors';
import { type TRow, type TMoney } from './types';

const valueGetter = (params: GridValueGetterParams<TRow, TMoney>) => params.value?.amount;
const valueFormatter = (params: GridValueFormatterParams<TMoney['amount'] | undefined>) => `${params.value ?? ''}`;

const columns: GridColDef<TRow>[] = [
    {
        field: 'createdAt',
        headerName: 'Date',
        valueFormatter: (params: GridValueFormatterParams<TRow['createdAt']>) => `${params.value.toLocaleString()}`,
    },
    {
        type: 'number',
        field: 'totalInTargetCurrency',
        headerName: `Total, ${targetCurrency.isoCode}`,
        valueGetter,
        valueFormatter,
    },
    {
        type: 'number',
        field: 'totalOfAccountsInTargetCurrency',
        headerName: targetCurrency.isoCode,
        valueGetter,
        valueFormatter,
    },
    {
        type: 'number',
        field: 'totalOfAccountsInOtherCurrenciesInMajorCurrency',
        headerName: majorCurrency.isoCode,
        valueGetter,
        valueFormatter,
    },
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
                    rows={rows}
                    columns={columns}
                />
            </Stack>
        </Container>
    );
};

export default HistoryPage;
