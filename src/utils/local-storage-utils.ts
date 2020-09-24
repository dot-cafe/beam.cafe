export const localStorageUtils = {
    getJSON<T>(key: string): null | T {
        const data = localStorage.getItem(key);

        if (data === null) {
            return null;
        }

        try {
            return JSON.parse(data) as T;
        } catch (e) {
            return null;
        }
    },

    setJSON(key: string, value: unknown): void {
        localStorage.setItem(key, JSON.stringify(value));
    }
};
