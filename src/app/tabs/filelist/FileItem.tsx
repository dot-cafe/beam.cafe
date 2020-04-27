import {observer}        from 'mobx-react';
import {Component, h}    from 'preact';
import {files}           from '../../../state';
import {ListedFile}      from '../../../state/models/ListedFile';
import {copyToClipboard} from '../../../utils/copyToClipboard';
import {bind, cn}        from '../../../utils/preact-utils';
import {isMobile}        from '../../browserenv';
import {Toast}           from '../../overlays/Toast';
import {FileStatus}      from './FileStatus';
import Icon              from '../../components/Icon';
import styles            from './FileItem.module.scss';
import prettyBytes       from 'pretty-bytes';

type Props = {
    item: ListedFile;
    label: string;
};

type State = {};

@observer
export class FileItem extends Component<Props, State> {

    @bind
    copyLink() {
        const {id, file} = this.props.item;
        const toast = Toast.getInstance();
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
            copyToClipboard(link).then(() => toast.set({
                text: 'Link copied to clipboard!',
                type: 'success'
            })).catch(() => toast.set({
                text: 'Failed to copy link :(',
                type: 'error'
            }));
        }
    }

    @bind
    removeFile(e: MouseEvent) {
        const {id} = this.props.item;

        if (id) {
            files.removeFile(id);
        }

        e.stopPropagation();
        e.stopImmediatePropagation();
    }

    render() {
        const {item, label} = this.props;

        return (
            <div className={styles.fileItem}
                 data-state={item.status}
                 onClick={this.copyLink}>
                <div className={styles.status}>
                    <FileStatus status={item.status} text={label}/>
                </div>

                <p className={cn(styles.itemText, styles.fileName)}>
                    {item.file.name}
                </p>

                <p className={cn(styles.itemText, styles.alignRight)}>
                    {prettyBytes(item.file.size)}
                </p>

                <div className={styles.actionsBox}>
                    <button className={styles.shareBtn}
                            onClick={this.copyLink}>
                        <Icon name={navigator.share && isMobile ? 'share' : 'copy'}/>
                    </button>

                    <button className={styles.removeBtn}
                            onClick={this.removeFile}>
                        <Icon name="trash"/>
                    </button>
                </div>

                <p className={styles.copyLinkOverlay}>
                    <span>Copy Link</span>
                </p>
            </div>
        );
    }
}
