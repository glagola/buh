import { safeEvaluate } from './utils/expression';

export const isFormulaValid = (formula: string): string | undefined => {
    const res = safeEvaluate(formula);

    if (!res) {
        return 'Invalid formula';
    }
};
