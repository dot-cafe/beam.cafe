import {observer}         from 'mobx-react';
import {Component, h}     from 'preact';
import prettyBytes        from 'pretty-bytes';
import {Upload}           from '../../../state/models/Uploads';
import {bind}             from '../../../utils/preact-utils';
import Icon               from '../../components/Icon';
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
        this.props.upload.xhUpload.toggleState();
    }

    @bind
    cancel(): void {
        this.props.upload.xhUpload.abort();
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

        let text = `${percentage.toFixed(2)}%`;
        switch (state) {
            case 'idle':
                text = 'Pending...';
                break;
            case 'paused':
                text = `${text} - Paused`;
                break;
            case 'running': {
                const speed = prettyBytes(upload.xhUpload.currentSpeed, {bits: true});
                text = `${text} - ${speed}/s`;
                break;
            }
            case 'removed':
                text = 'File removed';
                break;
            case 'cancelled':
                text = 'Cancelled by you';
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

                <button onClick={this.togglePause}
                        className={styles.pauseBtn}>
                    {getStatusIconFor(state)}
                </button>

                <button onClick={this.cancel}
                        className={styles.abortBtn}>
                    <Icon name="cross"/>
                </button>
            </div>
        );
    }
}
