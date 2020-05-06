import {observer}            from 'mobx-react';
import {Component, h}        from 'preact';
import {uploads}             from '../../../state';
import {SelectType, Upload}  from '../../../state';
import {bind, cn}            from '../../../utils/preact-utils';
import {Checkbox}            from '../../components/Checkbox';
import {getStatusIconFor}    from './statusIcon';
import {getStatusMessageFor} from './statusMessage';
import styles                from './UploadItem.module.scss';

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

    @bind
    toggleSelect(): void {
        uploads.select(this.props.upload.id, SelectType.Toggle);
    }

    render() {
        const {upload} = this.props;
        const {state, progress} = upload;

        // Styling information
        const percentage = Math.round(progress * 10000) / 100;
        const progressBarStyle = `--progress: ${percentage}%;`
            + `--text-clip-left: ${percentage}%;`
            + `--text-clip-right: ${100 - percentage}%;`;

        const icons = getStatusIconFor(state);
        const message = getStatusMessageFor(upload);

        return (
            <div className={styles.upload}
                 data-state={state}>

                <Checkbox checked={uploads.isSelected(upload)}
                          onChange={this.toggleSelect}/>

                <div className={styles.progressBar}
                     style={progressBarStyle}>
                    <p><span>{message}</span></p>
                    <p><span>{message}</span></p>
                </div>

                <button onClick={this.togglePause}
                        className={cn(styles.btn, styles.pauseBtn)}>
                    {icons}
                </button>

                <button onClick={this.cancel}
                        className={cn(styles.btn, styles.abortBtn)}>
                    <bc-icon name="delete"/>
                </button>
            </div>
        );
    }
}
