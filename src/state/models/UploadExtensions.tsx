import {UploadStream, UploadStreamState}    from '@state/models/UploadStream';
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
                    body: `Upload of "${listedFile.name}" has started!`
                });
            case 'awaiting-approval':
                return showNotification({
                    title: 'Someone requested a file!',
                    body: `Click to approve the request of "${listedFile.name}"`
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
                    body: `Your peer cancelled the download of "${listedFile.name}"`
                });
            case 'finished':
                return pushNotification({
                    title: 'Upload finished.',
                    body: `Upload of "${listedFile.name}" was successful!`
                });
            case 'errored':
                return pushNotification({
                    title: 'Upload failed.',
                    body: `Upload of "${listedFile.name}" failed, you might want to tell your friend to retry it.`
                });
        }
    },

    getStatusMessageFor(upload: Upload | UploadStream): string {
        const {state, progress} = upload;

        if (upload instanceof Upload) {

            // Round progress to two decimal places
            const percentage = Math.round(progress * 10000) / 100;
            const text = `${percentage.toFixed(2)}%`;

            switch (state) {
                case 'idle':
                    return 'Pending...';
                case 'paused':
                    return `${text} - Paused`;
                case 'running':
                    return `${text} - ${prettyBytes(upload.currentSpeed, {bits: true})}/s`;
                case 'removed':
                    return 'File removed';
                case 'cancelled':
                    return 'Cancelled by You';
                case 'connection-lost':
                    return 'Connection to server lost.';
                case 'peer-cancelled':
                    return 'Cancelled by peer';
                case 'errored':
                    return 'Errored';
                case 'finished':
                    return 'Done';
                case 'awaiting-approval':
                    return 'Auto-pause is activated. Press start to initiate upload.'; // BRR BRR I'm the terminator
            }
        } else {
            switch (state as UploadStreamState) {
                case 'idle':
                case 'awaiting-approval':
                    return 'Auto-pause is activated. Press start to initiate upload.';
                case 'running':
                    return progress ? `${prettyBytes(progress)} Transferred` : 'Pending stream...';
                case 'removed':
                    return progress ? `File removed (${prettyBytes(progress)} Transferred)` : 'File removed';
                case 'paused':
                    return progress ? `Stream paused (${prettyBytes(progress)} Transferred)` : 'Stream paused';
                case 'connection-lost':
                    return progress ? `Connection to server lost (${prettyBytes(progress)} Transferred)` : 'Connection to server lost';
                case 'peer-cancelled':
                    return progress ? `Cancelled by peer (${prettyBytes(progress)} Transferred)` : 'Cancelled by peer';
                case 'cancelled':
                    return progress ? `Stream cancelled (${prettyBytes(progress)} Transferred)` : 'Stream cancelled';
            }
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
