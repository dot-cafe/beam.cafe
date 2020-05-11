import {Component, h} from 'preact';
import {singleton}    from '../../utils/preact-singleton';
import {cn}           from '../../utils/preact-utils';
import styles         from './Toast.module.scss';

export type ToastItem = {
    type: 'success' | 'warning' | 'error';
    text: string;
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

    public set(item: ToastItem): void {
        if (this.hideTimeout !== null) {
            clearTimeout(this.hideTimeout);
        }

        if (!this.state.item) {
            this.setItem(item);
        } else if (!this.locked) {
            this.locked = true;

            this.hide();
            setTimeout(() => {
                this.setItem(item);
                this.locked = false;
            }, 300);
        }
    }

    render() {
        const {item, visible} = this.state;

        return (
            <div className={cn(styles.toast, {
                [styles.show]: visible
            })} data-state={item.type}>
                <p>{item.text}</p>
            </div>
        );
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
});
