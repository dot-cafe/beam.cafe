import {observer}            from 'mobx-react';
import {Component, h}        from 'preact';
import {MassAction, uploads} from '../../../state';
import {Upload}              from '../../../state';
import {bind}                from '../../../utils/preact-utils';
import {MassActions}         from './MassActions';
import {UploadItem}          from './UploadItem';
import styles                from './Uploads.module.scss';

@observer
export class Uploads extends Component {

    @bind
    massAction(ups: Array<Upload>, action: MassAction) {
        return () => uploads.performMassAction(ups, action);
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
            ([fileName, ups], index) => {
                const massActions = uploads.getAvailableMassActions(ups);

                return (
                    <div className={styles.listItem}
                         key={index}>

                        <div className={styles.header}>
                            <div className={styles.fileName}>
                                {
                                    massActions.includes('remove') ?
                                        <button onClick={this.massAction(ups, 'remove')}>
                                            <bc-icon name="delete"/>
                                        </button> : ''
                                }
                                <h3>{fileName}</h3>
                            </div>

                            <div className={styles.controls}>
                                <button disabled={!massActions.includes('resume')}
                                        onClick={this.massAction(ups, 'resume')}>
                                    Resume
                                </button>

                                <button disabled={!massActions.includes('pause')}
                                        onClick={this.massAction(ups, 'pause')}>
                                    Pause
                                </button>

                                <button disabled={!massActions.includes('cancel')}
                                        onClick={this.massAction(ups, 'cancel')}>
                                    Cancel
                                </button>
                            </div>
                        </div>

                        <div className={styles.uploadList}>
                            {ups.map((value, i) =>
                                <UploadItem key={i} upload={value}/>
                            )}
                        </div>
                    </div>
                );
            }
        );

        return (
            <div className={styles.uploads}>
                { /* eslint-disable react/jsx-key */
                    items.length ? [
                        <MassActions/>,
                        items
                    ] : <div className={styles.placeholder}>
                        <bc-icon name="link"/>
                        <h1>Share a file to get started!</h1>
                    </div>
                }
            </div>
        );
    }
}
