import {observer}     from 'mobx-react';
import {Component, h} from 'preact';
import {files}        from '../../../state';
import {DropZone}     from './DropZone';
import {FileItem}     from './FileItem';
import styles         from './FileList.module.scss';

@observer
export class FileList extends Component {
    render() {
        const {listedFiles} = files;
        const indexPadding = Math.max(String(listedFiles.length).length, 2);

        return (
            <div className={styles.fileList}>
                <DropZone/>

                <div className={styles.header}>
                    <p>#</p>
                    <p>Filename</p>
                    <p className={styles.alignRight}>File size</p>
                    <p className={styles.alignRight}>Action</p>
                </div>

                <div className={styles.list}>
                    {listedFiles.map((value, i) =>
                        <FileItem key={i}
                                  item={value}
                                  label={String(i + 1).padStart(indexPadding, '0')}/>
                    )}
                </div>
            </div>
        );
    }
}
