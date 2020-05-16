import {observer}            from 'mobx-react';
import {Component, h}        from 'preact';
import {SelectType, uploads} from '../../../state';
import {Upload}              from '../../../state/models/Upload';
import {UploadExtensions}    from '../../../state/models/UploadExtensions';
import {bind, cn}            from '../../../utils/preact-utils';
import {Checkbox}            from '../../components/Checkbox';
import styles                from './UploadItem.module.scss';

type Props = {
    upload: Upload;
};

type State = {};

@observer
export class UploadItem extends Component<Props, State> {

    @bind
    togglePause(): void {
        const {upload} = this.props;

        if (upload.simpleState === 'pending') {
            upload.update('running');
        } else if (upload.simpleState === 'active') {
            upload.update('paused');
        }
    }

    @bind
    cancel(): void {
        const {upload} = this.props;

        if (upload.simpleState === 'active' ||
            upload.simpleState === 'pending') {
            upload.update('cancelled');
        }
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

        const statusIcon = UploadExtensions.getStatusIconFor(state);
        const statusMessage = UploadExtensions.getStatusMessageFor(upload);
        const toolTipNote = (() => {
            switch (upload.state) {
                case 'awaiting-approval':
                    return 'Approve';
                case 'paused':
                    return 'Continue';
                case 'running':
                    return 'Pause';
            }

            return '';
        })();

        return (
            <div className={styles.upload}
                 data-state={state}>

                <Checkbox checked={uploads.isSelected(upload)}
                          onChange={this.toggleSelect}/>

                <div className={styles.progressBar}
                     style={progressBarStyle}>
                    <p><span>{statusMessage}</span></p>
                    <p><span>{statusMessage}</span></p>
                </div>

                <button onClick={this.togglePause}
                        className={cn(styles.btn, styles.pauseBtn)}>
                    <bc-tooltip content={toolTipNote}/>
                    {statusIcon}
                </button>

                {upload.simpleState !== 'done' && <button onClick={this.cancel}
                                                          className={cn(styles.btn, styles.abortBtn)}>
                    <bc-tooltip content="Cancel Upload"/>
                    <bc-icon name="delete"/>
                </button>}
            </div>
        );
    }
}
