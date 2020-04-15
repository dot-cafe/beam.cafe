export const removeItem = <T>(arr: Array<T>, item: T): boolean => {
    const index = arr.indexOf(item);

    if (~index) {
        arr.splice(index, 1);
        return true;
    }

    return false;
};

export const rotate = <T>(arr: Array<T>, item: T): T => {
    const index = arr.indexOf(item);

    if (index === -1 || index === arr.length - 1) {
        return arr[0];
    }

    return arr[index + 1];
};
