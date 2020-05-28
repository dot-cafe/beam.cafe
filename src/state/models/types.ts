import {ListedFile} from '@state/models/ListedFile';

export type UploadLikeSimpleState = 'pending' | 'active' | 'done';

export interface UploadLike<States extends string = string> {
    listedFile: ListedFile;
    id: string;
    state: States;
    simpleState: UploadLikeSimpleState;
    progress: number;
    currentSpeed: number;

    update(status: States): boolean;
}
