import {Component, h} from 'preact';
import {JSXInternal}  from 'preact/src/jsx';
import {cn}           from '../../utils/preact-utils';
import styles         from './TabViews.module.scss';

type Props = {
    views: Array<JSXInternal.Element>;
    activeView: number;
};

type State = {};

export class TabViews extends Component<Props, State> {

    render() {
        const {views, activeView} = this.props;

        return (
            <div className={styles.tabViews}>
                {views.map((com, i) => (
                    <div className={cn(styles.view, {
                        [styles.active]: i === activeView
                    })} key={i}>{com}</div>
                ))}
            </div>
        );
    }
}
