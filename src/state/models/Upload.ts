import {UploadLike, UploadLikeSimpleState} from '@state/models/types';
import {on}                                from '@utils/events';
import {action, computed, observable}      from 'mobx';
import {settings, socket}                  from '..';
import {ListedFile}                        from './ListedFile';
import {UploadExtensions}                  from './UploadExtensions';

export type UploadState = 'idle' |
    'awaiting-approval' |
    'paused' |
    'running' |
    'cancelled' |
    'errored' |
    'finished' |
    'peer-cancelled' |
    'removed' |
    'connection-lost';

export type UploadConstructorObject = {
    listedFile: ListedFile;
    id: string;
    url: string;
    range?: [number, number];
};

export class Upload implements UploadLike<UploadState> {
    public static readonly SPEED_BUFFER_SIZE = 10;

    public readonly listedFile: ListedFile;
    public readonly id: string;

    @observable public state: UploadState = 'idle';
    @observable public progress = 0;

    // Amount of bytes transferred and current upload speed
    @observable private speedBufferIndex = 0;
    @observable private speedBufferFull = false;
    @observable private speedBuffer = new Uint32Array(Upload.SPEED_BUFFER_SIZE);

    // Download url
    private readonly url: string;

    // Current request instance, byte-offset and if paused
    private xhr: XMLHttpRequest | null;
    private transferred = 0;

    constructor({listedFile, id, url}: UploadConstructorObject) {
        this.listedFile = listedFile;
        this.id = id;
        this.url = url;
        this.xhr = null;

        this.update(settings.autoPause ? 'awaiting-approval' : 'running');
    }

    @computed
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

    @computed
    get simpleState(): UploadLikeSimpleState {
        switch (this.state) {
            case 'awaiting-approval':
            case 'paused':
            case 'idle':
                return 'pending';

            case 'running':
                return 'active';

            case 'connection-lost':
            case 'peer-cancelled':
            case 'finished':
            case 'cancelled':
            case 'removed':
            case 'errored':
                return 'done';
        }
    }

    @action
    public update(status: UploadState): boolean {
        const {state, simpleState} = this;

        switch (status) {
            case 'awaiting-approval':
            case 'idle': {
                if (state !== 'idle') {
                    return false;
                }

                break;
            }
            case 'paused': {
                if (simpleState !== 'active') {
                    return false;
                }

                this.xhr?.abort();
                break;
            }
            case 'running': {
                if (simpleState !== 'pending') {
                    return false;
                }

                this.start();
                break;
            }
            case 'peer-cancelled':
            case 'connection-lost': {
                if (simpleState === 'done') {
                    return false;
                }

                this.secureAbort();
                this.progress = 1;
                break;
            }
            case 'removed':
            case 'cancelled': {
                if (simpleState === 'done') {
                    return false;
                }

                // TODO: This is pretty inefficient in case of mass-actions
                socket.sendMessage('cancel-requests', [this.id]);
                this.secureAbort();
                this.progress = 1;
                break;
            }
            default: {
                throw new Error(`Invalid status update: ${status}`);
            }
        }

        // Update status
        this.state = status;

        // Fire notification if set
        if (settings.notifications.turnedOn === true &&
            settings.notifications.onUploadStateChange.includes(status)) {
            void UploadExtensions.notifyFor(this);
        }

        return true;
    }

    private secureAbort(): void {
        if (!this.xhr) {
            return;
        }

        const {readyState} = this.xhr;
        if (readyState > XMLHttpRequest.UNSENT && readyState < XMLHttpRequest.DONE) {
            this.xhr.abort();
        }
    }

    @action
    protected start(): void {
        const {listedFile: {blob, size}, url} = this;
        const xhr = this.xhr = new XMLHttpRequest();

        // Disable timeouts entirely
        // See https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/timeout
        xhr.timeout = 0;

        // Speed buffer
        this.speedBufferFull = false;
        this.speedBufferIndex = 0;
        let lastMeasure = 0;

        // Track upload progress
        let lastLoad = 0;
        on(xhr.upload, [
            'progress',
            'error',
            'load'
        ], (e: ProgressEvent) => {
            switch (e.type) {
                case 'progress': {
                    const loaded = (e.loaded - lastLoad);
                    lastLoad = e.loaded;

                    this.transferred += loaded;
                    this.progress = this.transferred / size;

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
                case 'error': {
                    this.state = 'errored';
                    break;
                }
                case 'load': {
                    this.state = 'finished';
                    break;
                }
            }
        });

        // Transfer bytes
        xhr.open('POST', url, true);
        xhr.send(blob.slice(this.transferred, size, blob.type));
    }
}
