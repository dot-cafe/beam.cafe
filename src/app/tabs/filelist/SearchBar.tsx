import {createNativeEventContainer}        from '@utils/events';
import {cn}                                from '@utils/preact-utils';
import {createRef, FunctionalComponent, h} from 'preact';
import {useEffect}                         from 'preact/hooks';
import styles                              from './SearchBar.module.scss';

type Props = {
    value: string | null;
    onUpdate: (str: string | null) => void;
};

export const SearchBar: FunctionalComponent<Props> = ({onUpdate, value}) => {
    const events = createNativeEventContainer();
    const ref = createRef();

    useEffect(() => {
        events.on(window, 'keydown', (e: KeyboardEvent) => {
            if (e.code === 'KeyF' && (e.metaKey || e.ctrlKey)) {
                ref.current?.focus();
                e.preventDefault();
            }
        });

        return () => events.unbind();
    });

    return (
        <div className={cn(styles.searchBar, {
            [styles.empty]: !value
        })}>
            <bc-icon name="search"/>
            <input type="text"
                   role="search"
                   aria-label="Search files"
                   placeholder="Search files..."
                   ref={ref}
                   onChange={e => onUpdate((e.target as HTMLInputElement).value)} value={value || ''}/>
            <button onClick={onUpdate.bind(null, null)}
                    aria-label="Clear search field">
                <bc-icon name="delete"/>
            </button>
        </div>
    );
};
