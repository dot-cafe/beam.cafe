import {action, computed, observable} from 'mobx';
import {XHUpload}                     from '../../utils/XHUpload';
import {ListedFile}                   from './ListedFiles';

export type Upload = {
    xhUpload: XHUpload;
    listedFile: ListedFile;
    progress: number;
};

/* eslint-disable no-console */
export class Uploads {
    @observable private readonly uploads: Array<Upload> = [];

    @computed
    public get items() {
        return this.uploads;
    }

    @action
    public registerUpload(xhUpload: XHUpload, listedFile: ListedFile): void {
        xhUpload.addEventListener('update', () => {
            this.updateUploadState(this.uploads.length - 1);
        });

        this.uploads.push({
            progress: 0,
            xhUpload,
            listedFile
        });
    }

    @action
    private updateUploadState(index: number): void {
        const upload = this.uploads[index];

        if (upload) {
            upload.progress = upload.xhUpload.transferred / upload.xhUpload.size;
        } else {
            throw new Error('Failed to update upload status.');
        }
    }
}
