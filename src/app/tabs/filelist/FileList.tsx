import {files}                      from '@state/index';
import {ListedFile}                 from '@state/models/ListedFile';
import {createNativeEventContainer} from '@utils/events';
import {fuzzyStringSimilarity}      from '@utils/fuzzy-string-similarity';
import {bind}                       from '@utils/preact-utils';
import {observer}                   from 'mobx-react';
import {Component, h}               from 'preact';
import {isMobile}                   from '../../browserenv';
import {ActionBar}                  from './ActionBar';
import {DropZone}                   from './DropZone';
import {FileItem}                   from './FileItem';
import styles                       from './FileList.module.scss';
import {SearchBar}                  from './SearchBar';

export type SortKey = 'index' | 'name' | 'size';

type Props = unknown;
type State = {
    searchTerm: null | string;
    sortKey: SortKey;
    toggleSortKey: boolean;
};

@observer
export class FileList extends Component<Props, State> {
    private readonly events = createNativeEventContainer();

    readonly state = {
        searchTerm: null,
        sortKey: 'index' as SortKey,
        toggleSortKey: false
    };

    componentDidMount() {
        this.events.on(window, 'keydown', (e: KeyboardEvent): void => {
            switch (e.code) {
                case 'KeyA': {
                    if (e.ctrlKey || e.metaKey) {
                        files.select(...files.listedFiles);
                    }

                    break;
                }
                case 'ArrowUp':
                case 'ArrowDown': {
                    const {sortedElements} = this;
                    const dir = e.code === 'ArrowUp' ? -1 : 1;

                    // Resolve last-selected file
                    const last = this.sortedElements
                        .findIndex(f => files.isSelected(f)) + dir;

                    files.clearSelection();
                    files.select(
                        dir === 1 ?
                            sortedElements[last >= sortedElements.length ? 0 : last] :
                            sortedElements[last < 0 ? sortedElements.length - 1 : last]
                    );
                    break;
                }
            }
        });
    }

    componentWillUnmount() {
        this.events.unbind();
    }

    get sortedElements() {
        const {searchTerm, sortKey, toggleSortKey} = this.state as State;
        const sortedList = [...files.listedFiles];

        if (searchTerm) {

            // Sort files and cache similarities
            const matches: Map<string, number> = new Map();
            sortedList.sort((a, b) => {
                const an = a.name;
                const bn = b.name;

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
        } else {
            sortedList.sort((a, b) => {
                if (toggleSortKey) {
                    [a, b] = [b, a];
                }

                switch (sortKey) {
                    case 'index':
                        return a.index > b.index ? 1 : -1;
                    case 'name':
                        return a.name.localeCompare(b.name);
                    case 'size':
                        return a.size > b.size ? 1 : -1;
                }
            });
        }

        return sortedList;
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
    updateSearchTerm(searchTerm: string | null) {
        this.setState({searchTerm});
    }

    @bind
    selectItem(item: ListedFile, ev: MouseEvent) {
        files.selectViaMouseEvent(ev, item, this.sortedElements);
    }

    render() {
        const {searchTerm} = this.state as State;
        const {listedFiles} = files;
        const indexPadding = Math.max(String(listedFiles.length).length, 2);

        // TODO: Infinity scrolling? It gets really slow with ~200 items
        return (
            <div className={styles.fileList}>
                <DropZone/>
                <SearchBar onUpdate={this.updateSearchTerm}
                           value={searchTerm}/>

                <div className={styles.header}>
                    {!isMobile && <p className={styles.checkboxPlaceholder}/>}

                    <p className={styles.alignCenter}>
                        <span onClick={this.sortBy('index')}>
                            <bc-tooltip content="Sort by Index"/>#
                        </span>
                    </p>

                    <p>
                        <span onClick={this.sortBy('name')}>
                            <bc-tooltip content="Sort by Filename"/>Filename
                        </span>
                    </p>

                    <p className={styles.alignRight}>
                        <span onClick={this.sortBy('size')}>
                            <bc-tooltip content="Sort by File Size"/>File Size
                        </span>
                    </p>

                    {isMobile ? (
                        <p className={styles.alignCenter}/>
                    ) : (
                        <p className={styles.alignCenter}>Actions</p>
                    )}
                </div>

                <div className={styles.list}
                     role="list"
                     aria-label="List of added files">
                    {this.sortedElements.map(item =>
                        <FileItem key={item.index}
                                  item={item}
                                  selected={files.isSelected(item)}
                                  onSelect={this.selectItem}
                                  label={String(item.index + 1).padStart(indexPadding, '0')}/>
                    )}
                </div>

                <ActionBar/>
            </div>
        );
    }
}
