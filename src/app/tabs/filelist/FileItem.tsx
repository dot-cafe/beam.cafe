import {observer}        from 'mobx-react';
import {Component, h}    from 'preact';
import prettyBytes       from 'pretty-bytes';
import {files}           from '../../../state';
import {ListedFile}      from '../../../state/models/ListedFile';
import {copyToClipboard} from '../../../utils/copyToClipboard';
import {bind, cn}        from '../../../utils/preact-utils';
import Icon              from '../../components/Icon';
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
    copyLink() {
        const {id, file} = this.props.item;

        const toast = Toast.getInstance();
        const link = `${env.API_ENDPOINT}/d/${id}`;

        // navigator.share
        if (navigator.share) {
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
    removeFile() {
        const {id} = this.props.item;

        if (id) {
            files.removeFile(id);
        }
    }

    render() {
        const {item, label} = this.props;

        return (
            <div className={styles.fileItem}>
                <div className={styles.status}>
                    <FileStatus status={item.status} text={label}/>
                </div>

                <p className={cn(styles.itemText, styles.fileName)}>
                    {item.file.name}
                </p>

                <p className={cn(styles.itemText, styles.alignRight)}>
                    {prettyBytes(item.file.size)}
                </p>

                <div className={cn(styles.actionsBox, {
                    [styles.disabled]: item.status !== 'ready'
                })}>
                    <button className={styles.shareBtn}
                            onClick={this.copyLink}>
                        <Icon name={navigator.share ? 'share' : 'copy'}/>
                    </button>

                    <button className={styles.removeBtn}
                            onClick={this.removeFile}>
                        <Icon name="trash"/>
                    </button>
                </div>
            </div>
        );
    }
}
