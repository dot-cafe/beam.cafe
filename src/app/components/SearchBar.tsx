import {FunctionalComponent, h} from 'preact';
import {cn}                     from '../../utils/preact-utils';
import styles                   from './SearchBar.module.scss';

type Props = {
    value: string | null;
    onUpdate: (str: string | null) => void;
};

export const SearchBar: FunctionalComponent<Props> = ({onUpdate, value}) => (
    <div className={cn(styles.searchBar, {
        [styles.empty]: !value
    })}>
        <bc-icon name="search"/>
        <input type="text"
               placeholder="Search files..."
               onChange={(e) => onUpdate((e.target as HTMLInputElement).value)} value={value || ''}/>
        <button onClick={onUpdate.bind(null, null)}>
            <bc-icon name="delete"/>
        </button>
    </div>
);
