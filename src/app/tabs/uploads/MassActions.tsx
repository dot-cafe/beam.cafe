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
        const amount = uploads.selectedItems.length;

        const getTextFor = (name: MassAction): string => {
            const amount = massAction.get(name);
            return amount && amount > 1 ? `(${amount})` : '';
        };

        return (
            <div className={cn(styles.massActions, {
                [styles.visible]: amount > 0
            })}>
                <h3>{amount > 1 ? `${amount} Uploads Selected` : 'One Upload Selected'}</h3>

                <div className={styles.controls}>
                    <button disabled={!massAction.has('resume')}
                            onClick={this.massAction('resume')}
                            className={styles.actionBtn}
                            aria-label="Resume download for selected elements">
                        Resume {getTextFor('resume')}
                    </button>

                    <button disabled={!massAction.has('pause')}
                            onClick={this.massAction('pause')}
                            className={styles.actionBtn}
                            aria-label="Pause download for selected elements">
                        Pause {getTextFor('pause')}
                    </button>

                    <button disabled={!massAction.has('cancel')}
                            onClick={this.massAction('cancel')}
                            className={styles.actionBtn}
                            aria-label="Cancel download for selected elements">
                        Cancel {getTextFor('cancel')}
                    </button>

                    <button disabled={!massAction.has('remove')}
                            onClick={this.massAction('remove')}
                            className={styles.actionBtn}
                            aria-label="Remove selected uploads">
                        Remove {getTextFor('remove')}
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
