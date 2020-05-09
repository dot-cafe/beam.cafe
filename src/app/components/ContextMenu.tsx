import {NanoPop}                   from 'nanopop';
import {Component, createRef, h}   from 'preact';
import {JSXInternal}               from 'preact/src/jsx';
import {eventPath}                 from '../../utils/event-path';
import {EventBindingArgs, off, on} from '../../utils/events';
import {bind, cn}                  from '../../utils/preact-utils';
import styles                      from './ContextMenu.module.scss';

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
    private readonly reference = createRef<HTMLButtonElement>();
    private readonly container = createRef<HTMLDivElement>();
    private customListeners: Array<EventBindingArgs> = [];
    private nanoPop: NanoPop | null = null;

    readonly state = {
        open: false
    };

    componentDidMount() {
        const ref = this.reference.current;
        const con = this.container.current;

        if (ref && con) {
            this.nanoPop = new NanoPop(ref, con);
            this.nanoPop.update();

            this.customListeners = [
                on(window, ['resize', 'scroll'], () => {
                    if (this.state.open) {
                        this.nanoPop?.update();
                    }
                }),

                on(window, 'click', (e: MouseEvent) => {
                    const path = eventPath(e);

                    if (this.state.open &&
                        !path.includes(this.reference.current as HTMLElement) &&
                        !path.includes(this.container.current as HTMLElement)) {
                        this.toggle();
                    }
                })
            ];
        }
    }

    componentWillUnmount() {
        this.nanoPop = null;

        for (const args of this.customListeners) {
            off(...args);
        }
    }

    componentDidUpdate() {
        this.nanoPop?.update();
    }

    @bind
    toggle() {
        this.setState({
            open: !this.state.open
        });

        if (!this.state.open) {
            this.nanoPop?.update({
                position: 'bottom-start'
            });
        }
    }

    action(id: string) {
        return () => {
            this.props.onAction(id);
            this.toggle();
        };
    }

    render() {
        const {
            button,
            content,
            className = ''
        } = this.props;

        return (
            <div className={cn(styles.contextMenu, className, {
                [styles.open]: this.state.open
            })}>
                <button ref={this.reference}
                        onClick={this.toggle}>
                    {button}
                </button>

                <div ref={this.container}>{
                    content.map((value, index) => (
                        <button key={index} onClick={this.action(value.id)}>
                            {value.icon ? <bc-icon name={value.icon}/> : ''}
                            <span>{value.text}</span>
                        </button>
                    ))
                }</div>
            </div>
        );
    }
}
