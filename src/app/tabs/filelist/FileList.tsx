import {observer}     from 'mobx-react';
import {Component, h} from 'preact';
import {files}        from '../../../state';
import {bind}         from '../../../utils/preact-utils';
import Icon           from '../../components/Icon';
import {DropZone}     from './DropZone';
import {FileItem}     from './FileItem';
import styles         from './FileList.module.scss';

@observer
export class FileList extends Component {

    @bind
    chooseFiles(): void {
        files.openDialog();
    }

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

                <button onClick={this.chooseFiles}>
                    <Icon name="plus"/>
                    <span>Add Files</span>
                </button>
            </div>
        );
    }
}
