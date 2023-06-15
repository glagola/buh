import { createSelector } from '@reduxjs/toolkit';
import uniqBy from 'lodash/uniqBy';

import { requiredCurrencies } from '@/settings';
import { getCurrencies, getReportsChronologically } from '@/store/buh';

export const getCurrenciesToShow = createSelector([getCurrencies], (currencies) =>
    uniqBy([...requiredCurrencies, ...currencies], (currency) => currency.id),
);
