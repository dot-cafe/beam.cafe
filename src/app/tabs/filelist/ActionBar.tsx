import {DialogBox}              from '@overlays/DialogBox';
import {files}                  from '@state/stores/Files';
import {uploads}                from '@state/stores/Uploads';
import {observer}               from 'mobx-react';
import {FunctionalComponent, h} from 'preact';
import {isMobile}               from '../../browserenv';
import styles                   from './ActionBar.module.scss';

export const ActionBar: FunctionalComponent = observer(() => {
    const removeSelectedFiles = () => {
        const {selectedItems} = files;

        const relatedUploads = uploads.listedUploads.filter(
            v => v.simpleState !== 'done' && selectedItems.includes(v.listedFile)
        ).length;

        const remove = () => {
            for (const item of selectedItems) {
                if (item.id) {
                    files.removeFile(item.id);
                }
            }
        };

        // Tell the user that uploads are about to get cancelled
        if (relatedUploads > 0) {
            DialogBox.instance.open({
                icon: 'exclamation-mark',
                title: 'Uh Oh! Are you sure about that?',
                description: relatedUploads > 1 ?
                    `There are currently ${relatedUploads} uploads related to the selected files. Continue?` :
                    'One of the files selected is currently being uploaded. Continue?',
                buttons: [
                    {
                        type: 'success',
                        text: 'Keep File'
                    },
                    {
                        type: 'error',
                        text: 'Remove'
                    }
                ]
            }).then(value => value === 1 && remove());
        } else {
            remove();
        }
    };

    const {selectedAmount} = files;
    return (
        <div className={styles.actionBar}>
            <button onClick={() => files.openDialog()}
                    className={styles.addBtn}
                    aria-label="Add files manually">
                <bc-icon name="plus"/>
                <span>Add Files</span>
            </button>

            {!isMobile && selectedAmount ?
                <div className={styles.removeBtn}>
                    <button onClick={removeSelectedFiles}
                            aria-label="Remove files">
                        <bc-icon name="trash"/>
                        <span>Remove {selectedAmount > 1 ? `${selectedAmount} files` : 'file'}</span>
                    </button>

                    <button onClick={() => files.clearSelection()}
                            aria-label="Clear selection">
                        <bc-icon name="delete"/>
                        <bc-tooltip content="Clear Selection"/>
                    </button>
                </div> : ''
            }
        </div>
    );
});
