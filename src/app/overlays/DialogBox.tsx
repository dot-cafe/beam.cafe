import {JSXInternal}  from '/preact/src/jsx';
import {singleton}    from '@utils/preact-singleton';
import {cn}           from '@utils/preact-utils';
import {uid}          from '@utils/uid';
import {Component, h} from 'preact';
import styles         from './DialogBox.module.scss';

export type DialogButtonSeverity = 'success' | 'warning' | 'error';

export type DialogButton = {
    type?: DialogButtonSeverity;
    icon?: string;
    text: string;
};

export type Dialog = {
    icon: string;
    title: string;
    description?: string;
    buttons?: Array<DialogButton>;
};

type InternalDialogItem = {
    dialog: Dialog;
    resolve: (res: number) => void;
    removing: boolean;
};

type Props = unknown;
type State = {
    dialogs: Array<InternalDialogItem>;
};

export const DialogBox = singleton(class extends Component<Props, State> {
    readonly state = {
        dialogs: []
    };

    private get firstItem(): InternalDialogItem | null {
        const {dialogs} = this.state;
        return dialogs.length ? dialogs[0] : null;
    }

    private resolve(index: number) {
        return () => {
            const item = this.firstItem;

            if (item) {
                item.resolve(index);
                item.removing = true;

                this.setState({
                    dialogs: [
                        item,
                        ...this.state.dialogs.slice(1)
                    ]
                });

                // Wait until fade-out animation is over
                setTimeout(() => {
                    this.setState({
                        dialogs: this.state.dialogs.slice(1)
                    });
                }, 300);
            }
        };
    }

    public open(dialog: Dialog): Promise<number> {
        return new Promise<number>(resolve => {
            this.setState(props => ({
                dialogs: [
                    ...props.dialogs, {
                        dialog,
                        resolve,
                        removing: false
                    }
                ]
            }));
        });
    }

    render() {
        const item = this.firstItem;
        let dialog: JSXInternal.Element | string = '';

        if (item) {
            const {title, description, buttons} = item.dialog;
            const describedby = uid('aria');
            const labelledby = uid('aria');

            dialog = <div role="dialog"
                          aria-labelledby={labelledby}
                          aria-describedby={describedby}
                          className={cn(styles.dialog, {
                              [styles.closing]: item.removing
                          })}>

                <header>
                    <bc-icon name={item.dialog.icon}/>
                    <p id={labelledby}>{title}</p>
                </header>

                <p id={describedby}>{description}</p>

                {buttons ?
                    <div className={styles.buttonBar}>
                        {buttons.map((v, i) => (
                            <button key={i}
                                    onClick={this.resolve(i)}
                                    data-severity={v.type || 'success'}>
                                {v.icon ? <bc-icon name={v.icon}/> : ''}
                                <span>{v.text}</span>
                            </button>
                        ))}
                    </div> : ''
                }
            </div>;
        }

        return (
            <div className={cn(styles.dialogBox, {
                [styles.open]: this.state.dialogs.length > 0
            })} role="dialog">
                {dialog}
            </div>
        );
    }

});
