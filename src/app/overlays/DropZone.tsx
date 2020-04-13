import {observer}                  from 'mobx-react';
import {Component, h}              from 'preact';
import {listedFiles}               from '../../state';
import {EventBindingArgs, off, on} from '../../utils/events';
import {cn}                        from '../../utils/preact-utils';
import styles                      from './DropZone.module.scss';

type Props = {};
type State = {
    dragover: boolean;
};

@observer
export class DropZone extends Component<Props, State> {
    readonly state = {
        dragover: false
    };
    private readonly listeners: Array<EventBindingArgs>;

    constructor() {
        super();

        this.listeners = [
            on(window, [
                'dragenter',
                'dragover',
                'dragend',
                'dragexit',
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
                    case 'dragexit':
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

    accept(fileList: FileList): void {
        listedFiles.add(...Array.from(fileList));
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
                [styles.dragOver]: listedFiles.isEmpty || dragover
            })}>
                <div/>
                <p>{
                    listedFiles.isEmpty ?
                        'Drop files  to get started!' :
                        'Release files to upload them!'
                }</p>
            </div>
        );
    }
}
