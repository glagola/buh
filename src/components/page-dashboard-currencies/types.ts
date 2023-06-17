import { type TReport, type TCurrency } from '@/entites';
import { type TMoney } from '@/types';

export type TRow = {
    id: TCurrency['id'];

    title: string;
    firstReport?: TReport;
    lastReport?: TReport;
    total: TMoney;
    totalInTargetCurrency: TMoney;
    totalInReserveCurrency: TMoney;
};
