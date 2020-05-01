import {Component, createRef, h} from 'preact';
import {JSXInternal}             from 'preact/src/jsx';
import {bind, cn}                from '../../utils/preact-utils';
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
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    render() {
        const {header, content, position} = this.props;
        const {collapsed} = this.state;
        const contentEl = <div className={styles.list}
                               ref={this.list}>{content}</div>;

        return (
            <div className={cn(styles.collapsibleList, {
                [styles.collapsed]: collapsed
            })}>
                {position === 'top' ? contentEl : ''}

                <header onClick={this.toggleRetract}>
                    {header(!collapsed)}
                </header>

                {position === 'bottom' ? contentEl : ''}
            </div>
        );
    }
}
