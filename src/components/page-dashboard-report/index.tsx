import { Box, Stack } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { columns, totalInTargetCurrencyHeader, totalOfAccountsInOtherCurrenciesInMajorCurrencyHeader } from './columns';
import LineChart from './line-chart';
import { prepareRows } from './selector';

const styles = {
    chart: { flexGrow: 1, width: '50%' },
};

export default function DashboardReport() {
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
        <Stack gap={3}>
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
    );
}
