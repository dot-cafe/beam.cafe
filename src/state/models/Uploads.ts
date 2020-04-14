import {action, computed, observable} from 'mobx';
import {XHUpload}                     from '../../utils/XHUpload';
import {ListedFile}                   from './Files';

export type Upload = {
    xhUpload: XHUpload;
    listedFile: ListedFile;
};

/* eslint-disable no-console */
export class Uploads {
    @observable private readonly internalUploads: Array<Upload> = [];

    @computed
    public get listedUploads() {
        return this.internalUploads;
    }

    @action
    public registerUpload(xhUpload: XHUpload, listedFile: ListedFile): void {
        xhUpload.addEventListener('update', () => {
            this.triggerUpdateAt(this.internalUploads.length - 1);
        });

        this.internalUploads.push({
            xhUpload,
            listedFile
        });
    }

    @action
    private triggerUpdateAt(index: number): void {
        const upload = this.internalUploads[index];

        if (upload) {

            // Trigger update
            this.internalUploads[index] = {...upload};
        } else {
            throw new Error('Failed to update upload status.');
        }
    }
}
