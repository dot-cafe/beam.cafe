import {Selectable}          from '@state/wrapper/Selectable';
import {action, observable}  from 'mobx';
import {clearArray}          from '@utils/array';
import {Upload, UploadState} from '../models/Upload';

export type MassAction = 'remove' | 'pause' | 'resume' | 'cancel';

class Uploads extends Selectable<Upload> {
    @observable public readonly listedUploads: Array<Upload> = [];

    public getAvailableMassActions(uploads: Array<Upload>): Array<MassAction> {
        const canCancel = uploads.some(v => v.simpleState !== 'done');
        const canPause = uploads.some(v => v.state === 'running');
        const canResume = uploads.some(v => v.state === 'paused');
        const canRemove = !canPause && !canResume && uploads.every(v => v.simpleState === 'done');

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
