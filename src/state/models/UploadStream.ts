import {ListedFile}                        from '@state/models/ListedFile';
import {UploadLike, UploadLikeSimpleState} from '@state/models/types';
import {settings}                          from '@state/stores/Settings';
import {socket}                            from '@state/stores/Socket';
import {on}                                from '@utils/events';
import {uid}                               from '@utils/uid';
import {action, computed, observable}      from 'mobx';

type PendingStream = {
    url: string;
    range: [number, number];
};

export type UploadStreamState = 'idle' |
    'awaiting-approval' |
    'running' |
    'paused' |
    'cancelled' |
    'removed' |
    'peer-cancelled' |
    'connection-lost';

export class UploadStream implements UploadLike<UploadStreamState> {
    @observable public streaming = false;
    @observable public progress = 0;
    public readonly streamKey: string;
    public readonly listedFile: ListedFile;
    public readonly id: string;

    // Current stream state
    @observable public state: UploadStreamState = 'idle';

    // Internal chunks
    @observable private uploads: Map<string, XMLHttpRequest> = new Map();

    // Pending uploads in case it's paused or is awaiting user-approval
    private pendingUploads: Map<string, PendingStream> = new Map();

    constructor(streamKey: string, listedFile: ListedFile) {
        this.streamKey = streamKey;
        this.listedFile = listedFile;
        this.id = uid();
        this.update(settings.autoPause ? 'awaiting-approval' : 'running');
    }

    @computed
    get activeUploads(): number {
        return this.uploads.size;
    }

    @computed
    get currentSpeed(): number {
        return 0;
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

            case 'removed':
            case 'cancelled':
            case 'peer-cancelled':
            case 'connection-lost':
                return 'done';
        }
    }

    @action
    public cancelStream(key: string): boolean {
        const req = this.uploads.get(key);

        if (!req) {
            return false;
        } else if (this.pendingUploads.get(key)) {
            return true;
        }

        const {readyState} = req;

        if (readyState > XMLHttpRequest.UNSENT && readyState < XMLHttpRequest.DONE) {
            req.abort();
        }

        return true;
    }

    @action
    public consume(range: [number, number], url: string, id: string) {
        if (this.state !== 'running') {
            this.pendingUploads.set(id, {range, url});
            return;
        }

        const {blob} = this.listedFile;
        const xhr = new XMLHttpRequest();

        // Disable timeouts entirely
        // See https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/timeout
        xhr.timeout = 0;

        on(xhr, 'readystatechange', () => {

            /**
             * While requesting the stream the transfer got cancelled.
             */
            if (xhr.readyState === xhr.HEADERS_RECEIVED && xhr.status === 204) {
                xhr.abort();
            }
        });

        let lastLoad = 0;
        on(xhr.upload, [
            'progress',
            'error',
            'abort',
            'load'
        ], (e: ProgressEvent) => {
            switch (e.type) {

                // Track upload progress
                case 'progress': {
                    this.progress += (e.loaded - lastLoad);
                    lastLoad = e.loaded;
                    break;
                }

                // Remove on finish
                case 'error':
                case 'abort':
                case 'load': {
                    this.uploads.delete(id);
                }
            }
        });

        // Transfer bytes
        xhr.open('POST', url, true);
        xhr.send(blob.slice(range[0], range[1] + 1, blob.type));
        this.uploads.set(id, xhr);
    }

    update(status: UploadStreamState): boolean {
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

                break;
            }
            case 'running': {
                if (state === 'running' || state === 'cancelled') {
                    return false;
                }

                break;
            }
            case 'cancelled': {
                if (simpleState === 'done') {
                    return false;
                }

                // Cancel all streams
                for (const [, req] of this.uploads) {
                    const {readyState} = req;

                    if (readyState > XMLHttpRequest.UNSENT && readyState < XMLHttpRequest.DONE) {
                        req.abort();
                    }
                }

                // Cancel stream-key server-side
                socket.sendMessage('cancel-streams', [this.streamKey]);
            }
        }

        this.state = status;

        // Start pending streams
        if (status === 'running' && this.pendingUploads.size) {
            for (const [key, {range, url}] of this.pendingUploads) {
                this.consume(range, url, key);
            }

            this.pendingUploads.clear();
        }

        return true;
    }
}
