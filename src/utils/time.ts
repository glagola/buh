import { DateTime } from 'luxon';

export const now = (): string => {
    const nowStr = DateTime.now().toISO();
    if (!nowStr) throw new Error('impossible');
    return nowStr;
};
