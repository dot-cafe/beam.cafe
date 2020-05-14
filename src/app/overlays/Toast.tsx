import {Component, h} from 'preact';
import {singleton}    from '../../utils/preact-singleton';
import {cn}           from '../../utils/preact-utils';
import styles         from './Toast.module.scss';

export type ToastItem = {
    text: string;
    type?: 'success' | 'warning' | 'error';
    body?: string;
};

type Props = {};
type State = {
    visible: boolean;
    item: ToastItem;
};

export const Toast = singleton(class extends Component<Props, State> {
    readonly state = {
        visible: false,
        item: {text: '', type: 'success'} as ToastItem
    };

    private hideTimeout: number | null = null;
    private locked = false;

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
        this.setState({
            visible: false
        });
    }

    private setItem(item: ToastItem): void {
        this.setState({
            visible: true,
            item
        });

        this.hideTimeout = setTimeout(() => {
            this.hide();
        }, 2000) as unknown as number;
    }

    render() {
        const {item, visible} = this.state;

        return (
            <div className={cn(styles.toast, {
                [styles.show]: visible
            })}>
                <div data-state={item.type || 'success'}>
                    <h3>{item.text}</h3>
                    {item.body ? <p>{item.body}</p> : ''}
                </div>
            </div>
        );
    }
});
