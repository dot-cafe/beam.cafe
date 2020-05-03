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
    public static readonly SPEED_BUFFER_SIZE = 10;

    public readonly size: number;
    public state: XHUploadState = 'idle';
    public transferred = 0;

    // Amount of bytes transferred and current upload speed
    private speedBufferIndex = 0;
    private speedBufferFull = false;
    private speedBuffer = new Uint32Array(XHUpload.SPEED_BUFFER_SIZE);

    // File and url
    private readonly file: File;
    private readonly url: string;

    // Current request instance, byte-offset and if paused
    private xhr: XMLHttpRequest | null;

    constructor(url: string, file: File) {
        super();
        this.file = file;
        this.url = url;
        this.size = file.size;
        this.xhr = null;
    }

    get currentSpeed(): number {
        const available = this.speedBufferFull ?
            this.speedBuffer.length :
            this.speedBufferIndex;

        if (available === 0) {
            return 0;
        }

        let sum = 0;
        for (let i = 0; i < available; i++) {
            sum += this.speedBuffer[i];
        }

        return sum / available;
    }

    public abort(silent = false): void {

        if (this.xhr) {
            const {readyState} = this.xhr;

            if (readyState !== 0 && readyState !== 4) {
                this.xhr.abort();
                this.state = 'cancelled';

                if (!silent) {
                    this.emitEvent();
                }

                return;
            }
        }

        if (this.state === 'paused') {
            this.state = 'cancelled';

            if (!silent) {
                this.emitEvent();
            }
        }
    }

    public toggleState(): void {
        switch (this.state) {
            case 'idle': {
                this.start();
                break;
            }
            case 'running': {
                this.pause();
                break;
            }
            case 'paused': {
                this.resume();
                break;
            }
            default: {
                throw new Error('Upload must be active or paused.');
            }
        }
    }

    public start(): void {
        if (this.state !== 'idle') {
            throw new Error('Upload is already in a progressed state.');
        }

        this._start();
    }

    public pause(): void {
        if (this.state !== 'running') {
            throw new Error('Cannot pause upload if not started.');
        }

        this.xhr?.abort();
    }

    public resume(): void {
        if (this.state !== 'paused') {
            throw new Error('Upload not paused.');
        }

        this._start();
    }

    private emitEvent(): void {
        this.dispatchEvent(new XHUploadEvent(
            this.state
        ));
    }

    private _start(): XMLHttpRequest {
        const {file, url} = this;
        const xhr = this.xhr = new XMLHttpRequest();

        // Speed buffer
        this.speedBufferFull = false;
        this.speedBufferIndex = 0;
        let lastMeasure = 0;

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
            switch (e.type) {
                case 'progress': {
                    const loaded = (e.loaded - lastLoad);
                    lastLoad = e.loaded;

                    this.transferred += loaded;

                    const now = performance.now();
                    this.speedBuffer[this.speedBufferIndex] = (loaded / (now - lastMeasure)) * 1000;
                    lastMeasure = now;

                    this.speedBufferIndex++;
                    if (this.speedBufferIndex > this.speedBuffer.length) {
                        this.speedBufferFull = true;
                        this.speedBufferIndex = 0;
                    }

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

            this.emitEvent();
        });

        // Transfer bytes
        xhr.open('POST', url, true);
        xhr.send(file.slice(this.transferred, file.size, file.type));
        return xhr;
    }
}
