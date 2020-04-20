import {observer}         from 'mobx-react';
import {Component, h}     from 'preact';
import prettyBytes        from 'pretty-bytes';
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
        const {xhUpload} = this.props.upload;

        if (xhUpload.state === 'running') {
            xhUpload.pause();
        } else if (xhUpload.state === 'paused') {
            xhUpload.resume();
        }
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
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
                        <path
                            d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z"/>
                    </svg>
                </button>
            </div>
        );
    }
}
