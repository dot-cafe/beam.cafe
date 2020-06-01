import {cn}                                from '@utils/preact-utils';
import {createRef, FunctionalComponent, h} from 'preact';
import {JSXInternal}                       from 'preact/src/jsx';
import styles                              from './ContextMenu.module.scss';
import {Popper}                            from './Popper';

export type ContextMenuButton = {
    id: string;
    text: string;
    icon?: string;
    onClick?: () => void;
};

type Props = {
    className?: string;
    content: Array<ContextMenuButton>;
    button: JSXInternal.Element;
};

export const ContextMenu: FunctionalComponent<Props> = (
    {button, content, className = ''}
) => {
    const popperRef = createRef<Popper>();

    const createClickWrapper = (btn: ContextMenuButton) => () => {
        popperRef.current?.toggle();
        btn.onClick?.();
    };

    return (
        <Popper className={cn(styles.contextMenu, className)}
                ref={popperRef}
                button={button}
                content={
                    <div className={styles.buttonList}>{
                        content.map((value, index) => (
                            <button key={index}
                                    onClick={createClickWrapper(value)}
                                    aria-label={`Context menu: ${value.text}`}>
                                {value.icon ? <bc-icon name={value.icon}/> : ''}
                                <span>{value.text}</span>
                            </button>
                        ))
                    }</div>
                }/>
    );
};
