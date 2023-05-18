import AddIcon from '@mui/icons-material/Add';
import { Button, Container, Stack } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import NextJSLink from 'next/link';
import { useSelector } from 'react-redux';

import { columns } from './columns';
import ExportDB from './db-export';
import ImportDB from './db-import';
import { prepareRows } from './store-selectors';

const styles = {
    buttons: {
        my: 3,
    },
};

const HistoryPage = () => {
    const rows = useSelector(prepareRows);

    return (
        <Container>
            <Stack>
                <Stack
                    direction='row'
                    gap={3}
                    justifyContent='flex-end'
                    sx={styles.buttons}
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
