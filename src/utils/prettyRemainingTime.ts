/**
 * Creates a readable string out of a number representing remaining milliseconds.
 * I could use RelativeTimeFormat but Safari (again) does not support it.
 * @param v
 */
export const prettyRemainingTime = (v: number): string => {
    const times = [
        ['seconds', 1000, 1, 59],
        ['minute', 1000 * 60, 1, 59],
        ['hour', 1000 * 60 * 60, 1, 23],
        ['day', 1000 * 60 * 60 * 24, 1, -1]
    ] as Array<[string, number, number, number]>;

    for (const [str, div, min, max] of times) {
        const rest = Math.round(v / div);

        if (rest >= min && (rest <= max || max === -1)) {
            const num = Math.ceil(rest);
            return `${num} ${str + (num > 1 ? 's' : '')}`;
        }
    }

    return 'a few seconds';
};
