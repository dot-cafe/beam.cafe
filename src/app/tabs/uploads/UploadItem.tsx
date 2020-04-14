import {observer}     from 'mobx-react';
import {Component, h} from 'preact';
import {Upload}       from '../../../state/models/Uploads';
import {bind}         from '../../../utils/preact-utils';
import styles         from './UploadItem.module.scss';

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

    render() {
        const {upload} = this.props;
        const {xhUpload: {state, size, transferred}} = upload;

        // Current process in numbers
        const progress = transferred / size;
        const percentage = Math.round(progress * 10000) / 100;

        // Descriptive text
        const text = `${upload.listedFile.file.name} - ${percentage}%`;

        // Styling information
        const progressBarStyle = `--progress: ${percentage}%;`
            + `--text-clip-left: ${percentage}%;`
            + `--text-clip-right: ${100 - percentage}%;`;

        return (
            <div className={styles.upload}
                 data-state={state}>

                <div className={styles.progressBar}
                     style={progressBarStyle}>
                    <p><span>{text}</span></p>
                    <p><span>{text}</span></p>
                </div>

                <button onClick={this.togglePause}>
                    {state === 'paused' ? 'Resume' : 'Pause'}
                </button>

            </div>
        );
    }
}
