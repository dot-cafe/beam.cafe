import {observer}     from 'mobx-react';
import {Component, h} from 'preact';
import prettyBytes    from 'pretty-bytes';
import {ListedFile}   from '../../../state/models/Files';
import {bind, cn}     from '../../../utils/preact-utils';
import {Toast}        from '../../overlays/Toast';
import styles         from './FileItem.module.scss';
import {FileStatus}   from './FileStatus';

type Props = {
    item: ListedFile;
    label: string;
};

type State = {};

@observer
export class FileItem extends Component<Props, State> {

    @bind
    copyLink() {
        const {key} = this.props.item;

        const toast = Toast.getInstance();
        navigator.clipboard.writeText(
            `http://localhost:8080/shared/${key}`
        ).then(() => toast.set({
            text: 'Link copied to clipboard!',
            type: 'success'
        })).catch(() => toast.set({
            text: 'Failed to copy link :(',
            type: 'error'
        }));
    }

    render() {
        const {item, label} = this.props;

        return (
            <div className={styles.fileItem}>
                <div className={styles.status}>
                    <FileStatus status={item.status} text={label}/>
                </div>

                <p className={styles.itemText}>
                    {item.file.name}
                </p>

                <p className={cn(styles.itemText, styles.alignRight)}>
                    {prettyBytes(item.file.size)}
                </p>

                <div className={styles.actionsBox}>
                    <button className={cn({
                        [styles.disabled]: item.status === 'loading'
                    })} onClick={this.copyLink}>
                        Share
                    </button>
                </div>
            </div>
        );
    }
}
