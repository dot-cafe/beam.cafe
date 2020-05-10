import {NanoPop}                   from 'nanopop';
import {Component, createRef, h}   from 'preact';
import {JSXInternal}               from 'preact/src/jsx';
import {eventPath}                 from '../../utils/event-path';
import {EventBindingArgs, off, on} from '../../utils/events';
import {bind, cn}                  from '../../utils/preact-utils';
import styles                      from './Popper.module.scss';

type Props = {
    className?: string;
    style?: string;
    content: JSXInternal.Element;
    button: JSXInternal.Element;
};

type State = {
    open: boolean;
};

export class Popper extends Component<Props, State> {
    private readonly reference = createRef<HTMLButtonElement>();
    private readonly container = createRef<HTMLDivElement>();
    private eventBindings: Array<EventBindingArgs> = [];
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

            this.eventBindings = [
                on(window, ['resize', 'scroll'], () => {
                    if (this.state.open) {
                        this.nanoPop?.update();
                    }
                }),

                on(window, ['mousedown', 'touchstart'], (e: MouseEvent) => {
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

        for (const args of this.eventBindings) {
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
                position: 'bottom-end'
            });
        }
    }

    render() {
        const {button, content, className = '', style} = this.props;

        return (
            <div className={cn(styles.popper, className, {
                [styles.open]: this.state.open
            })} style={style}>
                <button ref={this.reference}
                        onClick={this.toggle}>
                    {button}
                </button>

                <div ref={this.container}>{content}</div>
            </div>
        );
    }
}
