import {ListedFile}          from '@state/models/ListedFile';
import {MassAction, uploads} from '@state/stores/Uploads';
import {observer}            from 'mobx-react';
import {Component, h}        from 'preact';
import {bind}                from '@utils/preact-utils';
import {Upload}              from '@state/models/Upload';
import {UploadItem}          from './UploadItem';
import styles                from './UploadBox.module.scss';

type Props = {
    uploadItems: Array<Upload>;
    listedFile: ListedFile;
};

type State = {};

@observer
export class UploadBox extends Component<Props, State> {

    @bind
    massAction(ups: Array<Upload>, action: MassAction) {
        return () => uploads.performMassAction(ups, action);
    }

    render() {
        const {uploadItems, listedFile} = this.props;
        const massActions = uploads.getAvailableMassActions(uploadItems);

        return (
            <div className={styles.uploadBox}>

                <div className={styles.header}>
                    <div className={styles.fileName}>
                        {
                            massActions.includes('remove') ?
                                <button onClick={this.massAction(uploadItems, 'remove')}>
                                    <bc-tooltip content={'Clear'}/>
                                    <bc-icon name="delete"/>
                                </button> : ''
                        }
                        <h3>{listedFile.file.name}</h3>
                    </div>

                    <div className={styles.controls}>
                        <button disabled={!massActions.includes('resume')}
                                onClick={this.massAction(uploadItems, 'resume')}>
                            Resume
                        </button>

                        <button disabled={!massActions.includes('pause')}
                                onClick={this.massAction(uploadItems, 'pause')}>
                            Pause
                        </button>

                        <button disabled={!massActions.includes('cancel')}
                                onClick={this.massAction(uploadItems, 'cancel')}>
                            Cancel
                        </button>
                    </div>
                </div>

                <div className={styles.uploadList}>
                    {uploadItems.map((value, i) =>
                        <UploadItem key={i} upload={value}/>
                    )}
                </div>
            </div>
        );
    }
}
