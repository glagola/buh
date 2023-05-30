import { DateTime } from 'luxon';

export const nowStr = (): string => {
    const str = DateTime.now().toISO();
    if (!str) throw new Error('impossible');
    return str;
};

export const compareDateTime =
    <T>(getDateTime: (_: T) => DateTime, desc = true) =>
    (a: T, b: T): number => {
        const _a = getDateTime(a);
        const _b = getDateTime(b);

        if (_a.equals(_b)) return 0;

        return (_a < _b ? 1 : -1) * (desc ? 1 : -1);
    };
