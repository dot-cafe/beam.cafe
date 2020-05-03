export const pick = <T extends object, P extends Partial<Array<keyof T>>>(source: T, props: P): Partial<T> => {
    const target: Partial<T> = {};

    for (const key in source) {
        if (props.includes(key)) {
            target[key] = source[key];
        }
    }

    return target as Extract<T, P>;
};
