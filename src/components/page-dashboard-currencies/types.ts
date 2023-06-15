import { type DateTime } from 'luxon';

import { type TCurrency } from '@/entites';
import { type TMoney } from '@/types';

export type TRow = {
    id: TCurrency['id'];

    title: string;
    createdAt?: DateTime;
    lastReportAt?: DateTime;
    total: TMoney;
    totalInTargetCurrency: TMoney;
    totalInReserveCurrency: TMoney;
};
