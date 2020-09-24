export const clone = <T>(data: T): T => JSON.parse(JSON.stringify(data)) as T;
