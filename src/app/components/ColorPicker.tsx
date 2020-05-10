import {TinyColor}                                from '@ctrl/tinycolor';
import {Component, createRef, h}                  from 'preact';
import {JSXInternal}                              from 'preact/src/jsx';
import {EventBindingArgs, off, on, simplifyEvent} from '../../utils/events';
import styles                                     from './ColorPicker.module.scss';
import {Popper}                                   from './Popper';

type Props = {
    className?: string;
    color?: string;
    button: JSXInternal.Element;
    onChange?: (color: string) => void;
    onChangeStop?: (color: string) => void;
};

type State = {
    selecting: boolean;
    hue: number;
    saturation: number;
    value: number;
};

export class ColorPicker extends Component<Props, State> {
    private readonly palette = createRef<HTMLDivElement>();
    private readonly hue = createRef<HTMLDivElement>();
    private eventBindings: Array<EventBindingArgs> = [];

    state = {
        selecting: false,
        hue: 22,
        saturation: 50,
        value: 50
    };

    get hexColor() {
        const {state} = this;
        return new TinyColor({
            h: state.hue,
            s: state.saturation,
            v: state.value
        }).toHexString();
    }

    componentDidMount() {
        const palette = this.palette.current as HTMLDivElement;
        const hue = this.hue.current as HTMLDivElement;
        const startEvents = ['mousedown', 'touchstart'];
        const moveEvents = ['mousemove', 'touchmove'];
        const stopEvents = ['mouseup', 'touchend', 'touchcancel'];

        this.eventBindings = [
            on(hue, startEvents, () => {
                const hr = hue.getBoundingClientRect();
                this.setState({selecting: true});

                const moveArgs = on(window, moveEvents, (e: MouseEvent) => {
                    const {x} = simplifyEvent(e);
                    const hx = (x - hr.left) / hr.width;

                    this.updateColor({
                        hue: Math.max(0, Math.min(1, hx)) * 360
                    });

                    e.stopPropagation();
                }, {capture: true});

                on(window, stopEvents, () => {
                    this.setState({selecting: false});
                    this.props.onChangeStop?.(this.hexColor);
                    off(...moveArgs);
                });
            }),

            on(palette, startEvents, () => {
                const hr = palette.getBoundingClientRect();
                this.setState({selecting: true});

                const moveArgs = on(window, moveEvents, (e: MouseEvent) => {
                    const {y, x} = simplifyEvent(e);
                    const hx = (x - hr.left) / hr.width;
                    const hy = (y - hr.top) / hr.height;

                    this.updateColor({
                        saturation: Math.max(0, Math.min(1, hx)) * 100,
                        value: 100 - Math.max(0, Math.min(1, hy)) * 100
                    });

                    e.stopPropagation();
                }, {capture: true});

                on(window, stopEvents, () => {
                    this.setState({selecting: false});
                    this.props.onChangeStop?.(this.hexColor);
                    off(...moveArgs);
                });
            })
        ];

        const color = new TinyColor(this.props.color || 'blue')
            .toHsv();

        this.updateColor({
            hue: color.h,
            saturation: color.s * 100,
            value: color.v * 100
        });
    }

    componentWillUnmount() {
        for (const args of this.eventBindings) {
            off(...args);
        }
    }

    updateColor(props: Partial<State>) {
        this.setState(props, () => {
            this.props.onChange?.(this.hexColor);
        });
    }

    render() {
        const {hue, saturation, value, selecting} = this.state;
        const {className, button, color} = this.props;

        const tc = new TinyColor(selecting ? {h: hue, s: saturation, v: value} : color);
        const hsl = tc.toHsl();
        const colorStr = `hsl(${hsl.h}, ${hsl.s * 100}%, ${hsl.l * 100}%)`;
        const styleVars = `--color-hue: ${hue};`
            + `--color-saturation: ${saturation};`
            + `--color-value: ${value};`
            + `--color-hsl: ${tc.toRgbString()};`;

        return (
            <Popper className={className}
                    button={button}
                    style={`--color-picker-color: ${colorStr}`}
                    content={
                        <div className={styles.colorPicker}
                             style={styleVars}>
                            <div className={styles.palette} ref={this.palette}>
                                <div/>
                            </div>

                            <div className={styles.hue} ref={this.hue}>
                                <div/>
                            </div>
                        </div>
                    }/>
        );
    }
}
