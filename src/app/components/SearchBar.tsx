import {cn}                     from '@utils/preact-utils';
import {FunctionalComponent, h} from 'preact';
import styles                   from './SearchBar.module.scss';

type Props = {
    value: string | null;
    onUpdate: (str: string | null) => void;
};

// TODO: Move to file-list folder
export const SearchBar: FunctionalComponent<Props> = ({onUpdate, value}) => (
    <div className={cn(styles.searchBar, {
        [styles.empty]: !value
    })}>
        <bc-icon name="search"/>
        <input type="text"
               role="search"
               aria-label="Search files"
               placeholder="Search files..."
               onChange={e => onUpdate((e.target as HTMLInputElement).value)} value={value || ''}/>
        <button onClick={onUpdate.bind(null, null)}
                aria-label="Clear search field">
            <bc-icon name="delete"/>
        </button>
    </div>
);
