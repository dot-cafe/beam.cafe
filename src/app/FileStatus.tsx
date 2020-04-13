import {Component, createRef, h} from 'preact';
import {ListedFileStatus}        from '../state/models/ListedFiles';
import styles                    from './FileStatus.module.scss';

type Props = {
    status: ListedFileStatus;
    text: string;
};

type State = {
    pathLength: number;
};

export class FileStatus extends Component<Props, State> {
    state = {
        pathLength: 0
    };
    private readonly rectEl = createRef<SVGRectElement>();

    componentDidMount(): void {
        const el = this.rectEl.current;

        if (el) {
            this.setState({
                pathLength: el.getTotalLength()
            });
        }
    }

    render() {
        const {pathLength} = this.state;
        const {text, status} = this.props;

        return (
            <div className={styles.status}
                 data-status={status}>
                <span>{text}</span>

                <svg xmlns="http://www.w3.org/2000/svg">
                    <rect x="0" y="0" width="100%" height="100%" rx="2"/>
                    <rect className={styles.outline}
                          style={`--path-length: ${pathLength - 20};`}
                          ref={this.rectEl}
                          x="0"
                          y="0"
                          width="100%"
                          height="100%"
                          rx="2"/>
                </svg>
            </div>
        );
    }
}
