import {FunctionalComponent, h} from 'preact';
import styles                   from './Switch.module.scss';

type Props = {
    'aria-label'?: string;
    'aria-describedby'?: string;
    onChange: (newState: boolean) => void;
    state: SwitchState;
};

export type SwitchState = boolean | 'intermediate';
export const Switch: FunctionalComponent<Props> = (
    {state, onChange, ...props}
) => (
    <button className={styles.switch}
            aria-describedby={props['aria-describedby']}
            aria-label={props['aria-label']}
            role="switch"
            aria-checked={state ? 'on' : 'off'}
            data-state={typeof state === 'boolean' ? state ? 'on' : 'off' : state}
            onClick={() => onChange(!state)}/>
);
