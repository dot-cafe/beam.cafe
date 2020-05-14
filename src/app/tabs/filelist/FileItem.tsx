import {observer}        from 'mobx-react';
import {Component, h}    from 'preact';
import prettyBytes       from 'pretty-bytes';
import {files, uploads}  from '../../../state';
import {ListedFile}      from '../../../state/models/ListedFile';
import {copyToClipboard} from '../../../utils/copy-to-clipboard';
import {bind, cn}        from '../../../utils/preact-utils';
import {isMobile}        from '../../browserenv';
import {ContextMenu}     from '../../components/ContextMenu';
import {DialogBox}       from '../../overlays/DialogBox';
import {Toast}           from '../../overlays/Toast';
import styles            from './FileItem.module.scss';
import {FileStatus}      from './FileStatus';

type Props = {
    item: ListedFile;
    label: string;
};

type State = {};

@observer
export class FileItem extends Component<Props, State> {

    @bind
    share() {
        const {id, file} = this.props.item;
        const toast = Toast.instance;
        const link = `${env.API_ENDPOINT}/d/${id}`;

        /**
         * Check if share-api is available, only for mobile devices - it sucks on
         * desktop browsers (just looking at safari) which doesn't even give you the ability
         * to copy s*** to the god damn clipboard making this "feature" completely useless
         * and unusable.
         */
        if (navigator.share && isMobile) {
            navigator.share({
                title: file.name,
                text: `Download ${file.name}`,
                url: link
            }).then(() => null).then(() => null);
        } else {
            copyToClipboard(link).then(() => {
                toast.show('Link copied to clipboard!');
            }).catch(() => toast.show({
                text: 'Failed to copy link :(',
                type: 'error'
            }));
        }
    }

    @bind
    removeFile() {
        const {id} = this.props.item;

        if (id) {
            const relatedUploads = uploads.listedUploads.filter(
                v => v.listedFile.id === id && v.simpleState !== 'done'
            ).length;

            // Tell the user that uploads are about to get cancelled
            if (relatedUploads > 0) {
                DialogBox.instance.open({
                    icon: 'exclamation-mark',
                    title: 'Uh Oh! Are you sure about that?',
                    description: relatedUploads > 1 ?
                        `There are currently ${relatedUploads} uploads of this file. Continue?` :
                        'This file is currently being uploaded. Continue?',
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
                }).then(value => {
                    if (value === 1) {
                        files.removeFile(id);
                    }
                });
            } else {
                files.removeFile(id);
            }
        }
    }

    @bind
    contextMenuOption(id: string) {
        switch (id) {
            case 'share':
                return this.share();
            case 'remove':
                return this.removeFile();
        }
    }

    render() {
        const {item, label} = this.props;

        return (
            <div className={styles.fileItem}
                 data-state={item.status}>

                <FileStatus status={item.status} text={label}/>

                <p className={cn(styles.itemText, styles.fileName)}>
                    {item.file.name}
                </p>

                <p className={cn(styles.itemText, styles.alignRight)}>
                    {prettyBytes(item.file.size)}
                </p>

                {isMobile ? (
                    <ContextMenu className={styles.menuButton}
                                 onAction={this.contextMenuOption}
                                 button={<bc-icon name="more" className={styles.menuButton}/>}
                                 content={[{
                                     id: 'share',
                                     icon: navigator.share && isMobile ? 'share' : 'copy',
                                     text: navigator.share && isMobile ? 'Share' : 'Copy Link'
                                 }, {
                                     id: 'remove',
                                     icon: 'trash',
                                     text: 'Remove'
                                 }]}/>
                ) : (
                    <div className={styles.actionsBox}>
                        <button className={styles.shareBtn}
                                onClick={this.share}>
                            <bc-tooltip content={'Copy Link to Clipboard'}/>
                            <bc-icon name="copy"/>
                        </button>

                        <button className={styles.removeBtn}
                                onClick={this.removeFile}>
                            <bc-tooltip content="Remove File"/>
                            <bc-icon name="trash"/>
                        </button>
                    </div>
                )}

                <p className={styles.copyLinkOverlay}
                   onClick={this.share}>
                    <span>Copy Link</span>
                </p>
            </div>
        );
    }
}
