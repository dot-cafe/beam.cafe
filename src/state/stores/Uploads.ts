import {Selectable}          from '@state/wrapper/Selectable';
import {clearArray}          from '@utils/array';
import {action, observable}  from 'mobx';
import {Upload, UploadState} from '../models/Upload';

export type MassAction = 'remove' | 'pause' | 'resume' | 'cancel';

class Uploads extends Selectable<Upload> {
    @observable public readonly listedUploads: Array<Upload> = [];

    public getAvailableMassActions(uploads: Array<Upload>): Map<MassAction, number> {
        const massActionsMap = new Map();
        const calcMassActions = (name: MassAction, predicate: (v: Upload) => boolean): void => {
            const amount = uploads.filter(predicate).length;

            if (amount) {
                massActionsMap.set(name, amount);
            }
        };

        calcMassActions('pause', v => v.state === 'running');
        calcMassActions('resume', v => v.state === 'paused');
        calcMassActions('cancel', v => v.simpleState !== 'done');
        calcMassActions('remove', v => v.simpleState === 'done');
        return massActionsMap;
    }

    @action
    public performMassAction(uploads: Array<Upload>, massAction: MassAction): void {
        switch (massAction) {
            case 'remove': {

                this.remove(
                    ...uploads.filter(v => v.simpleState === 'done')
                        .map(value => value.id)
                );

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
