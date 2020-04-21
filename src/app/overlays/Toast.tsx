import {Component, createRef, h} from 'preact';
import {JSXInternal}             from 'preact/src/jsx';
import {cn}                      from '../../utils/preact-utils';
import styles                    from './Toast.module.scss';

export type ToastItem = {
    type: 'success' | 'warning' | 'error';
    text: string;
};

type Props = {};
type State = {
    visible: boolean;
    item: ToastItem;
};

export class Toast extends Component<Props, State> {
    private static instance: Toast;
    private static element: JSXInternal.Element;
    private hideTimeout: number | null = null;

    readonly state = {
        visible: false,
        item: {text: '', type: 'success'} as ToastItem
    };

    // It symbolizes a singleton
    private locked = false;

    /* eslint-disable no-useless-constructor */
    private constructor() {
        super();
    }

    public static getInstance() {
        Toast.createInstance();
        return Toast.instance;
    }

    public static getElement(): JSXInternal.Element {
        Toast.createInstance();
        return Toast.element;
    }

    private static createInstance(): void {

        /**
         * Yeah I know this is a really, really weird way of implementing
         * a singleton in React. I'm aware of this being not the best solution
         * but it works perfectly and I want to keep it as it is.
         *
         * Whoever reads this, have a wonderful day!
         */
        if (!Toast.instance) {
            const ref = createRef();

            Toast.element = <Toast ref={ref}/>;
            requestAnimationFrame(() => {
                Toast.instance = ref.current;
            });
        }
    }

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
}
