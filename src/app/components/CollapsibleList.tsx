import {Component, createRef, h} from 'preact';
import {JSXInternal}             from 'preact/src/jsx';
import {bind, cn}                from '../../utils/preact-utils';
import styles                    from './CollapsibleList.module.scss';
import Icon                      from './Icon';

type Props = {
    header: Array<JSXInternal.Element>;
    sections: Array<JSXInternal.Element>;
};

type State = {
    collapsed: boolean;
};

export class CollapsibleList extends Component<Props, State> {
    private readonly list = createRef<HTMLDivElement>();
    readonly state = {
        collapsed: false
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
        const {header, sections} = this.props;
        const {collapsed} = this.state;

        return (
            <div className={cn(styles.collapsibleList, {
                [styles.collapsed]: collapsed
            })}>
                <header onClick={this.toggleRetract}>
                    <div className={styles.customHeader}>{header}</div>
                    <button>
                        <Icon name="expand-arrow"/>
                    </button>
                </header>

                <div className={styles.list}
                     ref={this.list}>
                    {sections}
                </div>
            </div>
        );
    }
}
