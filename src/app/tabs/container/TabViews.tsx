import {FunctionalComponent, h} from 'preact';
import {JSXInternal}            from 'preact/src/jsx';
import {cn}                     from '../../../utils/preact-utils';
import styles                   from './TabViews.module.scss';

type Props = {
    views: Array<JSXInternal.Element>;
    activeView: number;
};

export const TabViews: FunctionalComponent<Props> = (
    {views, activeView}
) => (
    <div className={styles.tabViews}
         data-tab-index={activeView}>
        <div>
            {views.map((com, i) => (
                <div className={cn(styles.view, {
                    [styles.active]: i === activeView
                })} key={i}>{com}</div>
            ))}
        </div>
    </div>
);
