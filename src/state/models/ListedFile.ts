import {action, observable} from 'mobx';

export type ListedFileStatus = 'loading' | 'ready' | 'removing';

export class ListedFile {
    @observable private _status: ListedFileStatus = 'loading';
    @observable public updated: number = performance.now();
    @observable public id: string | null = null;
    @observable public serializedName: string | null = null;
    private static counter = 0; // TODO: Reset counter?
    private readonly _file: File;
    public readonly name: string;
    public readonly nameIndex: number; // In case of duplicates a file gets a (<index>) suffix
    public readonly index: number;

    constructor(file: File, name: string, nameIndex: number) {
        this._file = file;
        this.index = ListedFile.counter++;
        this.nameIndex = nameIndex;
        this.name = name;
    }

    get status() {
        return this._status;
    }

    set status(status) {
        this.updated = performance.now();
        this._status = status;
    }

    get originalName() {
        return this._file.name;
    }

    get size() {
        return this._file.size;
    }

    get type() {
        return this._file.type;
    }

    get blob() {
        return this._file.slice(0, this.size, this.type);
    }

    @action
    public activate(id: string, serializedName: string): void {
        this.status = 'ready';
        this.id = id;
        this.serializedName = serializedName;
    }
}
