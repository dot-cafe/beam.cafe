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
