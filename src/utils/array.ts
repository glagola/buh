type NonEmptyArray<T> = [T, ...T[]];
export function isNonEmpty<A>(arr: A[]): arr is NonEmptyArray<A> {
    return arr.length > 0;
}
