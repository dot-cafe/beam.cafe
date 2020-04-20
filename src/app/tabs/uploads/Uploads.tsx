import {observer}     from 'mobx-react';
import {Component, h} from 'preact';
import {uploads}      from '../../../state';
import {Upload}       from '../../../state/models/Uploads';
import {bind}         from '../../../utils/preact-utils';
import {UploadItem}   from './UploadItem';
import styles         from './Uploads.module.scss';

@observer
export class Uploads extends Component {

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
        const {listedUploads} = uploads;
        const groupedDownloads = new Map<string, Array<Upload>>();

        for (const upload of listedUploads) {
            const fileName = upload.listedFile.file.name;
            const list = groupedDownloads.get(fileName) || [];
            groupedDownloads.set(fileName, [...list, upload]);
        }

        const items = [...groupedDownloads.entries()].map(
            ([fileName, uploads], index) => {
                const canPause = uploads.some(v => v.state === 'running');
                const canResume = uploads.some(v => v.state === 'paused');
                const canCancel = canPause || canResume;

                return (
                    <div className={styles.listItem}
                         key={index}>

                        <div className={styles.header}>
                            <h3>{fileName}</h3>
                            <div className={styles.controls}>
                                <button disabled={!canResume} onClick={this.resumeAll(uploads)}>Resume</button>
                                <button disabled={!canPause} onClick={this.pauseAll(uploads)}>Pause</button>
                                <button disabled={!canCancel} onClick={this.cancelAll(uploads)}>Cancel</button>
                            </div>
                        </div>

                        <div className={styles.uploadList}>
                            {uploads.map((value, i) =>
                                <UploadItem key={i} upload={value}/>
                            )}
                        </div>
                    </div>
                );
            }
        );

        return (
            <div className={styles.uploads}>
                {items}
            </div>
        );
    }
}
