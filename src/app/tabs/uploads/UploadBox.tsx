import {ListedFile}          from '@state/models/ListedFile';
import {Upload}              from '@state/models/Upload';
import {MassAction, uploads} from '@state/stores/Uploads';
import {bind}                from '@utils/preact-utils';
import {observer}            from 'mobx-react';
import {Component, h}        from 'preact';
import styles                from './UploadBox.module.scss';
import {UploadItem}          from './UploadItem';

type Props = {
    uploadItems: Array<Upload>;
    listedFile: ListedFile;
};

@observer
export class UploadBox extends Component<Props> {

    @bind
    massAction(ups: Array<Upload>, action: MassAction) {
        return () => uploads.performMassAction(ups, action);
    }

    @bind
    selectItem(item: Upload, ev: MouseEvent) {
        uploads.selectViaMouseEvent(ev, item, this.props.uploadItems);
    }

    render() {
        const {uploadItems, listedFile} = this.props;
        const massActions = uploads.getAvailableMassActions(uploadItems);

        return (
            <div className={styles.uploadBox}>

                <div className={styles.header}>
                    <div className={styles.fileName}>
                        <h3>{listedFile.file.name}</h3>
                    </div>

                    <div className={styles.controls}>
                        <button disabled={!massActions.includes('resume')}
                                onClick={this.massAction(uploadItems, 'resume')}>
                            <bc-tooltip content="Resume all"/>
                            Resume
                        </button>

                        <button disabled={!massActions.includes('pause')}
                                onClick={this.massAction(uploadItems, 'pause')}>
                            <bc-tooltip content="Pause all"/>
                            Pause
                        </button>

                        <button disabled={!massActions.includes('cancel')}
                                onClick={this.massAction(uploadItems, 'cancel')}>
                            <bc-tooltip content="Cancel all"/>
                            Cancel
                        </button>

                        {massActions.includes('remove') ?
                            <button onClick={this.massAction(uploadItems, 'remove')}>
                                <bc-tooltip content="Clear all"/>
                                Clear
                            </button> : ''}
                    </div>
                </div>

                <div className={styles.uploadList}>
                    {uploadItems.map(item =>
                        <UploadItem key={item.id}
                                    item={item}
                                    selected={uploads.isSelected(item)}
                                    onSelect={this.selectItem}/>
                    )}
                </div>
            </div>
        );
    }
}
