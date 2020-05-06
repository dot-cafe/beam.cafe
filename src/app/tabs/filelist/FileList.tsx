import {observer}         from 'mobx-react';
import {Component, h}     from 'preact';
import {files, SortKeys}  from '../../../state';
import {bind}             from '../../../utils/preact-utils';
import {stringSimilarity} from '../../../utils/string-similarity';
import {SearchBar}        from '../../components/SearchBar';
import {DropZone}         from './DropZone';
import {FileItem}         from './FileItem';
import styles             from './FileList.module.scss';

type Props = {};
type State = {
    searchTerm: null | string;
};

@observer
export class FileList extends Component<Props, State> {
    readonly state = {
        searchTerm: null
    };

    @bind
    chooseFiles(): void {
        files.openDialog();
    }

    @bind
    sortBy(key: SortKeys) {
        return () => files.sortElements(key);
    }

    @bind
    updateSearchTerm(e: string | null) {
        this.setState({
            searchTerm: e
        });
    }

    render() {
        const {searchTerm} = this.state;
        const {listedFiles} = files;
        const indexPadding = Math.max(String(listedFiles.length).length, 2);
        const sourceList = [...listedFiles];

        if (searchTerm) {
            sourceList.sort((a, b) => {
                const sa = stringSimilarity(a.file.name, searchTerm, true);
                const sb = stringSimilarity(b.file.name, searchTerm, true);
                return sb - sa;
            });
        }

        return (
            <div className={styles.fileList}>
                <DropZone/>
                <SearchBar onUpdate={this.updateSearchTerm}
                           value={searchTerm}/>

                <div className={styles.header}>
                    <p onClick={this.sortBy('index')}>#</p>
                    <p onClick={this.sortBy('name')}>Filename</p>
                    <p onClick={this.sortBy('size')} className={styles.alignRight}>File Size</p>
                    <p className={styles.alignCenter}>Action</p>
                </div>

                <div className={styles.list}>
                    {sourceList.map((value) =>
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
