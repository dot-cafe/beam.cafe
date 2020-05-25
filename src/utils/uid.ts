export const uid = (prefix = 'id'): string => {
    let str = `${prefix}-${Date.now().toString(36)}`;

    while (str.length < 30) {
        const salt = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(36);
        str += salt.slice(str.length - 30);
    }

    return str;
};

export const uids = (amount: number, prefix?: string): Array<string> => {
    const ids = [];

    for (let i = 0; i < amount; i++) {
        ids.push(uid(prefix));
    }

    return ids;
};
