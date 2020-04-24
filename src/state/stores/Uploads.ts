import {action, observable}                     from 'mobx';
import {removeItem}                             from '../../utils/array';
import {XHUpload, XHUploadEvent, XHUploadState} from '../../utils/XHUpload';
import {ListedFile}                             from '../models/ListedFile';
import {socket}                                 from '../';

export const FINAL_STATES: Array<UploadState> = [
    'peer-cancelled',
    'cancelled',
    'removed',
    'errored',
    'timeout',
    'finished'
];

export type MassAction = 'remove' | 'pause' | 'resume' | 'cancel';
export type UploadState = XHUploadState | 'peer-cancelled' | 'removed';
export type Upload = {
    id: string;
    listedFile: ListedFile;
    state: UploadState;
    progress: number;
    xhUpload: XHUpload;
};

export enum SelectType {
    Select = 'Select',
    Unselect = 'Unselect',
    Toggle = 'Toggle'
}

/* eslint-disable no-console */
class Uploads {
    @observable public readonly listedUploads: Array<Upload> = [];
    @observable public readonly selectedUploads: Array<Upload> = [];

    public isSelected(upload: string | Upload) {
        if (typeof upload === 'string') {
            const resolved = this.listedUploads.find(value => value.id === upload);

            if (!resolved) {
                throw new Error('Cannot check non-existent upload.');
            }

            upload = resolved;
        }

        return this.selectedUploads.includes(upload);
    }

    public getAvailableMassActionsFor(uploads: Array<Upload>): Array<MassAction> {
        const canPause = uploads.some(v => v.state === 'running');
        const canResume = uploads.some(v => v.state === 'paused');
        const canRemove = !canPause && !canResume && uploads.every(v => FINAL_STATES.includes(v.state));
        const canCancel = canPause || canResume;

        const actions: Array<MassAction> = [];
        canPause && actions.push('pause');
        canResume && actions.push('resume');
        canRemove && actions.push('remove');
        canCancel && actions.push('cancel');

        return actions;
    }

    @action
    public performMassActionFor(uploads: Array<Upload>, massAction: MassAction): void {
        switch (massAction) {
            case 'remove': {
                this.remove(...uploads.map(value => value.id));
                break;
            }
            case 'pause': {
                for (const {xhUpload} of uploads) {
                    if (xhUpload.state === 'running') {
                        xhUpload.pause();
                    }
                }

                break;
            }
            case 'resume': {
                for (const {xhUpload} of uploads) {
                    if (xhUpload.state === 'paused') {
                        xhUpload.resume();
                    }
                }

                break;
            }
            case 'cancel': {
                for (const {xhUpload} of uploads) {
                    xhUpload.abort();
                }

                break;
            }
        }
    }

    @action
    public registerUpload(id: string, file: ListedFile, xhUpload: XHUpload): void {
        xhUpload.addEventListener('update', s => {
            this.updateUploadState(id, (s as XHUploadEvent).state);
        });

        this.listedUploads.push({
            xhUpload,
            state: xhUpload.state,
            progress: 0,
            listedFile: file,
            id
        });
    }

    @action
    public updateUploadState(id: string, newState: UploadState): void {
        const index = this.listedUploads.findIndex(v => {
            return v.id === id;
        });

        if (index === -1) {
            throw new Error('Failed to update upload status.');
        }

        const upload = this.listedUploads[index];
        switch (newState) {
            case 'removed':
            case 'peer-cancelled': {
                upload.xhUpload.abort(true);
                upload.progress = 1;
                break;
            }
            case 'cancelled': {
                socket.sendMessage('cancel-request', upload.id);
                upload.progress = 1;
                break;
            }
            default: {
                const {size, transferred} = upload.xhUpload;
                upload.progress = transferred / size;
            }
        }

        upload.state = newState;
    }

    @action
    public remove(...ids: Array<string>): void {
        for (let i = 0; i < this.listedUploads.length; i++) {
            const upload = this.listedUploads[i];

            if (ids.includes(upload.id)) {
                if (!FINAL_STATES.includes(upload.state)) {
                    throw new Error('Cannot remove file since it\'s not in a final state');
                }

                this.listedUploads.splice(i, 1);
                i--;
            }
        }
    }

    @action
    public select(id: string | Upload, mode = SelectType.Select): void {
        const upload = typeof id === 'string' ?
            this.listedUploads.find(value => value.id === id) : id;

        if (!upload) {
            throw new Error('Cannot select upload. Invalid ID or payload.');
        }

        switch (mode) {
            case SelectType.Select: {
                if (!this.selectedUploads.includes(upload)) {
                    this.selectedUploads.push(upload);
                }
                break;
            }
            case SelectType.Unselect: {
                removeItem(this.selectedUploads, upload);
                break;
            }
            case SelectType.Toggle: {
                if (!this.selectedUploads.includes(upload)) {
                    this.selectedUploads.push(upload);
                } else {
                    removeItem(this.selectedUploads, upload);
                }
            }
        }
    }
}

export const uploads = new Uploads();
