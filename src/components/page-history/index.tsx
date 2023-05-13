import { Container } from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
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
            <DataGrid
                autoHeight
                rows={rows}
                columns={columns}
            />
        </Container>
    );
};

export default HistoryPage;
