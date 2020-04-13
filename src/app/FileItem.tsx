import {observer}     from 'mobx-react';
import {Component, h} from 'preact';
import prettyBytes    from 'pretty-bytes';
import {ListedFile}   from '../state/models/ListedFiles';
import {bind, cn}     from '../utils/preact-utils';
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
        navigator.clipboard.writeText(
            `http://localhost:8080/shared/${key}`
        );
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
