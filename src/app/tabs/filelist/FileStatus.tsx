import {Component, createRef, h} from 'preact';
import {ListedFileStatus}        from '../../../state/models/ListedFile';
import styles                    from './FileStatus.module.scss';

type Props = {
    status: ListedFileStatus;
    text: string;
};

type State = {};

export class FileStatus extends Component<Props, State> {
    private readonly svgEl = createRef<SVGSVGElement>();

    componentDidUpdate(): void {
        const svgElement = this.svgEl.current;

        if (svgElement) {
            const {style} = svgElement;
            style.width = '100%';
            style.height = '100%';

            const rect = svgElement.getBoundingClientRect();
            style.width = `${Math.ceil(rect.width / 2) * 2}px`;
            style.height = `${Math.ceil(rect.height / 2) * 2}px`;
        }
    }

    render() {
        const {text, status} = this.props;

        return (
            <div className={styles.status}
                 data-status={status}>
                <span>{text}</span>

                <svg xmlns="http://www.w3.org/2000/svg"
                     ref={this.svgEl}>
                    <rect x="0"
                          y="0"
                          width="100%"
                          height="100%"
                          rx="2"
                          pathLength="100"/>

                    <rect className={styles.outline}
                          x="0"
                          y="0"
                          width="100%"
                          height="100%"
                          rx="2"
                          pathLength="100"/>
                </svg>
            </div>
        );
    }
}
