import {observer}            from 'mobx-react';
import {Component, h}        from 'preact';
import {MassAction, uploads} from '@state/index';
import {bind, cn}            from '@utils/preact-utils';
import styles                from './MassActions.module.scss';

@observer
export class MassActions extends Component {

    @bind
    massAction(action: MassAction) {
        return () => uploads.performMassAction(uploads.selectedUploads, action);
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
                            onClick={this.massAction('resume')}>
                        Resume
                    </button>

                    <button disabled={!massAction.includes('pause')}
                            onClick={this.massAction('pause')}>
                        Pause
                    </button>

                    <button disabled={!massAction.includes('cancel')}
                            onClick={this.massAction('cancel')}>
                        Cancel
                    </button>
                </div>
            </div>
        );
    }
}
