import {Component, h} from 'preact';
import {bind, cn}     from '../../utils/preact-utils';
import Icon           from '../components/Icon';
import styles         from './ThemeSwitcher.module.scss';

type Theme = 'dark' | 'light';
type Props = {};
type State = {
    theme: Theme;
};

export class ThemeSwitcher extends Component<Props, State> {

    readonly state = {
        theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light' as Theme
    };

    constructor() {
        super();

        const savedTheme = localStorage.getItem('color-theme');
        if (savedTheme && savedTheme !== this.state.theme) {
            document.body.classList.remove(this.state.theme);
            document.body.classList.add(savedTheme);
            this.state.theme = savedTheme as Theme;
        }
    }

    @bind
    toggleTheme() {
        const {theme} = this.state;
        const {classList} = document.body;
        const newTheme = theme === 'light' ? 'dark' : 'light';

        classList.remove(theme);
        classList.add(newTheme, 'theme-refreshing');

        // Wait until theme-transition duration is finish
        setTimeout(() => {
            classList.remove('theme-refreshing');
        }, 300);

        this.setState({theme: newTheme});

        // Keep preferred theme in mind
        localStorage.setItem('color-theme', newTheme);
    }

    render(_: Props, {theme}: State) {
        return (
            <div onClick={this.toggleTheme}
                 className={cn(styles.themeSwitcher, {
                     [styles.toggled]: theme === 'dark'
                 })}>
                <div>
                    <Icon name="sun"
                          className={cn({
                              [styles.visible]: theme === 'light'
                          })}/>

                    <Icon name="moon"
                          className={cn({
                              [styles.visible]: theme === 'dark'
                          })}/>
                </div>
            </div>
        );
    }
}
