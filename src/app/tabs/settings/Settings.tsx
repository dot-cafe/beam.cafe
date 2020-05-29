import {CollapsibleList}                   from '@components/CollapsibleList';
import {cn}                                from '@utils/preact-utils';
import {createRef, FunctionalComponent, h} from 'preact';
import {useState}                          from 'preact/hooks';
import {JSXInternal}                       from 'preact/src/jsx';
import {About}                             from './sections/About';
import {Appearance}                        from './sections/Appearance';
import {DangerZone}                        from './sections/DangerZone';
import {Notifications}                     from './sections/Notifications';
import {Security}                          from './sections/Security';
import styles                              from './Settings.module.scss';

type Tabs = Array<{
    name: string;
    icon: string;
    com: JSXInternal.Element;
    type?: 'normal' | 'warning' | 'danger';
    separator?: boolean;
}>;

const tabs: Tabs = [
    {
        name: 'Appearance',
        icon: 'palette',
        com: <Appearance/>
    },
    {
        name: 'Security',
        icon: 'shield',
        com: <Security/>
    },
    {
        name: 'About',
        icon: 'help',
        com: <About/>
    },
    {
        name: 'Danger Zone',
        icon: 'electricity',
        com: <DangerZone/>,
        separator: true,
        type: 'danger'
    }
];

// Push notifications settings if available
if (window.Notification) {
    tabs.splice(1, 0, {
        name: 'Notifications',
        icon: 'alarm',
        com: <Notifications/>
    });
}

export const Settings: FunctionalComponent = () => {
    const mobileMenu = createRef<CollapsibleList>();
    const [tabIndex, setTab] = useState(
        env.NODE_ENV === 'development' ? Number(localStorage.getItem('--dev-settings-index')) || 0 : 0
    );

    const changeTab = (tabIndex: number) => {
        mobileMenu.current?.toggleRetract();
        setTab(tabIndex);

        if (env.NODE_ENV === 'development') {
            localStorage.setItem('--dev-settings-index', String(tabIndex));
        }
    };

    // Render tab-buttons
    let activeComponent = null;
    const tabButtons = [];
    for (let i = 0; i < tabs.length; i++) {
        const {name, icon, com, type = 'normal', separator} = tabs[i];
        const active = i === tabIndex;

        if (active) {
            activeComponent = com;
        }

        if (separator) {
            tabButtons.push(<div className={styles.separator}/>);
        }

        tabButtons.push(
            <button onClick={() => changeTab(i)}
                    key={i}
                    data-type={type}
                    tabIndex={active ? -1 : 0}
                    aria-label={`Go to settings about ${name}`}
                    className={cn(styles.tabButton, {
                        [styles.active]: active
                    })}>
                <bc-icon name={icon}/>
                <span>{name}</span>
            </button>
        );
    }

    // TODO: Light theme looks shitty here
    return (
        <div className={styles.settings}>
            <div className={styles.options}>
                <div className={styles.tabs}>
                    {tabButtons}
                </div>

                <div className={styles.content}>
                    <div>{activeComponent}</div>
                </div>

                <div className={styles.mobileMenu}>
                    <CollapsibleList ref={mobileMenu} header={open =>
                        <button className={cn(styles.toggleButton, {
                            [styles.open]: open
                        })} aria-label="Open settings">
                            <div>
                                <div/>
                                <div/>
                                <div/>
                            </div>
                        </button>
                    } content={<div className={styles.mobileList}>{tabButtons}</div>}/>
                </div>
            </div>
        </div>
    );
};
