import {ListedFile}                        from '@state/models/ListedFile';
import {UploadLike, UploadLikeSimpleState} from '@state/models/types';
import {socket}                            from '@state/stores/Socket';
import {on}                                from '@utils/events';
import {uid}                               from '@utils/uid';
import {action, computed, observable}      from 'mobx';

export type UploadStreamState = 'active';

export class UploadStream implements UploadLike<UploadStreamState> {
    @observable public streaming = false;
    @observable public progress = 0;
    public readonly state: UploadStreamState = 'active';
    public readonly streamKey: string;
    public readonly listedFile: ListedFile;
    public readonly id: string;

    // Internal chunks
    @observable private uploads: Map<string, XMLHttpRequest> = new Map();

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
        if (this.uploads.size) {
            return 'active';
        }

        return 'done';
    }

    constructor(streamKey: string, listedFile: ListedFile) {
        this.streamKey = streamKey;
        this.listedFile = listedFile;
        this.id = uid(); // TODO: Redundant?
    }

    @action
    public cancelStream(key: string): boolean {
        const req = this.uploads.get(key);

        if (!req) {
            return false;
        }

        const {readyState} = req;
        this.uploads.delete(key);

        if (readyState > XMLHttpRequest.UNSENT && readyState < XMLHttpRequest.DONE) {
            req.abort();
        }

        return true;
    }

    @action
    public cancel(): void {

        // Cancel all streams
        for (const [key, req] of this.uploads) {
            const {readyState} = req;
            this.uploads.delete(key);

            if (readyState > XMLHttpRequest.UNSENT && readyState < XMLHttpRequest.DONE) {
                req.abort();
            }
        }

        // Cancel stream-key server-side
        socket.sendMessage('cancel-stream', this.streamKey);
    }

    @action
    public consume(range: [number, number], url: string, id: string) {
        const {file} = this.listedFile;
        const xhr = new XMLHttpRequest();

        // Disable timeouts entirely
        // See https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/timeout
        xhr.timeout = 0;

        let lastLoad = 0;
        on(xhr.upload, [
            'progress',
            'error',
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
                case 'load': {
                    this.uploads.delete(id);
                }
            }
        });

        // Transfer bytes
        xhr.open('POST', url, true);
        xhr.send(file.slice(range[0], range[1], file.type));
        this.uploads.set(id, xhr);
    }

    update(status: string): boolean {
        return false;
    }
}
