import {action, computed, observable} from 'mobx';
import {socket}                       from '../../socket';
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
class Files {
    @observable public readonly listedFiles: Array<ListedFile> = [];

    @computed
    public get isEmpty() {
        return this.listedFiles.length === 0;
    }

    public byId(id: string): ListedFile | null {
        return this.listedFiles.find(value => value.id === id) || null;
    }

    @action
    public add(...files: Array<File>) {

        // Read and save files
        const keysToRequest = [];
        for (const file of files) {

            // Skip duplicates
            if (this.listedFiles.find(ef => ef.file.name === file.name)) {
                continue;
            }

            this.listedFiles.push(new ListedFile(file));
            keysToRequest.push({
                name: file.name,
                size: file.size
            });
        }

        // Request first set of download-keys
        socket.send(JSON.stringify({
            type: 'download-keys',
            payload: keysToRequest
        }));
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
                    upload.state === 'running') {
                    uploads.updateUploadState(upload.id, 'removed');
                }
            }

            setTimeout(() => {
                const index = this.listedFiles.findIndex(value => value.id === id);
                this.listedFiles.splice(index, 1);
            }, remainingWaitingTime(file.updated));
        } else {
            console.warn('File not registered yet.');
        }
    }

    @action
    public enableFiles(idPairs: Keys) {
        for (const {name, id} of idPairs) {
            const target = this.listedFiles.find(
                value => value.file.name === name
            );

            if (target) {
                setTimeout(
                    () => target.activate(id),
                    remainingWaitingTime(target.updated)
                );
            } else {
                console.warn(`[LF] File ${name} not longer available`);
            }
        }
    }
}

export const files = new Files();
