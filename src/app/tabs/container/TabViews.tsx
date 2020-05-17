import {Component, h}      from 'preact';
import {JSXInternal}       from 'preact/src/jsx';
import {cn}                from '@utils/preact-utils';
import {Swipe, SwipeEvent} from '@utils/Swipe';
import {isMobile}          from '../../browserenv';
import styles              from './TabViews.module.scss';

type Props = {
    views: Array<JSXInternal.Element>;
    activeView: number;
    changeView: (newView: number) => void;
};

type State = {
    transform: number;
};

export class TabViews extends Component<Props, State> {
    private readonly swipe: Swipe | null = null;

    readonly state = {
        transform: 0
    };

    constructor() {
        super();

        if (isMobile) {
            const swipe = this.swipe = new Swipe();

            swipe.on('swipe', (e: SwipeEvent) => {
                this.setState({
                    transform: e.amount + this.props.activeView * -100
                });
            });

            swipe.on('snap', (e: SwipeEvent) => {
                const {activeView, views, changeView} = this.props;

                if (e.dir === 'left' && activeView < views.length - 1) {
                    changeView(activeView + 1);
                } else if (e.dir === 'right' && activeView > 0) {
                    changeView(activeView - 1);
                } else {
                    this.setState({
                        transform: this.props.activeView * 100
                    });
                }
            });

            swipe.on('cancel', () => {
                this.setState({
                    transform: this.props.activeView * 100
                });
            });
        }
    }

    render() {
        const {views, activeView} = this.props;
        const {transform} = this.state;

        const dragging = this.swipe?.dragging;
        const tx = this.swipe ? dragging ? transform : activeView * -100 : 0;

        return (
            <div className={styles.tabViews}
                 data-tab-index={activeView}>
                <div style={{
                    transition: dragging ? 'none' : 'all 0.3s',
                    transform: `translateX(${tx}%)`
                }}>
                    {views.map((com, i) => (
                        <div className={cn(styles.view, {
                            [styles.active]: i === activeView
                        })} key={i}>{com}</div>
                    ))}
                </div>
            </div>
        );
    }
}
