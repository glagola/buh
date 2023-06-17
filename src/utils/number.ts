export const isZero = (v: number, eps = 1e-18): boolean => Math.abs(v) < eps;
