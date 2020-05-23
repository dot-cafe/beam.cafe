export const removeItem = <T>(arr: Array<T>, item: T): boolean => {
    const index = arr.indexOf(item);

    if (~index) {
        arr.splice(index, 1);
        return true;
    }

    return false;
};

export const clearArray = (arr: Array<unknown>): void => {
    arr.splice(0, arr.length);
};

export const nearestElementIndex = <T>(
    array: Array<T>,
    index: number,
    predicate: (v: T) => boolean
): number => {
    const arrayLength = array.length;
    let prev = -1, next = -1;

    // Backwards
    for (let i = index; i >= 0; i--) {
        if (predicate(array[i])) {
            prev = i;
            break;
        }
    }

    // Forwards
    for (let i = index; i < arrayLength; i++) {
        if (predicate(array[i])) {
            next = i;
            break;
        }
    }

    return (prev === -1 || (next !== -1 && ((next + 1) - index < index - prev))) ?
        next : prev;
};
