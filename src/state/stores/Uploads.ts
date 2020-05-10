import {action, observable}     from 'mobx';
import {clearArray, removeItem} from '../../utils/array';
import {Upload, UploadState}    from '../models/Upload';

export type MassAction = 'remove' | 'pause' | 'resume' | 'cancel';

export enum SelectType {
    Unselect = 'Unselect',
    Select = 'Select',
    Toggle = 'Toggle'
}

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

    public getAvailableMassActions(uploads: Array<Upload>): Array<MassAction> {
        const canPause = uploads.some(v => v.state === 'running');
        const canResume = uploads.some(v => v.state === 'paused');
        const canRemove = !canPause && !canResume && uploads.every(v => v.simpleState === 'done');
        const canCancel = canPause || canResume;

        const actions: Array<MassAction> = [];
        canPause && actions.push('pause');
        canResume && actions.push('resume');
        canRemove && actions.push('remove');
        canCancel && actions.push('cancel');

        return actions;
    }

    @action
    public performMassAction(uploads: Array<Upload>, massAction: MassAction): void {
        switch (massAction) {
            case 'remove': {
                this.remove(...uploads.map(value => value.id));
                break;
            }
            case 'pause': {

                // TODO: What about confirmation?
                for (const upload of uploads) {
                    if (upload.state === 'running') {
                        upload.update('paused');
                    }
                }

                break;
            }
            case 'resume': {
                for (const upload of uploads) {
                    if (upload.state === 'paused') {
                        upload.update('running');
                    }
                }

                break;
            }
            case 'cancel': {
                for (const upload of uploads) {
                    upload.update('cancelled');
                }

                break;
            }
        }
    }

    @action
    public performMassStatusUpdate(uploads: Array<Upload>, newState: UploadState): void {
        for (const upload of uploads) {
            upload.update(newState);
        }
    }

    @action
    public registerUpload(upload: Upload): void {
        this.listedUploads.push(upload);
    }

    @action
    public updateUploadState(upload: string | Upload, newState: UploadState): void {
        if (typeof upload === 'string') {
            const index = this.listedUploads.findIndex(v => {
                return v.id === upload;
            });

            if (index === -1) {
                throw new Error('Failed to update upload status.');
            }

            upload = this.listedUploads[index];
        }

        this.performMassStatusUpdate([upload], newState);
    }

    @action
    public remove(...ids: Array<string>): void {
        for (let i = 0; i < this.listedUploads.length; i++) {
            const upload = this.listedUploads[i];

            if (ids.includes(upload.id)) {
                if (upload.simpleState !== 'done') {
                    throw new Error('Cannot remove upload as it\'s not finished.');
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

    @action
    public massAction(action: MassAction) {
        this.performMassAction(this.listedUploads, action);
    }

    @action
    public massStatusUpdate(newState: UploadState) {
        this.performMassStatusUpdate(this.listedUploads, newState);
    }

    @action
    public clear() {
        this.massAction('cancel');
        clearArray(this.listedUploads);
    }
}

export const uploads = new Uploads();
