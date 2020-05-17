import {Component, createRef, h} from 'preact';
import {JSXInternal}             from 'preact/src/jsx';
import {bind}                    from '@utils/preact-utils';
import styles                    from './CollapsibleList.module.scss';

type Props = {
    position?: 'top' | 'bottom';
    header: (open: boolean) => JSXInternal.Element;
    content: JSXInternal.Element;
};

type State = {
    collapsed: boolean;
};

export class CollapsibleList extends Component<Props, State> {
    private readonly list = createRef<HTMLDivElement>();

    public static defaultProps = {
        position: 'top'
    };

    readonly state = {
        collapsed: true
    };

    componentDidMount(): void {
        this.updateListHeight();
    }

    componentDidUpdate(): void {
        this.updateListHeight();
    }

    updateListHeight() {
        const list = this.list.current;

        if (list) {
            const height = list.offsetHeight;

            if (height > 0) {
                list.style.setProperty('--height', `${height}px`);
            }
        }
    }

    @bind
    toggleRetract() {
        const {collapsed} = this.state;
        const list = this.list.current;

        if (!list) {
            return;
        }

        if (collapsed) {

            // Make list invisible and get current height
            list.style.visibility = 'hidden';
            list.style.maxHeight = 'unset';
            const height = `${list.offsetHeight}px`;

            // Reset and make visible
            list.style.maxHeight = '0px';
            list.style.visibility = 'visible';

            // Set actual height to animate it
            requestAnimationFrame(() => {
                list.style.maxHeight = height;
            });
        } else {
            list.style.maxHeight = '0px';
        }

        this.setState({
            collapsed: !collapsed
        });
    }

    render() {
        const {header, content, position} = this.props;
        const {collapsed} = this.state;
        const contentEl = <div className={styles.list}
                               ref={this.list}>{content}</div>;

        return (
            <div className={styles.collapsibleList}>
                {position === 'top' ? contentEl : ''}

                <header onClick={this.toggleRetract}>
                    {header(!collapsed)}
                </header>

                {position === 'bottom' ? contentEl : ''}
            </div>
        );
    }
}
