import { TEntity } from '@/entites';

export const buildItemByIdMap = <T extends TEntity>(arr: T[]): Map<T['id'], T> =>
    arr.reduce((res, item) => res.set(item.id, item), new Map());
