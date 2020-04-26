import {action, observable} from 'mobx';
import {socket}             from '../';

export type ListedFileStatus = 'loading' | 'ready' | 'removing';

export class ListedFile {
    @observable public status: ListedFileStatus = 'loading';
    @observable public updated: number = performance.now();
    @observable public id: null | string = null;
    public readonly index: number;
    public readonly file: File;
    private static counter = 0;

    constructor(file: File) {
        this.file = file;
        this.index = ListedFile.counter++;
    }

    @action
    public remove(): void {
        this.updated = performance.now();
        this.status = 'removing';

        // Cancel download-request
        socket.sendMessage('remove-file', this.id);
    }

    @action
    public setId(id: string): void {
        this.updated = performance.now();
        this.status = 'ready';
        this.id = id;
    }
}
