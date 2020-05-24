import {Toast}        from '@overlays/Toast';
import {settings}     from '@state/index';
import {bind, cn}     from '@utils/preact-utils';
import {observer}     from 'mobx-react';
import {Component, h} from 'preact';
import styles         from './ThemeSwitcher.module.scss';

@observer
export class ThemeSwitcher extends Component {

    componentDidMount() {
        this.setTheme(settings.get('theme'), true);
    }

    setTheme(theme: 'light' | 'dark', silent = false) {
        const oldTheme = settings.get('theme');

        if (settings.get('highContrast')) {
            if (!silent) {
                Toast.instance.show({
                    type: 'error',
                    text: 'High contrast is enabled. Disable it first.'
                });
            }

            return;
        }

        const {classList} = document.body;
        classList.remove(oldTheme);
        classList.add(theme, 'theme-transition');

        // Wait until theme-transition duration is finish
        setTimeout(() => {
            classList.remove('theme-transition');
        }, 300);

        // Update settings
        settings.set('theme', theme);
    }

    @bind
    toggleTheme() {
        const theme = settings.get('theme');
        this.setTheme(theme === 'light' ? 'dark' : 'light');
    }

    render() {
        const theme = settings.get('theme');

        return (
            <div onClick={this.toggleTheme}
                 className={cn(styles.themeSwitcher, {
                     [styles.toggled]: theme === 'dark'
                 })}>

                <bc-tooltip content={`Change Theme to ${theme}`}/>

                <button>
                    <bc-icon name="sun"
                             className={cn({
                                 [styles.visible]: theme === 'light'
                             })}/>

                    <bc-icon name="moon"
                             className={cn({
                                 [styles.visible]: theme === 'dark'
                             })}/>
                </button>
            </div>
        );
    }
}
