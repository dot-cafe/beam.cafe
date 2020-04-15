import {observer}         from 'mobx-react';
import {Component, h}     from 'preact';
import {Upload}           from '../../../state/models/Uploads';
import {bind}             from '../../../utils/preact-utils';
import {getStatusIconFor} from './statusIcon';
import styles             from './UploadItem.module.scss';

type Props = {
    upload: Upload;
};

type State = {};

@observer
export class UploadItem extends Component<Props, State> {

    @bind
    togglePause(): void {
        const {_xhUpload} = this.props.upload;

        if (_xhUpload.state === 'running') {
            _xhUpload.pause();
        } else if (_xhUpload.state === 'paused') {
            _xhUpload.resume();
        }
    }

    render() {
        const {upload} = this.props;
        const {state, progress} = upload;

        // Round progress to two decimal places
        const percentage = Math.round(progress * 10000) / 100;

        // Styling information
        const progressBarStyle = `--progress: ${percentage}%;`
            + `--text-clip-left: ${percentage}%;`
            + `--text-clip-right: ${100 - percentage}%;`;

        let text = `${percentage}%`;
        switch (state) {
            case 'idle':
                text = 'Pending...';
                break;
            case 'paused':
                text = `${text} - Paused`;
                break;
            case 'cancelled':
                text = 'Cancelled by uploader';
                break;
            case 'errored':
                text = 'Errored';
                break;
            case 'timeout':
                text = 'Upload timeout';
                break;
            case 'finished':
                text = 'Done';
                break;
            case 'peer-cancelled':
                text = ' Cancelled by peer';
                break;
        }

        return (
            <div className={styles.upload}
                 data-state={state}>

                <div className={styles.progressBar}
                     style={progressBarStyle}>
                    <p><span>{text}</span></p>
                    <p><span>{text}</span></p>
                </div>

                <button onClick={this.togglePause}>
                    {getStatusIconFor(state)}
                </button>
            </div>
        );
    }
}
