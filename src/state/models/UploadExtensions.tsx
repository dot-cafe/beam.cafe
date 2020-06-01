import {EventTarget}                        from '@utils/polyfills/EventTarget';
import {h}                                  from 'preact';
import {JSXInternal}                        from 'preact/src/jsx';
import prettyBytes                          from 'pretty-bytes';
import {pushNotification, showNotification} from '..';
import {Upload, UploadState}                from './Upload';

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
                }).then(data => {
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
    },

    getStatusMessageFor(upload: Upload): string {
        const {state, progress} = upload;

        // Round progress to two decimal places
        const percentage = Math.round(progress * 10000) / 100;
        const text = `${percentage.toFixed(2)}%`;

        switch (state) {
            case 'idle':
                return 'Pending...';
            case 'paused':
                return `${text} - Paused`;
            case 'running': {
                const speed = prettyBytes(upload.currentSpeed, {bits: true});
                return `${text} - ${speed}/s`;
            }
            case 'removed':
                return 'File removed';
            case 'cancelled':
                return 'Cancelled by You';
            case 'connection-lost':
                return 'Connection to server lost.';
            case 'peer-cancelled':
                return ' Cancelled by peer';
            case 'errored':
                return 'Errored';
            case 'finished':
                return 'Done';
            case 'awaiting-approval':
                return 'Auto-pause is activated. Press start to initiate upload.'; // BRR BRR I'm the terminator
        }
    },

    getStatusIconFor(status: UploadState): JSXInternal.Element {
        switch (status) {
            case 'idle':
            case 'paused':
                return <bc-icon name="play"/>;
            case 'running':
                return <bc-icon name="pause"/>;
            case 'removed':
            case 'cancelled':
            case 'errored':
                return <bc-icon name="exclamation-mark"/>;
            case 'finished':
                return <bc-icon name="ok"/>;
            case 'peer-cancelled':
                return <bc-icon name="broken-link"/>;
            case 'connection-lost':
                return <bc-icon name="cloud-cross"/>;
            case 'awaiting-approval':
                return <bc-icon name="thumbs-up"/>;
        }
    }
};
