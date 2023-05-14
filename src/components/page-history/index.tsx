import AddIcon from '@mui/icons-material/Add';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Button, Container, Stack } from '@mui/material';
import { DataGrid, type GridValueFormatterParams, type GridColDef, type GridValueGetterParams } from '@mui/x-data-grid';
import NextJSLink from 'next/link';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';

import { majorCurrency, targetCurrency } from '@/settings';
import { useDBExport } from '@/store/history';

import { prepareRows } from './store-selectors';
import { type TRow, type TMoney } from './types';

const valueGetter = (params: GridValueGetterParams<TRow, TMoney>) => params.value?.amount;
const valueFormatter = (params: GridValueFormatterParams<TMoney['amount'] | undefined>) => `${params.value ?? ''}`; // TODO proper sum formatting

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
    const buh = useDBExport();

    const handleDownload = useCallback(() => {
        const fileData = JSON.stringify(buh);
        const blob = new Blob([fileData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'buh-history.json';
        link.href = url;
        link.click();
    }, [buh]);

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
                        startIcon={<CloudUploadIcon />}
                        variant='outlined'
                    >
                        Load DB
                    </Button>

                    <Button
                        startIcon={<CloudDownloadIcon />}
                        variant='outlined'
                        onClick={handleDownload}
                    >
                        Save DB
                    </Button>

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
