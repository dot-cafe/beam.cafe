import {observer}     from 'mobx-react';
import {Component, h} from 'preact';
import prettyBytes    from 'pretty-bytes';
import {ListedFile}   from '../state/models/ListedFiles';
import {bind}         from '../utils/preact-utils';
import styles         from './FileItem.module.scss';

type Props = {
    item: ListedFile;
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
        const {item} = this.props;

        return (
            <div className={styles.fileItem}>
                <p>{item.name}</p>
                <p>{prettyBytes(item.size)}</p>
                <button onClick={this.copyLink}>
                    {item.key ? 'Copy Link' : '...'}
                </button>
            </div>
        );
    }
}
