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
    serializedName: string;
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

        // Request first set of register-files
        socket.sendMessage('register-files', keysToRequest);

        // Show toast if files were skipped
        if (skipped > 0) {
            Toast.instance.show({
                text: `Skipped ${skipped} file${skipped > 1 ? 's' : ''} which were already listed.`,
                type: 'warning'
            });
        }
    }

    @action
    public remove(...files: Array<ListedFile>) {
        const ids = [];

        for (const file of files) {

            // File is about to get removed
            file.status = 'removing';

            setTimeout(() => {
                const index = this.listedFiles.indexOf(file);
                this.unselect(file);
                this.listedFiles.splice(index, 1);
            }, remainingWaitingTime(file.updated));

            // Check if file was registered
            if (file.id) {
                ids.push(file.id);

                // Cancel uploads
                uploads.performMassStatusUpdate(
                    'removed',
                    ...uploads.listedUploads.filter(
                        u => u.listedFile === file && u.simpleState !== 'done'
                    )
                );
            }
        }

        socket.sendMessage('remove-files', ids);
    }

    public refresh(...files: Array<ListedFile>) {
        const partials = files
            .filter(v => v.status !== 'removing')
            .map(v => {
                v.status = 'loading';
                return pick(v.file, ['name', 'size']);
            });

        // Cancel uploads
        uploads.performMassStatusUpdate(
            'cancelled',
            ...uploads.listedUploads.filter(
                u => files.includes(u.listedFile) && u.simpleState !== 'done'
            )
        );

        // Request new keys
        socket.sendMessage('register-files', partials);
    }

    @action
    public activate(idPairs: Keys) {
        for (const {name, serializedName, id} of idPairs) {
            const target = this.listedFiles.find(
                value => value.file.name === name
            );

            if (target) {
                setTimeout(
                    () => target.activate(id, serializedName),
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
