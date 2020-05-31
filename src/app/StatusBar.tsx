import {observer}    from 'mobx-react';
import {Fragment, h} from 'preact';
import {JSXInternal} from 'preact/src/jsx';
import {socket}      from '../state';
import styles        from './StatusBar.module.scss';

export const StatusBar = observer(() => {
    const {connectionState} = socket;
    let content: JSXInternal.Element;

    switch (connectionState) {
        case 'connected': {
            content = <Fragment>
                <bc-icon name="connected"/>
                <span>Connected!</span>
            </Fragment>;

            break;
        }
        case 'disconnected': {
            content = <Fragment>
                <bc-icon name="disconnected"/>
                <span>Connecting...</span>
            </Fragment>;

            break;
        }
    }

    return (
        <div className={styles.statusBar} data-state={connectionState}>
            {content}
        </div>
    );
});
