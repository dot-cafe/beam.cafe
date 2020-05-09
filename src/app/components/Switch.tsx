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
    <div className={styles.switch}
         data-state={typeof state === 'boolean' ? state ? 'on' : 'off' : state}
         onClick={() => onChange(!state)}/>
);
