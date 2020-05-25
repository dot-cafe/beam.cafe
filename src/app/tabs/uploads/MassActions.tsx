import {MassAction, uploads}       from '@state/index';
import {EventBindingArgs, off, on} from '@utils/events';
import {bind, cn}                  from '@utils/preact-utils';
import {observer}                  from 'mobx-react';
import {Component, h}              from 'preact';
import styles                      from './MassActions.module.scss';

@observer
export class MassActions extends Component {
    private escapeArgs: EventBindingArgs | null = null;

    @bind
    massAction(action: MassAction) {
        return () => uploads.performMassAction(uploads.selectedItems, action);
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
        const massAction = uploads.getAvailableMassActions(uploads.selectedItems);

        return (
            <div className={cn(styles.massActions, {
                [styles.visible]: uploads.selectedItems.length > 0
            })}>
                <h3>{uploads.selectedItems.length} Uploads selected</h3>

                <div className={styles.controls}>
                    <button disabled={!massAction.includes('resume')}
                            onClick={this.massAction('resume')}
                            className={styles.actionBtn}
                            aria-label="Resume download for selected elements">
                        Resume
                    </button>

                    <button disabled={!massAction.includes('pause')}
                            onClick={this.massAction('pause')}
                            className={styles.actionBtn}
                            aria-label="Pause download for selected elements">
                        Pause
                    </button>

                    <button disabled={!massAction.includes('cancel')}
                            onClick={this.massAction('cancel')}
                            className={styles.actionBtn}
                            aria-label="Cancel download for selected elements">
                        Cancel
                    </button>

                    <button disabled={!massAction.includes('remove')}
                            onClick={this.massAction('remove')}
                            className={styles.actionBtn}
                            aria-label="Remove selected uploads">
                        Remove
                    </button>

                    <button onClick={this.clearSelection}
                            className={styles.clearSelectionBtn}
                            aria-label="Clear selection">
                        <bc-tooltip content="Clear Selection" pos="top-middle"/>
                        <bc-icon name="delete"/>
                    </button>
                </div>
            </div>
        );
    }
}
