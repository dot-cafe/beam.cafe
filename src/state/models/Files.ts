import {action, computed, observable} from 'mobx';
import {socket}                       from '../../socket';

export type ListedFileStatus = 'loading' | 'ready';
export type ListedFile = {
    file: File;
    status: ListedFileStatus;
    key: null | string;
};

export type Keys = Array<{
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
    public removeFile(file: number) {
        if (file > 0 && file < this.internalFiles.length) {
            this.internalFiles.splice(file, 1);
        } else {
            throw new Error(`Invalid offset: ${file}`);
        }
    }

    @action
    public updateKeys(keys: Keys) {
        for (const {name, key} of keys) {
            const target = this.internalFiles.find(
                value => value.file.name === name
            );

            if (target) {
                target.status = 'ready';
                target.key = key;
            } else {
                console.warn(`[LF] File ${name} not longer available`);
            }
        }
    }
}
