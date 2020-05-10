import {observer}                        from 'mobx-react';
import {Component, h}                    from 'preact';
import {CustomizationSettings, settings} from '../../../../state';
import {bind, cn}                        from '../../../../utils/preact-utils';
import {ColorPicker}                     from '../../../components/ColorPicker';
import baseStyles                        from './_base.module.scss';
import styles                            from './Customize.module.scss';

type Props = {};
type State = CustomizationSettings;

@observer
export class Customize extends Component<Props, State> {

    /* eslint-disable no-invalid-this */
    readonly state = this.default;

    get default() {
        return JSON.parse(JSON.stringify(settings.get('customization')));
    }

    get changed() {
        return JSON.stringify(this.state) !== JSON.stringify(this.default);
    }

    @bind
    save() {
        settings.set('customization', JSON.parse(JSON.stringify(this.state)));
    }

    @bind
    reset() {
        this.setState(this.default);
    }

    @bind
    updateUsername(e: Event) {
        this.setState({
            username: (e.target as HTMLInputElement).value
        });
    }

    updateColor(index: number) {
        return (hex: string) => {
            this.setState({
                colors: this.state.colors.map(
                    (v: string, i: number) => i === index ? hex : v
                )
            });
        };
    }

    render() {
        const {username, colors} = this.state;

        return (
            <div className={baseStyles.section}>
                <header>
                    <bc-icon name="paint"/>
                    <h1>Customize</h1>
                    <span> - Make your links recognizable!</span>
                </header>

                <section className={cn(baseStyles.borderless, styles.user)}>
                    <img src="https://cdn2.thecatapi.com/images/MTY4OTk4OQ.jpg" alt=""/>

                    <div className={styles.controls}>
                        <input type="text"
                               value={username}
                               onChange={this.updateUsername}/>

                        <div className={styles.colors}>
                            {colors.map((value: string, index: number) => (
                                <ColorPicker key={index}
                                             button={<button className={styles.btn}/>}
                                             color={colors[index]}
                                             onChangeStop={this.updateColor(index)}/>
                            ))}
                        </div>
                    </div>
                </section>

                <section className={cn(baseStyles.borderless, styles.actions, {
                    [styles.visible]: this.changed
                })}>
                    <button onClick={this.reset} className={styles.resetBtn}>
                        <bc-icon name="delete"/>
                        <span>Cancel</span>
                    </button>

                    <button onClick={this.save}>
                        <bc-icon name="save"/>
                        <span>Save</span>
                    </button>
                </section>
            </div>
        );
    }
}
