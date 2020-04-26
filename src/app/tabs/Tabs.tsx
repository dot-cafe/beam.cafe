import {observer}       from 'mobx-react';
import {Component, h}   from 'preact';
import {JSXInternal}    from 'preact/src/jsx';
import {files, uploads} from '../../state';
import {on}             from '../../utils/events';
import {bind, cn}       from '../../utils/preact-utils';
import Icon             from '../components/Icon';
import {FileList}       from './filelist/FileList';
import styles           from './Tabs.module.scss';
import {ThemeSwitcher}  from './ThemeSwitcher';
import {Uploads}        from './uploads/Uploads';

type TabList = Array<{
    title: string;
    component: JSXInternal.Element;
}>;

type Props = {};
type State = {
    updateAvailable: boolean;
    tabIndex: number;
};

@observer
export class Tabs extends Component<Props, State> {

    readonly state = {
        updateAvailable: false,
        tabIndex: 0
    };

    componentDidMount(): void {

        // The tab-key can be used to switch between tabs
        on(window, 'keydown', (e: KeyboardEvent) => {
            if (e.key === 'Tab' && e.shiftKey) {
                const idx = this.state.tabIndex;

                this.setState({
                    tabIndex: (idx + 1) === this.tabs.length ? 0 : idx + 1
                });

                e.preventDefault();
            }
        });

        // Check if update is available
        navigator.serviceWorker.getRegistrations().then(regs => {
            for (const reg of regs) {
                reg.addEventListener('updatefound', () => {
                    this.setState({
                        updateAvailable: true
                    });
                });
            }
        }).catch(() => null);
    }

    @bind
    changeTab(index: number) {
        return () => {
            this.setState({
                tabIndex: index
            });
        };
    }

    @bind
    installUpdate(): void {
        location.reload();
    }

    get tabs(): TabList {
        const {listedFiles} = files;
        const {listedUploads} = uploads;

        return [
            {
                title: listedFiles.length ? `Files (${listedFiles.length})` : 'Files',
                component: <FileList/>
            },
            {
                title: listedUploads.length ? `Uploads (${listedUploads.length})` : 'Uploads',
                component: <Uploads/>
            }
        ];
    }

    render() {
        const {tabIndex, updateAvailable} = this.state;
        const headerButtons = [];
        const tabContainers = [];

        for (let i = 0; i < this.tabs.length; i++) {
            const {title, component} = this.tabs[i];
            const activeClass = cn({
                [styles.active]: i === tabIndex
            });

            headerButtons.push(
                <button key={i}
                        onClick={this.changeTab(i)}
                        className={activeClass}>
                    <span>{title}</span>
                </button>
            );

            tabContainers.push(
                <div key={i} className={activeClass}>
                    {component}
                </div>
            );
        }

        return (
            <div className={styles.tabs}>
                <div className={styles.header}>
                    <div className={styles.tabButtons}>
                        {headerButtons}
                    </div>

                    {updateAvailable ? (
                        <button className={styles.updateBtn}
                                onClick={this.installUpdate}>
                            <Icon name="updates"/>
                        </button>
                    ) : ''}

                    <ThemeSwitcher/>
                </div>

                <div className={styles.wrapper}>
                    {tabContainers}
                </div>
            </div>
        );
    }
}
