import {observer}     from 'mobx-react';
import {Component, h} from 'preact';
import {listedFiles}  from '../state';
import {FileItem}     from './FileItem';
import styles         from './FileList.module.scss';

type Props = {};
type State = {};

@observer
export class FileList extends Component<Props, State> {
    render() {
        const {files} = listedFiles;

        return (
            <div className={styles.fileList}>
                {files.map((value, i) => <FileItem item={value} key={i}/>)}
            </div>
        );
    }
}
