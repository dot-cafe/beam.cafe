import {observer}     from 'mobx-react';
import {Component, h} from 'preact';
import {uploads}      from '../../../state';
import {Upload}       from '../../../state/stores/Uploads';
import {bind, cn}     from '../../../utils/preact-utils';
import styles         from './MassAction.module.scss';

@observer
export class MassAction extends Component {

    @bind
    resumeAll(uploads: Array<Upload>) {
        return () => {
            for (const {xhUpload} of uploads) {
                if (xhUpload.state === 'paused') {
                    xhUpload.resume();
                }
            }
        };
    }

    @bind
    pauseAll(uploads: Array<Upload>) {
        return () => {
            for (const {xhUpload} of uploads) {
                if (xhUpload.state === 'running') {
                    xhUpload.pause();
                }
            }
        };
    }

    @bind
    cancelAll(uploads: Array<Upload>) {
        return () => {
            for (const {xhUpload} of uploads) {
                xhUpload.abort();
            }
        };
    }

    render() {
        const {selectedUploads} = uploads;

        // TODO: Duplicate code, move to component / util
        const canPause = selectedUploads.some(v => v.state === 'running');
        const canResume = selectedUploads.some(v => v.state === 'paused');
        const canCancel = canPause || canResume;

        return (
            <div className={cn(styles.massAction, {
                [styles.visible]: uploads.selectedUploads.length > 0
            })}>
                <h3>{uploads.selectedUploads.length} Uploads selected</h3>

                <div className={styles.controls}>
                    <button disabled={!canResume} onClick={this.resumeAll(selectedUploads)}>Resume</button>
                    <button disabled={!canPause} onClick={this.pauseAll(selectedUploads)}>Pause</button>
                    <button disabled={!canCancel} onClick={this.cancelAll(selectedUploads)}>Cancel</button>
                </div>
            </div>
        );
    }
}
