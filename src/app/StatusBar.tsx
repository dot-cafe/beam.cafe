import {observer}     from 'mobx-react';
import {Component, h} from 'preact';
import {JSXInternal}  from 'preact/src/jsx';
import {socket}       from '../state';
import styles         from './StatusBar.module.scss';

type Props = {};
type State = {};

@observer
export class StatusBar extends Component<Props, State> {
    render() {
        const {connectionState} = socket;
        let content: Array<JSXInternal.Element> = [];

        /* eslint-disable react/jsx-key */
        switch (connectionState) {
            case 'connected': {
                content = [
                    <bc-icon name="connected"/>,
                    <span>Connected!</span>
                ];

                break;
            }
            case 'disconnected': {
                content = [
                    <bc-icon name="disconnected"/>,
                    <span>Connecting...</span>
                ];

                break;
            }
        }

        return (
            <div className={styles.statusBar} data-state={connectionState}>
                {content}
            </div>
        );
    }
}
