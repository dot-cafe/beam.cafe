import {ListedFile}                        from '@state/models/ListedFile';
import {UploadLike, UploadLikeSimpleState} from '@state/models/types';
import {uid}                               from '@utils/uid';
import {action, computed, observable}      from 'mobx';

export type UploadStreamState = 'active';

export class UploadStream implements UploadLike<UploadStreamState> {
    @observable public streaming = false;
    @observable public progress = 0;
    @observable public uploaded = 0;
    public readonly state: UploadStreamState = 'active';
    public readonly streamKey: string;
    public readonly listedFile: ListedFile;
    public readonly id: string;

    // Internal chunks
    @observable private uploads: Array<XMLHttpRequest> = [];

    @computed
    get activeUploads(): number {
        return this.uploads.length;
    }

    @computed
    get currentSpeed(): number {
        return 0;
    }

    @computed
    get simpleState(): UploadLikeSimpleState {
        if (this.uploads.length) {
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
    public consume(range: [number, number], url: string) {
        const {file} = this.listedFile;
        const xhr = new XMLHttpRequest();

        // Disable timeouts entirely
        // See https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/timeout
        xhr.timeout = 0;

        // Track upload progress
        const lastLoad = 0;
        xhr.onprogress = e => {
            this.uploaded += (e.loaded - lastLoad);
        };

        // Remove on finish
        xhr.onload = () => {
            this.uploads.splice(this.uploads.indexOf(xhr), 1);
        };

        // Transfer bytes
        xhr.open('POST', url, true);
        xhr.send(file.slice(range[0], range[1], file.type));
        this.uploads.push(xhr);
    }

    update(status: string): boolean {
        return false;
    }
}
