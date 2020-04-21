import {h}           from 'preact';
import {JSXInternal} from 'preact/src/jsx';
import {UploadState} from '../../../state/stores/Uploads';
import Icon          from '../../components/Icon';

export const getStatusIconFor = (status: UploadState): JSXInternal.Element => {
    switch (status) {
        case 'idle':
        case 'paused':
            return <Icon name="play"/>;
        case 'running':
            return <Icon name="pause"/>;
        case 'removed':
        case 'cancelled':
        case 'errored':
        case 'timeout':
            return <Icon name="exclamation-mark"/>;
        case 'finished':
            return <Icon name="ok"/>;
        case 'peer-cancelled': {
            return <Icon name="question-mark"/>;
        }
    }
};
