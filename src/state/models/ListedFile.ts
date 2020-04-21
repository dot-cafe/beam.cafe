import {action, observable} from 'mobx';
import {socket}             from '../../socket';

export type ListedFileStatus = 'loading' | 'ready' | 'removing';

export class ListedFile {
    @observable public status: ListedFileStatus = 'loading';
    @observable public updated: number = performance.now();
    @observable public id: null | string = null;
    @observable public file: File;

    constructor(file: File) {
        this.file = file;
    }

    @action
    public remove(): void {
        this.updated = performance.now();
        this.status = 'removing';

        // Cancel download-request
        socket.send(JSON.stringify({
            type: 'remove-file',
            payload: this.id
        }));
    }

    @action
    public activate(id: string): void {
        if (this.id !== null) {
            throw new Error('File already active.');
        }

        this.updated = performance.now();
        this.status = 'ready';
        this.id = id;
    }
}
