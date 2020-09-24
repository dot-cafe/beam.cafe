import {singleton}               from '@utils/preact-singleton';
import {bind, cn}                from '@utils/preact-utils';
import {uid}                     from '@utils/uid';
import {Component, createRef, h} from 'preact';
import styles                    from './Toast.module.scss';

export type ToastItem = {
    text: string;
    type?: 'success' | 'warning' | 'error';
    body?: string;
};

type Props = unknown;
type State = {
    visible: boolean;
    item: ToastItem;
};

class ToastSingleton extends Component<Props, State> {
    private static readonly TIMEOUT = 2500;
    private readonly timeoutBar = createRef<HTMLDivElement>();
    private readonly toastEl = createRef<HTMLDivElement>();
    private hideTimeout: number | null = null;
    private locked = false;

    readonly state = {
        visible: false,
        item: {text: '', type: 'success'} as ToastItem
    };

    public show(item: ToastItem | string): void {
        if (this.hideTimeout !== null) {
            clearTimeout(this.hideTimeout);
        }

        if (typeof item === 'string') {
            item = {text: item};
        }

        if (!this.state.item) {
            this.setItem(item);
        } else if (!this.locked) {
            this.locked = true;

            this.hide();
            setTimeout(() => {
                this.setItem(item as ToastItem);
                this.locked = false;
            }, 300);
        }
    }

    private hide(): void {
        this.timeoutBar.current?.classList.remove(styles.timeout);
        this.setState({
            visible: false
        });
    }

    private setItem(item: ToastItem): void {
        this.timeoutBar.current?.classList.add(styles.timeout);

        this.setState({
            visible: true,
            item
        });

        this.hideTimeout = setTimeout(() => {
            this.hide();
        }, ToastSingleton.TIMEOUT) as unknown as number;
    }

    @bind
    private lockTimer(): void {
        this.timeoutBar.current?.classList.remove(styles.timeout);

        if (this.hideTimeout !== null) {
            clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
        }
    }

    @bind
    private unlockTimer(): void {
        this.timeoutBar.current?.classList.add(styles.timeout);

        if (this.hideTimeout === null) {
            this.hideTimeout = setTimeout(() => {
                this.hide();
            }, ToastSingleton.TIMEOUT) as unknown as number;
        }
    }

    render() {
        const {item, visible} = this.state;
        const describedby = uid('aria');
        const labelledby = uid('aria');
        const icon = item.type === 'warning' ? 'exclamation-mark' :
            item.type === 'error' ? 'error' :
                item.type === 'success' ? 'checkmark' : null;

        return (
            <div role={visible ? 'alert' : undefined}
                 aria-labelledby={visible ? labelledby : undefined}
                 aria-describedby={visible ? describedby : undefined}
                 className={cn(styles.toast, {
                     [styles.show]: visible
                 })}>

                <div data-state={item.type || 'success'}
                     onMouseEnter={this.lockTimer}
                     onMouseLeave={this.unlockTimer}
                     ref={this.toastEl}>
                    <div ref={this.timeoutBar} style={`--timeout: ${ToastSingleton.TIMEOUT}ms`}/>

                    {icon && <bc-icon name={icon}/>}

                    <article>
                        <h3 id={labelledby}>{item.text}</h3>
                        {item.body ? <p id={describedby}>{item.body}</p> : ''}
                    </article>
                </div>
            </div>
        );
    }
}

export const Toast = singleton(ToastSingleton);
