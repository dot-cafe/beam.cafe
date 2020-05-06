import leven from 'leven';

/**
 * Compares two strings with the leven module and returns a number
 * between 1 (equal) and near-zero.
 * @param a First string
 * @param b Second string
 * @param equalLength If both strings should have the same length.
 */
export const stringSimilarity = (
    a: string,
    b: string,
    equalLength = false
): number => {

    if (equalLength) {
        if (a.length > b.length) {
            a = a.slice(0, b.length);
        } else if (a.length < b.length) {
            b = b.slice(0, a.length);
        }
    }

    return 1 - leven(a, b) / Math.max(a.length, b.length);
};
