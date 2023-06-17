import { Stack, Typography } from '@mui/material';
import { DataGrid, type GridRowSelectionModel } from '@mui/x-data-grid';
import { DateTime } from 'luxon';
import { useCallback, useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useSelector } from 'react-redux';

import { type TCurrency } from '@/entites';
import { getCurrencyByIdMap } from '@/store/buh';
import { isNonEmpty } from '@/utils/array';
import { formatMoneyWithCents } from '@/utils/format';

import { columns } from './columns';
import { type TAmountData, getChartDataSourceByCurrencyIdMap, prepareRowsContext } from './selector';

const colors = ['#fd7f6f', '#7eb0d5', '#b2e061', '#bd7ebe', '#ffb55a', '#ffee65', '#beb9db', '#fdcce5', '#8bd3c7'];

export default function DashboardCurrencies() {
    const chartDataPerCurrencyIdMap = useSelector(getChartDataSourceByCurrencyIdMap);
    const currencyByIdMap = useSelector(getCurrencyByIdMap);
    const rowsContext = useSelector(prepareRowsContext);
    const rows = rowsContext?.rows ?? [];
    const [selected, setSelected] = useState<TCurrency['id'][]>([]);

    const handleSelection = useCallback((rowSelectionModel: GridRowSelectionModel) => {
        setSelected(rowSelectionModel.map(String));
    }, []);

    const datasets = useMemo(() => {
        const res = [];

        for (const currencyId of selected) {
            const data = chartDataPerCurrencyIdMap.get(currencyId);
            const currency = currencyByIdMap.get(currencyId);
            if (!data || !currency) continue;

            res.push({
                data,
                borderColor: colors[res.length % colors.length],
                backgroundColor: colors[res.length % colors.length],
                label: currency.title,
                yAxisID: currencyId,
            });
        }

        return res;
    }, [selected, chartDataPerCurrencyIdMap, currencyByIdMap]);

    const scales = useMemo(() => {
        const res: Record<string, object> = {
            x: {
                type: 'time',
                time: {
                    unit: 'month',
                },
            },
        };

        for (const currencyId of selected) {
            const data = chartDataPerCurrencyIdMap.get(currencyId);
            if (!data) continue;

            res[currencyId] = {
                type: 'linear',
                display: false,
            };
        }

        return res;
    }, [chartDataPerCurrencyIdMap, selected]);

    return (
        <Stack gap={3}>
            {rowsContext?.report && (
                <Typography
                    component='h1'
                    variant='h4'
                >
                    Currencies amounts according to {DateTime.fromISO(rowsContext.report.createdAt).toISODate()} report
                </Typography>
            )}
            <DataGrid
                autoHeight
                density='compact'
                rows={rows}
                columns={columns}
                checkboxSelection
                disableRowSelectionOnClick
                onRowSelectionModelChange={handleSelection}
            />
            {datasets.length > 0 && (
                <Line
                    options={{
                        animation: false,
                        responsive: true,
                        maintainAspectRatio: true,
                        scales,
                        interaction: {
                            intersect: false,
                            mode: 'index',
                        },
                        plugins: {
                            legend: {
                                position: 'top',
                            },

                            tooltip: {
                                callbacks: {
                                    label: (context) => {
                                        const raw = context.raw as TAmountData;
                                        return ` ${raw.currency.title}: ${formatMoneyWithCents(context.parsed.y)}`;
                                    },
                                    title: (items) => {
                                        if (isNonEmpty(items)) {
                                            const date = (items[0].raw as { x: DateTime }).x;

                                            return date.toISODate() as string;
                                        }
                                    },
                                },
                            },
                        },
                    }}
                    data={{
                        datasets,
                    }}
                />
            )}
        </Stack>
    );
}
