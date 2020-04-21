declare module '*.wasm';
declare module '*.scss';
declare module '*.svg';

// Environment, ts somehow requires VERSION to be in the global scope too
declare const VERSION: string;
declare const env: {
    NODE_ENV: 'development' | 'production';
    BUILD_DATE: number;
    VERSION: string;
    API_ENDPOINT: string;
    WS_ENDPOINT: string;
};
