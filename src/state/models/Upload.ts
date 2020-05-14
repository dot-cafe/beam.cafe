import {action, computed, observable}       from 'mobx';
import {settings, showNotification, socket} from '..';
import {on}                                 from '../../utils/events';
import {ListedFile}                         from './ListedFile';

export type SimpleUploadState = 'pending' | 'active' | 'done';
export type UploadState = 'idle' |
    'paused' |
    'running' |
    'cancelled' |
    'errored' |
    'finished' |
    'awaiting-approval' |
    'peer-cancelled' |
    'removed' |
    'connection-lost';

export class Upload {
    public static readonly SPEED_BUFFER_SIZE = 10;

    public readonly listedFile: ListedFile;
    public readonly id: string;
    public transferred = 0;

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

    constructor(listedFile: ListedFile, id: string, url: string) {
        this.listedFile = listedFile;
        this.id = id;
        this.url = url;
        this.xhr = null;

        const status = settings.get('autoPause') ? 'awaiting-approval' : 'running';
        this.update(status);

        switch (status) {
            case 'awaiting-approval': {
                settings.get('notifyOnRequest') && showNotification({
                    interaction: true,
                    title: 'Someone requested a file!',
                    body: `Click to approve the request of "${listedFile.file.name}"`
                }).then((data) => {
                    if (data === 'click') {
                        this.update('running');
                    } else if (data === 'close') {
                        this.update('cancelled');
                    }
                });

                break;
            }
            case 'running': {
                settings.get('notifyOnUpload') && showNotification({
                    title: 'You started uploading a file!',
                    body: `Upload of "${listedFile.file.name}" has started!`
                });
            }
        }
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
    get simpleState(): SimpleUploadState {
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
                if (state !== 'running') {
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
            case 'removed':
            case 'peer-cancelled':
            case 'connection-lost': {
                if (simpleState === 'done') {
                    return false;
                }

                this.secureAbort();
                this.progress = 1;
                break;
            }
            case 'cancelled': {
                if (simpleState === 'done') {
                    return false;
                }

                this.secureAbort();
                socket.sendMessage('cancel-request', this.id);
                this.progress = 1;
                break;
            }
            default: {
                throw new Error(`Invalid status update: ${status}`);
            }
        }

        this.state = status;
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
    private start(): XMLHttpRequest {
        const {listedFile: {file}, url} = this;
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
                    this.progress = this.transferred / file.size;

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
        xhr.send(file.slice(this.transferred, file.size, file.type));
        return xhr;
    }
}
