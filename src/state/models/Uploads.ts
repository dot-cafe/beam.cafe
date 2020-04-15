import {action, computed, observable}           from 'mobx';
import {XHUpload, XHUploadEvent, XHUploadState} from '../../utils/XHUpload';
import {ListedFile}                             from './Files';

export type UploadState = XHUploadState | 'peer-cancelled';

export type Upload = {
    downloadId: string;
    state: UploadState;
    progress: number;
    listedFile: ListedFile;
    _xhUpload: XHUpload;
};

/* eslint-disable no-console */
export class Uploads {
    @observable private readonly internalUploads: Array<Upload> = [];

    @computed
    public get listedUploads() {
        return this.internalUploads;
    }

    @action
    public registerUpload(downloadId: string, listedFile: ListedFile, xhUpload: XHUpload): void {
        xhUpload.addEventListener('update', s => {
            this.updateUploadState(downloadId, (s as XHUploadEvent).state);
        });

        this.internalUploads.push({
            _xhUpload: xhUpload,
            state: xhUpload.state,
            progress: 0,
            downloadId,
            listedFile
        });
    }

    @action
    public updateUploadState(id: string, newState: UploadState): void {
        const index = this.internalUploads.findIndex(v => {
            return v.downloadId === id;
        });

        if (index === -1) {
            throw new Error('Failed to update upload status.');
        }

        // TODO: Clean up event-mess
        const upload = this.internalUploads[index];
        switch (newState) {
            case 'peer-cancelled': {
                upload._xhUpload.abort();
                upload.state = 'peer-cancelled';
                upload.progress = 1;
                return;
            }
            default: {
                const {size, transferred} = upload._xhUpload;
                upload.progress = transferred / size;
            }
        }

        upload.state = newState;
    }
}
