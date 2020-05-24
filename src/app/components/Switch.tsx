import {FunctionalComponent, h} from 'preact';
import styles                   from './Switch.module.scss';

type Props = {
    onChange: (newState: boolean) => void;
    state: SwitchState;
};

export type SwitchState = boolean | 'intermediate';
export const Switch: FunctionalComponent<Props> = (
    {state, onChange}
) => (
    <button className={styles.switch}
            role="checkbox"
            aria-checked={state ? 'checked' : ''}
            data-state={typeof state === 'boolean' ? state ? 'on' : 'off' : state}
            onClick={() => onChange(!state)}/>
);
