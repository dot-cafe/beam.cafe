/**
 * Compares two strings and returns a number between 1 (equal) and near-zero.
 * @param a First string
 * @param b Second string
 */
export const fuzzyStringSimilarity = (
    a: string,
    b: string
): number => {
    const [min, max] = a.length < b.length ? [a, b] : [b, a];
    const minLength = min.length;
    const maxLength = max.length;
    const diff = (maxLength - minLength) + 1;

    let bestMatch = 0;
    for (let i = 0; i < diff; i++) {
        let matches = 0;

        for (let j = 0; j < minLength; j++) {
            if (min[j] === max[i + j]) {
                matches++;
            }
        }

        if (matches > bestMatch) {
            bestMatch = matches;
        }
    }

    const lengthSimilarity = (minLength / maxLength);
    const characterSimilarity = (bestMatch / minLength);
    return characterSimilarity * Math.sqrt(lengthSimilarity);
};
