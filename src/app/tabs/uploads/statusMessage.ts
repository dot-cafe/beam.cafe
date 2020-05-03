import prettyBytes from 'pretty-bytes';
import {Upload}    from '../../../state';

export const getStatusMessageFor = (upload: Upload): string => {
    const {state, progress} = upload;

    // Round progress to two decimal places
    const percentage = Math.round(progress * 10000) / 100;
    let text = `${percentage.toFixed(2)}%`;

    switch (state) {
        case 'idle':
            return 'Pending...';
        case 'paused':
            return `${text} - Paused`;
        case 'running': {
            const speed = prettyBytes(upload.xhUpload.currentSpeed, {bits: true});
            return `${text} - ${speed}/s`;
        }
        case 'removed':
            return 'File removed';
        case 'cancelled':
            return 'Cancelled by you';
        case 'errored':
            return 'Errored';
        case 'timeout':
            return 'Upload timeout';
        case 'finished':
            return 'Done';
        case 'peer-cancelled':
            return ' Cancelled by peer';
        case 'awaiting-approval':
            return 'Auto-pause is activated. Press start to initiate upload.'; // BRR BRR I'm the terminator
    }
};

