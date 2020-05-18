import {EventBindingArgs, off, on} from '@utils/events';
import {observer}                  from 'mobx-react';
import {Component, h}              from 'preact';
import {MassAction, uploads}       from '@state/index';
import {bind, cn}                  from '@utils/preact-utils';
import styles                      from './MassActions.module.scss';

@observer
export class MassActions extends Component {
    private escapeArgs: EventBindingArgs | null = null;

    @bind
    massAction(action: MassAction) {
        return () => uploads.performMassAction(uploads.selectedUploads, action);
    }

    @bind
    clearSelection() {
        uploads.clearSelection();
    }

    componentDidMount() {
        this.escapeArgs = on(window, 'keyup', (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                this.clearSelection();
            }
        });
    }

    componentWillUnmount() {
        if (this.escapeArgs) {
            off(...this.escapeArgs);
        }
    }

    render() {
        const massAction = uploads.getAvailableMassActions(uploads.selectedUploads);

        return (
            <div className={cn(styles.massActions, {
                [styles.visible]: uploads.selectedUploads.length > 0
            })}>
                <h3>{uploads.selectedUploads.length} Uploads selected</h3>

                <div className={styles.controls}>
                    <button disabled={!massAction.includes('resume')}
                            onClick={this.massAction('resume')}
                            className={styles.actionBtn}>
                        Resume
                    </button>

                    <button disabled={!massAction.includes('pause')}
                            onClick={this.massAction('pause')}
                            className={styles.actionBtn}>
                        Pause
                    </button>

                    <button disabled={!massAction.includes('cancel')}
                            onClick={this.massAction('cancel')}
                            className={styles.actionBtn}>
                        Cancel
                    </button>

                    <button onClick={this.clearSelection}
                            className={styles.clearSelectionBtn}>
                        <bc-tooltip content="Clear Selection" pos="top-middle"/>
                        <bc-icon name="delete"/>
                    </button>
                </div>
            </div>
        );
    }
}
