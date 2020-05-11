import {Component, h} from 'preact';
import {settings}     from '../../../../state';
import {bind, cn}     from '../../../../utils/preact-utils';
import {Toast}        from '../../../overlays/Toast';
import baseStyles     from './_base.module.scss';

export class DangerZone extends Component {

    @bind
    resetSettings() {
        settings.reset();
        Toast.instance.set({
            type: 'success',
            text: 'Settings restored!'
        });
    }

    render() {
        return (
            <div className={cn(baseStyles.section)}>
                <header>
                    <bc-icon name="electricity"/>
                    <h1>Danger Zone</h1>
                    <span> - Usage of the following options with caution!</span>
                </header>

                <section>
                    <header>
                        <bc-icon name="settings"/>
                        <h3>Reset Settings</h3>
                        <button className={baseStyles.danger}
                                onClick={this.resetSettings}>Reset
                        </button>
                    </header>

                    <article>
                        This will restore the default-settings, overriding the current ones.
                    </article>
                </section>
            </div>
        );
    }
}
