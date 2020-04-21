import {observer}             from 'mobx-react';
import {Component, h}         from 'preact';
import {uploads}              from '../../../state';
import {FINAL_STATES, Upload} from '../../../state/models/Uploads';
import {bind}                 from '../../../utils/preact-utils';
import {UploadItem}           from './UploadItem';
import styles                 from './Uploads.module.scss';

@observer
export class Uploads extends Component {

    @bind
    removeAll(fileName: string) {
        return () => uploads.removeByFileName(fileName);
    }

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
                const canRemove = !canPause && !canResume && uploads.every(v => FINAL_STATES.includes(v.state));
                const canCancel = canPause || canResume;

                return (
                    <div className={styles.listItem}
                         key={index}>

                        <div className={styles.header}>
                            <div className={styles.fileName}>
                                {canRemove &&
                                <button onClick={this.removeAll(fileName)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
                                        <path
                                            d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z"/>
                                    </svg>
                                </button>}
                                <h3>{fileName}</h3>
                            </div>
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
