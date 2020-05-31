import {cn}                     from '@utils/preact-utils';
import {FunctionalComponent, h} from 'preact';
import {JSXInternal}            from 'preact/src/jsx';
import styles                   from './ContextMenu.module.scss';
import {Popper}                 from './Popper';

export type ContextMenuButtons = Array<{
    id: string;
    text: string;
    icon?: string;
    onClick?: () => void;
}>;

type Props = {
    className?: string;
    content: ContextMenuButtons;
    button: JSXInternal.Element;
};

// TODO: Close on click?
export const ContextMenu: FunctionalComponent<Props> = (
    {
        button,
        content,
        className = ''
    }
) => (
    <Popper className={cn(styles.contextMenu, className)}
            button={button}
            content={
                <div className={styles.buttonList}>{
                    content.map((value, index) => (
                        <button key={index}
                                onClick={() => value.onClick?.()}
                                aria-label={`Context menu: ${value.text}`}>
                            {value.icon ? <bc-icon name={value.icon}/> : ''}
                            <span>{value.text}</span>
                        </button>
                    ))
                }</div>
            }/>
);
