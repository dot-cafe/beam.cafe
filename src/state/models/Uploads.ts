import {action, computed, observable} from 'mobx';
import {XHUpload}                     from '../../utils/XHUpload';
import {ListedFile}                   from './ListedFiles';

export type Upload = {
    xhUpload: XHUpload;
    listedFile: ListedFile;
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
            this.triggerUpdateAt(this.uploads.length - 1);
        });

        this.uploads.push({
            xhUpload,
            listedFile
        });
    }

    @action
    private triggerUpdateAt(index: number): void {
        const upload = this.uploads[index];

        if (upload) {

            // Trigger update
            this.uploads[index] = {...upload};
        } else {
            throw new Error('Failed to update upload status.');
        }
    }
}
