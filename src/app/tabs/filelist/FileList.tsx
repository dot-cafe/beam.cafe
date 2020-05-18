import {observer}              from 'mobx-react';
import {Component, h}          from 'preact';
import {files}                 from '@state/index';
import {fuzzyStringSimilarity} from '@utils/fuzzy-string-similarity';
import {bind}                  from '@utils/preact-utils';
import {isMobile}              from '../../browserenv';
import {SearchBar}             from '@components/SearchBar';
import {DropZone}              from './DropZone';
import {FileItem}              from './FileItem';
import styles                  from './FileList.module.scss';

export type SortKey = 'index' | 'name' | 'size';

type State = {
    searchTerm: null | string;
    sortKey: SortKey;
    toggleSortKey: boolean;
};

@observer
export class FileList extends Component<{}, State> {
    readonly state = {
        searchTerm: null,
        sortKey: 'index' as SortKey,
        toggleSortKey: false
    };

    @bind
    chooseFiles(): void {
        files.openDialog();
    }

    @bind
    sortBy(key: SortKey) {
        return () => {
            const {sortKey, toggleSortKey} = this.state;

            this.setState({
                toggleSortKey: sortKey === key ? !toggleSortKey : toggleSortKey,
                sortKey: key
            });
        };
    }

    @bind
    updateSearchTerm(e: string | null) {
        this.setState({
            searchTerm: e
        });
    }

    render() {
        const {searchTerm, sortKey, toggleSortKey} = this.state as State;
        const {listedFiles} = files;
        const indexPadding = Math.max(String(listedFiles.length).length, 2);

        const sourceList = [...listedFiles].sort((a, b) => {
            if (toggleSortKey) {
                [a, b] = [b, a];
            }

            switch (sortKey) {
                case 'index':
                    return a.index > b.index ? 1 : -1;
                case 'name':
                    return a.file.name.localeCompare(b.file.name);
                case 'size':
                    return a.file.size > b.file.size ? 1 : -1;
            }
        });

        if (searchTerm) {

            // Sort files and cache similarities
            const matches: Map<string, number> = new Map();
            sourceList.sort((a, b) => {
                const an = a.file.name;
                const bn = b.file.name;

                let sa = matches.get(an);
                if (sa === undefined) {
                    sa = fuzzyStringSimilarity(an, searchTerm);
                    matches.set(an, sa);
                }

                let sb = matches.get(bn);
                if (sb === undefined) {
                    sb = fuzzyStringSimilarity(bn, searchTerm);
                    matches.set(bn, sb);
                }

                return sb - sa;
            });
        }

        return (
            <div className={styles.fileList}>
                <DropZone/>
                <SearchBar onUpdate={this.updateSearchTerm}
                           value={searchTerm}/>

                <div className={styles.header}>
                    <p>
                        <span onClick={this.sortBy('index')}>
                            <bc-tooltip content={'Sort By Index'}/>#
                        </span>
                    </p>

                    <p>
                        <span onClick={this.sortBy('name')}>
                            <bc-tooltip content={'Sort By Filename'}/>Filename
                        </span>
                    </p>

                    <p className={styles.alignRight}>
                        <span onClick={this.sortBy('size')}>
                            <bc-tooltip content={'Sort By File Size'}/>File Size
                        </span>
                    </p>

                    {isMobile ? (
                        <p className={styles.alignCenter}/>
                    ) : (
                        <p className={styles.alignCenter}>Actions</p>
                    )}
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
