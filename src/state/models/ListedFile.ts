import {action, observable} from 'mobx';

export type ListedFileStatus = 'loading' | 'ready' | 'removing';

export class ListedFile {
    @observable private _status: ListedFileStatus = 'loading';
    @observable public updated: number = performance.now();
    @observable public id: null | string = null;
    public readonly index: number;
    public readonly file: File;
    private static counter = 0;

    constructor(file: File) {
        this.file = file;
        this.index = ListedFile.counter++;
    }

    get status() {
        return this._status;
    }

    set status(status) {
        this.updated = performance.now();
        this._status = status;
    }

    @action
    public activate(id: string): void {
        this.status = 'ready';
        this.id = id;
    }
}
