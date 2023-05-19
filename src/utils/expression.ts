import { evaluate } from 'mathjs';

export const safeEvaluate = (expr: string): number | undefined => {
    expr = expr.replace(/\s+/g, '');
    expr = expr.replace(/[\.,]/g, '.');

    try {
        return evaluate(expr.replace(/\s+/g, '')) as number;
    } catch {
        return undefined;
    }
};

export const evaluateForSure = (expr: string): number => evaluate(expr) as number;
