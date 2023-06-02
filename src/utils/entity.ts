import { type TEntity } from '@/entites';

export const buildItemByIdMap = <T extends TEntity>(arr: T[]) =>
    arr.reduce((res, item) => res.set(item.id, item), new Map<T['id'], T>());
