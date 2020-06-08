import {ListedFile}          from '@state/models/ListedFile';
import {UploadLike}          from '@state/models/types';
import {Upload}              from '@state/models/Upload';
import {UploadStream}        from '@state/models/UploadStream';
import {MassAction, uploads} from '@state/stores/Uploads';
import {bind}                from '@utils/preact-utils';
import {observer}            from 'mobx-react';
import {Component, h}        from 'preact';
import styles                from './UploadBox.module.scss';
import {UploadItem}          from './UploadItem';
import {UploadStreamItem}    from './UploadStreamItem';

type Props = {
    uploadItems: Array<UploadLike>;
    listedFile: ListedFile;
};

@observer
export class UploadBox extends Component<Props> {

    @bind
    massAction(ups: Array<UploadLike>, action: MassAction) {
        return () => uploads.performMassAction(ups, action);
    }

    @bind
    selectItem(item: UploadLike, ev: MouseEvent) {
        uploads.selectViaMouseEvent(ev, item, this.props.uploadItems);
    }

    render() {
        const {uploadItems, listedFile} = this.props;
        const {name} = listedFile;
        const massActions = uploads.getAvailableMassActions(uploadItems);

        return (
            <div className={styles.uploadBox}
                 role="listbox"
                 aria-label={`Grouped uploads of ${name}`}>

                <div className={styles.header}>
                    <div className={styles.fileName}>
                        <h3>{name}</h3>
                    </div>

                    <div className={styles.controls}>
                        <button disabled={!massActions.has('resume')}
                                onClick={this.massAction(uploadItems, 'resume')}
                                aria-label={`Resume uploads of ${name}`}>
                            <bc-tooltip content="Resume all"/>
                            <bc-icon name="play"/>
                        </button>

                        <button disabled={!massActions.has('pause')}
                                onClick={this.massAction(uploadItems, 'pause')}
                                aria-label={`Pause uploads of ${name}`}>
                            <bc-tooltip content="Pause all"/>
                            <bc-icon name="pause"/>
                        </button>

                        <button disabled={!massActions.has('cancel')}
                                onClick={this.massAction(uploadItems, 'cancel')}
                                aria-label={`Cancel uploads of ${name}`}>
                            <bc-tooltip content="Cancel all"/>
                            <bc-icon name="delete"/>
                        </button>

                        {massActions.has('remove') ?
                            <button onClick={this.massAction(uploadItems, 'remove')}
                                    aria-label={`Remove finished uploads of ${name}`}>
                                <bc-tooltip content="Clear all"/>
                                <bc-icon name="trash"/>
                            </button> : ''}
                    </div>
                </div>

                <div className={styles.uploadList}>
                    {uploadItems.map(item =>
                        item instanceof Upload ?
                            <UploadItem key={item.id}
                                        item={item}
                                        selected={uploads.isSelected(item)}
                                        onSelect={this.selectItem}/> :
                            <UploadStreamItem key={item.id}
                                              item={item as UploadStream}
                                              selected={uploads.isSelected(item)}
                                              onSelect={this.selectItem}/>
                    )}
                </div>
            </div>
        );
    }
}
