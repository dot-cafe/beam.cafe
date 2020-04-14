import {observer}       from 'mobx-react';
import {Component, h}   from 'preact';
import {JSXInternal}    from 'preact/src/jsx';
import {files, uploads} from '../../state';
import {bind, cn}       from '../../utils/preact-utils';
import {FileList}       from './filelist/FileList';
import styles           from './Tabs.module.scss';
import {Uploads}        from './uploads/Uploads';

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

    @bind
    changeTab(tab: Tab) {
        return () => {
            this.setState({
                activeTab: tab
            });
        };
    }

    render() {
        const {listedFiles} = files;
        const {listedUploads} = uploads;
        const {activeTab} = this.state;

        /* eslint-disable  react/jsx-key */
        const tabs = [
            [listedFiles.length ? `Files (${listedFiles.length})` : 'Files', 'file-list', <FileList/>],
            [listedUploads.length ? `Uploads (${listedUploads.length})` : 'Uploads', 'uploads', <Uploads/>]
        ] as Array<[string, Tab, JSXInternal.Element]>;

        const headerButtons = tabs.map(([name, id]) => (
            <button key={id}
                    onClick={this.changeTab(id)}
                    className={cn({
                        [styles.activeButton]: activeTab === id
                    })}>
                <span>{name}</span>
            </button>
        ));

        const tabContainers = tabs.map(([, id, tab]) => (
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
