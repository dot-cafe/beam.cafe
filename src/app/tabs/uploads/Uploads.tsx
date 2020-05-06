import {observer}            from 'mobx-react';
import {Component, h}        from 'preact';
import {MassAction, uploads} from '../../../state';
import {Upload}              from '../../../state';
import {ListedFile}          from '../../../state/models/ListedFile';
import {bind}                from '../../../utils/preact-utils';
import {MassActions}         from './MassActions';
import {UploadBox}           from './UploadBox';
import styles                from './Uploads.module.scss';

@observer
export class Uploads extends Component {

    @bind
    massAction(ups: Array<Upload>, action: MassAction) {
        return () => uploads.performMassAction(ups, action);
    }

    render() {
        const {listedUploads} = uploads;
        const groupedDownloads = new Map<ListedFile, Array<Upload>>();

        for (const upload of listedUploads) {
            const fileName = upload.listedFile;
            const list = groupedDownloads.get(fileName) || [];
            groupedDownloads.set(fileName, [...list, upload]);
        }

        const items = [...groupedDownloads.entries()].map(
            ([listedFile, uploadItems], index) => (
                <UploadBox listedFile={listedFile}
                           uploadItems={uploadItems}
                           key={index}/>
            )
        );

        return (
            <div className={styles.uploads}>
                { /* eslint-disable react/jsx-key */
                    items.length ? [
                        <div className={styles.itemList}>
                            {items}
                        </div>,
                        <MassActions/>
                    ] : (
                        <div className={styles.placeholder}>
                            <bc-icon name="link"/>
                            <h1>Share a file to get started!</h1>
                        </div>
                    )
                }
            </div>
        );
    }
}
