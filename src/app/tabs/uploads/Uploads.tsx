import {observer}     from 'mobx-react';
import {Component, h} from 'preact';
import {uploads}      from '../../../state';
import {Upload}       from '../../../state/models/Uploads';
import {UploadItem}   from './UploadItem';
import styles         from './Uploads.module.scss';

@observer
export class Uploads extends Component {
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
                return (
                    <div className={styles.listItem}
                         key={index}>
                        <h3>{fileName}</h3>
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
