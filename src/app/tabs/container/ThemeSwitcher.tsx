import {settings}     from '@state/index';
import {bind, cn}     from '@utils/preact-utils';
import {observer}     from 'mobx-react';
import {Component, h} from 'preact';
import styles         from './ThemeSwitcher.module.scss';

@observer
export class ThemeSwitcher extends Component {

    componentDidMount() {
        this.setTheme(settings.theme);
    }

    setTheme(theme: 'light' | 'dark') {
        const oldTheme = settings.theme;
        const {classList} = document.body;
        classList.remove(oldTheme);
        classList.add(theme, 'theme-transition');

        // Wait until theme-transition duration is finish
        setTimeout(() => {
            classList.remove('theme-transition');
        }, 300);

        // Update settings
        settings.theme = theme;
    }

    @bind
    toggleTheme() {
        const theme = settings.theme;
        this.setTheme(theme === 'light' ? 'dark' : 'light');
    }

    render() {
        const theme = settings.theme;
        const tooltip = `Change Theme to ${theme === 'light' ? 'dark' : 'light'}`;

        return (
            <div onClick={this.toggleTheme}
                 className={cn(styles.themeSwitcher, {
                     [styles.toggled]: theme === 'dark'
                 })}>

                <bc-tooltip content={tooltip}/>

                <button aria-label={tooltip}>
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
