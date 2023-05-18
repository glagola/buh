import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Container, Stack } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import NextJSLink from 'next/link';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { columns, totalInTargetCurrencyHeader, totalOfAccountsInOtherCurrenciesInMajorCurrencyHeader } from './columns';
import ExportDB from './db-export';
import ImportDB from './db-import';
import LineChart from './line-chart';
import { prepareRows } from './store-selectors';

const styles = {
    chart: { flexGrow: 1, width: '50%' },
};

const HistoryPage = () => {
    const rows = useSelector(prepareRows);

    const charts = useMemo(
        () => [
            {
                title: totalInTargetCurrencyHeader.headerName,
                data: rows.map((row) => ({
                    x: row.createdAt,
                    y: row.totalInTargetCurrency.amount,
                })),
            },
            {
                title: totalOfAccountsInOtherCurrenciesInMajorCurrencyHeader.headerName,
                data: rows.map((row) => ({
                    x: row.createdAt,
                    y: row.totalOfAccountsInOtherCurrenciesInMajorCurrency.amount,
                })),
            },
        ],
        [rows],
    );

    return (
        <Container sx={{ p: 3 }}>
            <Stack
                direction='column'
                gap={3}
            >
                <Stack
                    direction='row'
                    gap={3}
                    justifyContent='flex-end'
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

                {3 < rows.length && (
                    <Stack
                        direction='row'
                        gap={3}
                    >
                        {charts.map((params) => (
                            <Box
                                sx={styles.chart}
                                key={params.title}
                            >
                                <LineChart {...params} />
                            </Box>
                        ))}
                    </Stack>
                )}

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
