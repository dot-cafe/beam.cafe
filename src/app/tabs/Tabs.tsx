import {observer}     from 'mobx-react';
import {Component, h} from 'preact';
import {JSXInternal}  from 'preact/src/jsx';
import {bind, cn}     from '../../utils/preact-utils';
import {FileList}     from './filelist/Uploads';
import styles         from './Tabs.module.scss';
import {Uploads}      from './uploads/Uploads';

type Tab = 'file-list' | 'uploads';
type Props = {};
type State = {
    activeTab: Tab;
};

@observer
export class Tabs extends Component<Props, State> {

    readonly state = {
        activeTab: 'file-list'
    };
    /* eslint-disable  react/jsx-key */
    private readonly tabs = [
        ['Files', 'file-list', <FileList/>],
        ['Uploads', 'uploads', <Uploads/>]
    ] as Array<[string, Tab, JSXInternal.Element]>;

    @bind
    changeTab(tab: Tab) {
        return () => {
            this.setState({
                activeTab: tab
            });
        };
    }

    render() {
        const {activeTab} = this.state;

        const headerButtons = this.tabs.map(([name, id]) => (
            <button
                key={id}
                onClick={this.changeTab(id)}
                className={cn({
                    [styles.activeButton]: activeTab === id
                })}>
                <span>{name}</span>
            </button>
        ));

        const tabContainers = this.tabs.map(([, id, tab]) => (
            <div key={id}
                 className={cn({
                     [styles.activeTab]: id === activeTab
                 })}>
                {tab}
            </div>
        ));

        return (
            <div className={styles.tabs}>
                <div className={styles.header}>
                    {headerButtons}
                </div>

                <div className={styles.wrapper}>
                    {tabContainers}
                </div>
            </div>
        );
    }
}
