import {FunctionalComponent, h} from 'preact';
import {JSXInternal}            from 'preact/src/jsx';
import {cn}                     from '@utils/preact-utils';
import styles                   from './ContextMenu.module.scss';
import {Popper}                 from './Popper';

export type ContextMenuButtons = Array<{
    id: string;
    text: string;
    icon?: string;
}>;

type Props = {
    className?: string;
    onAction: (id: string) => void;
    content: ContextMenuButtons;
    button: JSXInternal.Element;
};

export const ContextMenu: FunctionalComponent<Props> = (
    {
        button,
        content,
        onAction,
        className = ''
    }
) => (
    <Popper className={cn(styles.contextMenu, className)}
            button={button}
            content={
                <div className={styles.buttonList}>{
                    content.map((value, index) => (
                        <button key={index}
                                onClick={() => onAction(value.id)}
                                aria-label={`Context menu: ${value.text}`}>
                            {value.icon ? <bc-icon name={value.icon}/> : ''}
                            <span>{value.text}</span>
                        </button>
                    ))
                }</div>
            }/>
);
