import {Component, h} from 'preact';
import {JSXInternal}  from 'preact/src/jsx';
import {cn}           from '../../utils/preact-utils';
import styles         from './ContextMenu.module.scss';
import {Popper}       from './Popper';

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

type State = {
    open: boolean;
};

export class ContextMenu extends Component<Props, State> {
    action(id: string) {
        return () => this.props.onAction(id);
    }

    render() {
        const {
            button,
            content,
            className = ''
        } = this.props;

        return (
            <Popper className={cn(styles.contextMenu, className, {
                [styles.open]: this.state.open
            })} button={button} content={
                <div className={styles.buttonList}>{
                    content.map((value, index) => (
                        <button key={index} onClick={this.action(value.id)}>
                            {value.icon ? <bc-icon name={value.icon}/> : ''}
                            <span>{value.text}</span>
                        </button>
                    ))
                }</div>
            }/>
        );
    }
}
