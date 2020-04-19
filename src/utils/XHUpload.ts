import {on} from './events';

export type XHUploadState = 'idle' |
    'paused' |
    'running' |
    'cancelled' |
    'errored' |
    'timeout' |
    'finished';

export class XHUploadEvent extends Event {
    public readonly state: XHUploadState;

    constructor(state: XHUploadState) {
        super('update');
        this.state = state;
    }
}

export class XHUpload extends EventTarget {

    public readonly size: number;
    public state: XHUploadState = 'idle';

    // Amount of bytes transferred
    public transferred = 0;

    // File and url
    private readonly file: File;
    private readonly url: string;

    // Current request instance, byte-offset and if paused
    private xhr: XMLHttpRequest;

    constructor(url: string, file: File) {
        super();
        this.file = file;
        this.url = url;
        this.size = file.size;
        this.xhr = this.start();
    }

    public abort(silent = false): void {
        const {readyState} = this.xhr;

        if (readyState !== 0 && readyState !== 4) {
            this.xhr.abort();
        }

        this.state = 'cancelled';

        if (!silent) {
            this.emitEvent();
        }
    }

    public pause(): void {
        if (this.state !== 'running') {
            throw new Error('Cannot pause upload if not started.');
        }

        this.xhr.abort();
    }

    public resume(): void {
        if (this.state !== 'paused') {
            throw new Error('Upload not paused.');
        }

        this.start();
    }

    private emitEvent(): void {
        this.dispatchEvent(new XHUploadEvent(
            this.state
        ));
    }

    private start(): XMLHttpRequest {
        const {file, url} = this;
        const xhr = this.xhr = new XMLHttpRequest();

        // Track upload progress
        let lastLoad = 0;
        on(xhr.upload, [
            'loadstart',
            'progress',
            'abort',
            'error',
            'load',
            'timeout'
        ], (e: ProgressEvent) => {
            const prevState = this.state;

            switch (e.type) {
                case 'progress': {
                    this.transferred += (e.loaded - lastLoad);
                    lastLoad = e.loaded;
                    break;
                }
                case 'timeout': {
                    this.state = 'timeout';
                    break;
                }
                case 'error': {
                    this.state = 'errored';
                    break;
                }
                case 'abort': {
                    this.state = 'paused';
                    break;
                }
                case 'loadstart': {
                    this.state = 'running';
                    break;
                }
                case 'load': {
                    this.state = 'finished';
                    break;
                }
            }

            if (this.state !== prevState) {
                this.emitEvent();
            }
        });

        // Transfer bytes
        xhr.open('POST', url, true);
        xhr.send(file.slice(this.transferred, file.size, file.type));
        return xhr;
    }
}
