import {observer}       from 'mobx-react';
import {Component, h}   from 'preact';
import {JSXInternal}    from 'preact/src/jsx';
import {files, uploads} from '../../state';
import {rotateValues}   from '../../utils/array';
import {on}             from '../../utils/events';
import {bind, cn}       from '../../utils/preact-utils';
import {FileList}       from './filelist/FileList';
import styles           from './Tabs.module.scss';
import {ThemeSwitcher}  from './ThemeSwitcher';
import {Uploads}        from './uploads/Uploads';

type Tab = 'file-list' | 'uploads';
type Props = {};
type State = {
    activeTab: Tab;
};

@observer
export class Tabs extends Component<Props, State> {
    private static readonly tabs = ['file-list', 'uploads'];

    readonly state = {
        activeTab: 'file-list' as Tab
    };

    componentDidMount(): void {
        on(window, 'keyup', (e: KeyboardEvent) => {
            if (e.key === 'Tab') {
                this.setState({
                    activeTab: rotateValues(Tabs.tabs, this.state.activeTab) as Tab
                });
            }
        });
    }

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

        /* eslint-disable react/jsx-key */
        const tabs: Array<[string, Tab, JSXInternal.Element]> = [
            [
                listedFiles.length ? `Files (${listedFiles.length})` : 'Files',
                'file-list',
                <FileList/>
            ],
            [
                listedUploads.length ? `Uploads (${listedUploads.length})` : 'Uploads',
                'uploads',
                <Uploads/>
            ]
        ];

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
                    <div className={styles.tabButtons}>
                        {headerButtons}
                    </div>
                    <ThemeSwitcher/>
                </div>

                <div className={styles.wrapper}>
                    {tabContainers}
                </div>
            </div>
        );
    }
}
