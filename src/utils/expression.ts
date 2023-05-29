import { evaluate } from 'mathjs';

const sanitizeExpression = (expr: string | undefined): string =>
    (expr ?? '').replace(/\s+/g, '').replace(/[\.,]/g, '.');

export const safeEvaluate = (expr: string): number | undefined => {
    try {
        return evaluate(sanitizeExpression(expr)) as number;
    } catch (e) {
        console.log(e);
        return undefined;
    }
};

export const evaluateForSure = (expr: string): number => evaluate(sanitizeExpression(expr)) as number;
