declare module '*.wasm';
declare module '*.scss';
declare module '*.svg';

// Missing share-api
declare interface Navigator {
    share?: ({title, text, url}: {
        title: string;
        text: string;
        url: string;
    }) => Promise<void>;
}

// We have to check if we're inside of safari...
declare interface Window {
    safari: unknown;
}

// Environment, ts somehow requires VERSION to be in the global scope too
declare const VERSION: string;
declare const env: {
    NODE_ENV: 'development' | 'production';
    BUILD_DATE: number;
    VERSION: string;
    API_HTTP: string;
    API_WEBSOCKET: string;
};
