import {h}                                            from 'preact';
import {JSXInternal}                                  from 'preact/src/jsx';
import prettyBytes                                    from 'pretty-bytes';
import {pushNotification, settings, showNotification} from '..';
import {Upload, UploadState}                          from './Upload';

export const UploadExtensions = {
    availableNotifications: [
        ['running', 'Has started.'],
        ['awaiting-approval', 'Is awaiting your approval.'],
        ['peer-cancelled', 'Got cancelled by your peer.'],
        ['finished', 'Has finished.'],
        ['errored', 'Failed.']
    ] as Array<[UploadState, string]>,

    notifyFor(upload: Upload): boolean | Promise<void> | void {
        const {state, listedFile} = upload;

        switch (state) {
            case 'running':
                return pushNotification({
                    title: 'You started uploading a file!',
                    body: `Upload of "${listedFile.file.name}" has started!`
                });
            case 'awaiting-approval':
                return showNotification({
                    title: 'Someone requested a file!',
                    body: `Click to approve the request of "${listedFile.file.name}"`
                }).then((data) => {
                    if (data === 'click') {
                        upload.update('running');
                    } else if (data === 'close') {
                        upload.update('cancelled');
                    }
                });
            case 'peer-cancelled':
                return pushNotification({
                    title: 'Upload cancelled by your peer.',
                    body: `Your peer cancelled the download of "${listedFile.file.name}"`
                });
            case 'finished':
                return pushNotification({
                    title: 'Upload finished.',
                    body: `Upload of "${listedFile.file.name}" was successful!`
                });
            case 'errored':
                return pushNotification({
                    title: 'Upload failed.',
                    body: `Upload of "${listedFile.file.name}" failed, you might want to tell your friend to retry it.`
                });
        }
    }
};
