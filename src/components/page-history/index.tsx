import AddIcon from '@mui/icons-material/Add';
import { Button, Container, Stack } from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import NextJSLink from 'next/link';
import { useSelector } from 'react-redux';

import { prepareRows } from './store-selectors';

const columns: GridColDef[] = [
    { field: 'createdAt', headerName: 'Date' },
    { field: 'totalInTargetCurrency', headerName: 'Total, RUB' },
    { field: 'totalOfAccountsInTargetCurrency', headerName: 'RUB' },
    { field: 'totalOfAccountsInOtherCurrenciesInMajorCurrency', headerName: 'USD' },
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
