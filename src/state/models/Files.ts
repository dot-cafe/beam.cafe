import {action, computed, observable} from 'mobx';
import {socket}                       from '../../socket';

export type ListedFileStatus = 'loading' | 'ready';
export type ListedFile = {
    file: File;
    status: ListedFileStatus;
    id: null | string;
    key: null | string;
};

export type Keys = Array<{
    id: string;
    name: string;
    key: string;
}>;

/* eslint-disable no-console */
export class Files {
    @observable private readonly internalFiles: Array<ListedFile> = [];

    @computed
    public get listedFiles() {
        return this.internalFiles;
    }

    @computed
    public get isEmpty() {
        return this.internalFiles.length === 0;
    }

    @action
    public add(...files: Array<File>) {

        // Read and save files
        const keysToRequest = [];
        for (const file of files) {

            // Skip duplicates
            if (this.internalFiles.find(ef => ef.file.name === file.name)) {
                continue;
            }

            this.internalFiles.push({
                status: 'loading',
                key: null,
                id: null,
                file
            });

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
        const fileIndex = this.internalFiles.findIndex(value => value.id === id);


        if (~fileIndex) {
            const file = this.internalFiles[fileIndex];
            this.internalFiles.splice(fileIndex, 1);

            socket.send(JSON.stringify({
                type: 'remove-file',
                payload: file.id
            }));
        } else {
            console.warn('File not registered yet.');
        }
    }

    @action
    public updateKeys(keys: Keys) {
        for (const {name, key, id} of keys) {
            const target = this.internalFiles.find(
                value => value.file.name === name
            );

            if (target) {
                target.status = 'ready';
                target.key = key;
                target.id = id;
            } else {
                console.warn(`[LF] File ${name} not longer available`);
            }
        }
    }
}
