import { evaluate } from 'mathjs';

export const safeEvaluate = (expr: string): number | undefined => {
    try {
        return evaluate(expr) as number;
    } catch {
        return undefined;
    }
};
