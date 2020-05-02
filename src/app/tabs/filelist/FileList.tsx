import {observer}        from 'mobx-react';
import {Component, h}    from 'preact';
import {files, SortKeys} from '../../../state';
import {bind}            from '../../../utils/preact-utils';
import {DropZone}        from './DropZone';
import {FileItem}        from './FileItem';
import styles            from './FileList.module.scss';

@observer
export class FileList extends Component {

    @bind
    chooseFiles(): void {
        files.openDialog();
    }

    @bind
    sortBy(key: SortKeys) {
        return () => files.sortElements(key);
    }

    render() {
        const {listedFiles} = files;
        const indexPadding = Math.max(String(listedFiles.length).length, 2);

        return (
            <div className={styles.fileList}>
                <DropZone/>

                <div className={styles.header}>
                    <p onClick={this.sortBy('index')}>#</p>
                    <p onClick={this.sortBy('name')}>Filename</p>
                    <p onClick={this.sortBy('size')} className={styles.alignRight}>File Size</p>
                    <p className={styles.alignCenter}>Action</p>
                </div>

                <div className={styles.list}>
                    {listedFiles.map((value) =>
                        <FileItem key={value.index}
                                  item={value}
                                  label={String(value.index + 1).padStart(indexPadding, '0')}/>
                    )}
                </div>

                <button onClick={this.chooseFiles}>
                    <bc-icon name="plus"/>
                    <span>Add Files</span>
                </button>
            </div>
        );
    }
}
