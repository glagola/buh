import 'chartjs-adapter-luxon';
import { type DateTime } from 'luxon';
import { Line } from 'react-chartjs-2';

import { type TMoneyAmount } from '@/entites';
import { isNonEmpty } from '@/utils/array';
import { formatMoneyWithCents } from '@/utils/format';

type TProps = {
    title: string;
    data: {
        x: DateTime;
        y: TMoneyAmount;
    }[];
};

export default function OverviewCharts({ data, title }: TProps) {
    return (
        <Line
            options={{
                animation: false,
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'month',
                        },
                    },

                    y: {
                        ticks: {
                            callback: (value) => formatMoneyWithCents(+value),
                        },
                    },
                },
                plugins: {
                    title: { display: true, text: title },
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => ` ${formatMoneyWithCents(context.parsed.y)}`,
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
                datasets: [
                    {
                        data,
                        borderColor: 'rgba(0, 0, 255, 0.4)',
                        backgroundColor: '#00F',
                    },
                ],
            }}
        />
    );
}
