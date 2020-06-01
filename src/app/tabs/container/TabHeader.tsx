import {pushNotification, settings} from '@state/index';
import {on}                         from '@utils/events';
import {bind, cn}                   from '@utils/preact-utils';
import {Component, h}               from 'preact';
import styles                       from './TabHeader.module.scss';
import {ThemeSwitcher}              from './ThemeSwitcher';

type Props = {
    tabs: Array<string>;
    activeTab: number;
    onChange: (next: number) => void;
};

type State = {
    updateAvailable: boolean;
};

export class TabHeader extends Component<Props, State> {

    readonly state = {
        updateAvailable: false
    };

    componentDidMount(): void {

        // The tab-key can be used to switch between tabs
        on(window, 'keydown', (e: KeyboardEvent) => {
            if (e.key === 'Tab' && e.shiftKey) {
                const {tabs, activeTab, onChange} = this.props;
                onChange((activeTab + 1) === tabs.length ? 0 : activeTab + 1);
                e.preventDefault();
            }
        });

        if (env.NODE_ENV === 'production') {

            // Check if update is available
            navigator.serviceWorker.getRegistrations().then(regs => {
                for (const reg of regs) {
                    reg.addEventListener('updatefound', () => {
                        this.updateAvailable();
                    });
                }
            }).catch(() => null);
        }
    }

    updateAvailable() {
        this.setState({updateAvailable: true});

        // Show notification if set
        if (settings.notifications.onUpdateAvailable) {
            pushNotification({
                title: 'A new version is available!'
            });
        }
    }

    changeTab(index: number) {
        return () => this.props.onChange(index);
    }

    @bind
    installUpdate(): void {
        location.reload();
    }

    render() {
        const {tabs, activeTab} = this.props;
        const {updateAvailable} = this.state;

        return (
            <div className={styles.tabHeader}
                 role="navigation">
                <div className={styles.tabButtons}>
                    {tabs.map((com, i) => (
                        <button key={i}
                                tabIndex={i === activeTab ? -1 : 0}
                                aria-label={`Change tab to ${com}`}
                                onClick={this.changeTab(i)}
                                className={cn({
                                    [styles.active]: i === activeTab
                                })}>
                            <span>{com}</span>
                        </button>
                    ))}
                </div>

                {updateAvailable ? (
                    <button className={styles.updateBtn}
                            onClick={this.installUpdate}
                            aria-label="Install update and restart application.">
                        <bc-icon name="updates"/>
                    </button>
                ) : ''}

                <ThemeSwitcher/>
            </div>
        );
    }
}
