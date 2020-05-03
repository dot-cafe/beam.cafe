import {h}           from 'preact';
import {JSXInternal} from 'preact/src/jsx';
import {UploadState} from '../../../state';

export const getStatusIconFor = (status: UploadState): JSXInternal.Element => {
    switch (status) {
        case 'idle':
        case 'paused':
            return <bc-icon name="play"/>;
        case 'running':
            return <bc-icon name="pause"/>;
        case 'removed':
        case 'cancelled':
        case 'errored':
        case 'timeout':
        case 'connection-lost':
            return <bc-icon name="exclamation-mark"/>;
        case 'finished':
            return <bc-icon name="ok"/>;
        case 'peer-cancelled':
            return <bc-icon name="question-mark"/>;
        case 'awaiting-approval':
            return <bc-icon name="thumbs-up"/>;
    }
};
