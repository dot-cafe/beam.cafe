import {UploadLike}          from '@state/models/types';
import {UploadStream}        from '@state/models/UploadStream';
import {Selectable}          from '@state/wrapper/Selectable';
import {clearArray}          from '@utils/array';
import {action, observable}  from 'mobx';
import {Upload, UploadState} from '../models/Upload';

export type MassAction = 'remove' | 'pause' | 'resume' | 'cancel';

class Uploads extends Selectable<UploadLike> {
    @observable public readonly listedUploads: Array<UploadLike> = [];

    public getAvailableMassActions(uploads: Array<UploadLike>): Map<MassAction, number> {
        const massActionsMap = new Map();
        const calcMassActions = (name: MassAction, predicate: (v: UploadLike) => boolean): void => {
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
    public performMassAction(uploads: Array<UploadLike>, massAction: MassAction): void {
        switch (massAction) {
            case 'remove': {

                this.remove(
                    ...uploads.filter(v => v instanceof Upload && v.simpleState === 'done')
                        .map(value => value.id)
                );

                break;
            }
            case 'pause': {

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
    public performMassStatusUpdate(uploads: Array<UploadLike>, newState: UploadState): void {
        for (const upload of uploads) {
            upload.update(newState);
        }
    }

    @action
    public registerUpload(upload: UploadLike): void {
        this.listedUploads.push(upload);
    }

    @action
    public updateUploadState(upload: string | UploadLike, newState: UploadState): void {
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

    @action
    public cancelStream(payload: string) {
        for (const upload of this.listedUploads) {
            if (upload instanceof UploadStream && upload.cancelStream(payload)) {
                return;
            }
        }
    }
}

export const uploads = new Uploads();
