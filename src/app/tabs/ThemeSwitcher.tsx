import {Component, h} from 'preact';
import {bind, cn}     from '../../utils/preact-utils';
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

                    <svg xmlns="http://www.w3.org/2000/svg"
                         viewBox="0 0 30 30"
                         className={cn({
                             [styles.visible]: theme === 'light'
                         })}>
                        <path
                            d="M 14.984375 0.98632812 A 1.0001 1.0001 0 0 0 14 2 L 14 5 A 1.0001 1.0001 0 1 0 16 5 L 16 2 A 1.0001 1.0001 0 0 0 14.984375 0.98632812 z M 5.796875 4.7988281 A 1.0001 1.0001 0 0 0 5.1015625 6.515625 L 7.2226562 8.6367188 A 1.0001 1.0001 0 1 0 8.6367188 7.2226562 L 6.515625 5.1015625 A 1.0001 1.0001 0 0 0 5.796875 4.7988281 z M 24.171875 4.7988281 A 1.0001 1.0001 0 0 0 23.484375 5.1015625 L 21.363281 7.2226562 A 1.0001 1.0001 0 1 0 22.777344 8.6367188 L 24.898438 6.515625 A 1.0001 1.0001 0 0 0 24.171875 4.7988281 z M 15 8 A 7 7 0 0 0 8 15 A 7 7 0 0 0 15 22 A 7 7 0 0 0 22 15 A 7 7 0 0 0 15 8 z M 2 14 A 1.0001 1.0001 0 1 0 2 16 L 5 16 A 1.0001 1.0001 0 1 0 5 14 L 2 14 z M 25 14 A 1.0001 1.0001 0 1 0 25 16 L 28 16 A 1.0001 1.0001 0 1 0 28 14 L 25 14 z M 7.9101562 21.060547 A 1.0001 1.0001 0 0 0 7.2226562 21.363281 L 5.1015625 23.484375 A 1.0001 1.0001 0 1 0 6.515625 24.898438 L 8.6367188 22.777344 A 1.0001 1.0001 0 0 0 7.9101562 21.060547 z M 22.060547 21.060547 A 1.0001 1.0001 0 0 0 21.363281 22.777344 L 23.484375 24.898438 A 1.0001 1.0001 0 1 0 24.898438 23.484375 L 22.777344 21.363281 A 1.0001 1.0001 0 0 0 22.060547 21.060547 z M 14.984375 23.986328 A 1.0001 1.0001 0 0 0 14 25 L 14 28 A 1.0001 1.0001 0 1 0 16 28 L 16 25 A 1.0001 1.0001 0 0 0 14.984375 23.986328 z"/>
                    </svg>

                    <svg xmlns="http://www.w3.org/2000/svg"
                         viewBox="0 0 30 30"
                         className={cn({
                             [styles.visible]: theme === 'dark'
                         })}>
                        <path
                            d="M 18.984375 -0.013671875 A 1.0001 1.0001 0 0 0 18 1 L 18 2 L 17 2 A 1.0001 1.0001 0 1 0 17 4 L 18 4 L 18 5 A 1.0001 1.0001 0 1 0 20 5 L 20 4 L 21 4 A 1.0001 1.0001 0 1 0 21 2 L 20 2 L 20 1 A 1.0001 1.0001 0 0 0 18.984375 -0.013671875 z M 12.390625 3.2929688 C 7.019625 4.4859687 3 9.27 3 15 C 3 21.627 8.373 27 15 27 C 20.73 27 25.514031 22.980375 26.707031 17.609375 C 25.171031 18.489375 23.397 19 21.5 19 C 15.701 19 11 14.299 11 8.5 C 11 6.603 11.510625 4.8289688 12.390625 3.2929688 z M 25 7 C 24.448 7 24 7.448 24 8 L 24 9 C 24 9.552 23.552 10 23 10 L 22 10 C 21.448 10 21 10.448 21 11 C 21 11.552 21.448 12 22 12 L 23 12 C 23.552 12 24 12.448 24 13 L 24 14 C 24 14.552 24.448 15 25 15 C 25.552 15 26 14.552 26 14 L 26 13 C 26 12.448 26.448 12 27 12 L 28 12 C 28.552 12 29 11.552 29 11 C 29 10.448 28.552 10 28 10 L 27 10 C 26.448 10 26 9.552 26 9 L 26 8 C 26 7.448 25.552 7 25 7 z"/>
                    </svg>
                </div>
            </div>
        );
    }
}
