import {observer}     from 'mobx-react';
import {Component, h} from 'preact';
import {listedFiles}  from '../../../state';
import {FileItem}     from './FileItem';
import styles         from './FileList.module.scss';

type Props = {};
type State = {};

@observer
export class FileList extends Component<Props, State> {
    render() {
        const {files} = listedFiles;
        const indexPadding = Math.max(String(files.length).length, 2);

        return (
            <div className={styles.fileList}>
                <div className={styles.header}>
                    <p>#</p>
                    <p>Filename</p>
                    <p>Filesize</p>
                    <p className={styles.alignRight}>Action</p>
                </div>

                <div className={styles.list}>
                    {files.map((value, i) =>
                        <FileItem key={i}
                                  item={value}
                                  label={String(i + 1).padStart(indexPadding, '0')}/>
                    )}
                </div>
            </div>
        );
    }
}
