import {files}                     from '@state/index';
import {EventBindingArgs, off, on} from '@utils/events';
import {bind, cn}                  from '@utils/preact-utils';
import {observer}                  from 'mobx-react';
import {Component, h}              from 'preact';
import styles                      from './DropZone.module.scss';

type Props = unknown;
type State = {
    dragover: boolean;
};

@observer
export class DropZone extends Component<Props, State> {
    private readonly listeners: Array<EventBindingArgs>;
    readonly state = {
        dragover: false
    };

    constructor() {
        super();

        this.listeners = [
            on(document, [
                'dragenter',
                'dragover',
                'dragend',
                'dragleave',
                'drop'
            ], (ev: DragEvent) => {

                switch (ev.type) {
                    case 'dragenter':
                    case 'dragover': {
                        if (!this.state.dragover) {
                            this.setState({
                                dragover: true
                            });
                        }
                        break;
                    }
                    case 'dragend':
                    case 'dragleave':
                    case 'drop': {
                        this.setState({
                            dragover: false
                        });

                        if (ev.type === 'drop' && ev.dataTransfer) {
                            const {files} = ev.dataTransfer;

                            if (files.length > 0) {
                                this.accept(files);
                            }
                        }

                        break;
                    }
                }

                ev.preventDefault();
            })
        ];
    }

    @bind
    accept(fileList: FileList): void {
        files.add(...Array.from(fileList));
    }

    @bind
    chooseFiles(): void {
        void files.openDialog();
    }

    componentWillUnmount(): void {
        for (const args of this.listeners) {
            off(...args);
        }
    }

    render() {
        const {dragover} = this.state;

        return (
            <div className={cn(styles.dropZone, {
                [styles.dragOver]: files.isEmpty || dragover
            })}>
                <div className={styles.desktop}>
                    <h1>{
                        files.isEmpty && !dragover ?
                            'Drop Files To Get Started!' :
                            'Release Files To Upload Them!'
                    }</h1>

                    {files.isEmpty ?
                        <button onClick={this.chooseFiles}
                                aria-label="Add files">
                            <bc-icon name="file"/>
                            <span>Choose Files</span>
                        </button> :
                        <bc-icon name="arrow-down"/>
                    }
                </div>

                <div className={styles.mobile}>
                    <bc-icon name="rocket"/>
                    <h1>Click <b>Add Files</b> To Get Started</h1>
                </div>
            </div>
        );
    }
}
