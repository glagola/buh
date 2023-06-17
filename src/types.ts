import { type TMoneyAmount, type TCurrency } from './entites';

export type TMoney = {
    currency: TCurrency;
    amount: TMoneyAmount;
};
