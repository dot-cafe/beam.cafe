import {Toast}                        from '@overlays/Toast';
import {Selectable}                   from '@state/wrapper/Selectable';
import {chooseFiles}                  from '@utils/choose-files';
import {pick}                         from '@utils/pick';
import {action, computed, observable} from 'mobx';
import {socket}                       from '../';
import {uploads}                      from '../index';
import {ListedFile}                   from '../models/ListedFile';

export type Keys = Array<{
    id: string;
    name: string;
    key: string;
}>;

const remainingWaitingTime = (ts: number): number => {
    const diff = performance.now() - ts;
    const remaining = (Math.random() * 500 + 250) - diff;
    return Math.max(0, remaining);
};

/* eslint-disable no-console */
class Files extends Selectable<ListedFile> {
    @observable public listedFiles: Array<ListedFile> = [];

    @computed
    public get isEmpty() {
        return this.listedFiles.length === 0;
    }

    public byId(id: string): ListedFile | null {
        return this.listedFiles.find(value => value.id === id) || null;
    }

    public openDialog(): Promise<boolean> {
        return chooseFiles().then(list => this.add(...Array.from(list)))
            .then(() => true)
            .catch(() => false);
    }

    @action
    public add(...files: Array<File>) {

        // Read and save files
        let skipped = 0;
        const keysToRequest = [];
        for (const file of files) {

            // Skip duplicates
            if (this.listedFiles.find(ef => ef.file.name === file.name)) {
                skipped++;
                continue;
            }

            this.listedFiles.push(new ListedFile(file));
            keysToRequest.push({
                name: file.name,
                size: file.size
            });
        }

        // Request first set of download-keys
        socket.sendMessage('download-keys', keysToRequest);

        // Show toast if files were skipped
        if (skipped > 0) {
            Toast.instance.show({
                text: `Skipped ${skipped} file${skipped > 1 ? 's' : ''} which were already listed.`,
                type: 'warning'
            });
        }
    }

    @action
    public removeFile(id: string) {
        const file = this.byId(id);

        if (file) {
            file.remove();

            // Cancel uploads
            const relatedUploads = uploads.listedUploads.filter(u => u.listedFile === file);
            for (const upload of relatedUploads) {
                if (upload.state === 'paused' ||
                    upload.state === 'running' ||
                    upload.state === 'idle' ||
                    upload.state === 'awaiting-approval') {
                    uploads.updateUploadState(upload.id, 'removed');
                }
            }

            setTimeout(() => {
                const index = this.listedFiles.findIndex(value => value.id === id);
                this.unselect(file);
                this.listedFiles.splice(index, 1);
            }, remainingWaitingTime(file.updated));
        } else {
            console.warn('File not registered yet.');
        }
    }

    public refresh(files: Array<ListedFile> = this.listedFiles) {
        const partials = files
            .filter(v => v.status === 'ready')
            .map(v => {
                v.status = 'loading';
                return pick(v.file, ['name', 'size']);
            });

        socket.sendMessage('download-keys', partials);
    }

    @action
    public activate(idPairs: Keys) {
        for (const {name, id} of idPairs) {
            const target = this.listedFiles.find(
                value => value.file.name === name
            );

            if (target) {
                setTimeout(
                    () => target.setId(id),
                    remainingWaitingTime(target.updated)
                );
            } else {
                console.warn(`[LF] File ${name} not longer available`);
            }
        }
    }

    @action
    public resetFiles() {
        for (const file of this.listedFiles) {
            file.status = 'loading';
        }
    }
}

export const files = new Files();
