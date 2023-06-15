import { Stack } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useSelector } from 'react-redux';

import { columns } from './columns';
import { prepareRows } from './selector';

export default function DashboardCurrencies() {
    const rows = useSelector(prepareRows);

    return (
        <Stack gap={3}>
            <DataGrid
                autoHeight
                density='compact'
                rows={rows}
                columns={columns}
            />
        </Stack>
    );
}
