import {EventBindingArgs, off, on} from '@utils/events';
import {NanoPop, NanoPopPosition}  from 'nanopop';
import {isMobile}                  from '../../browserenv';
import styles                      from './tooltip.module.scss';

const REFLECTED_ATTRIBUTES = ['content', 'pos'];

class BeamCafeTooltip extends HTMLElement {
    private static readonly PADDING = 8;
    private _triggerEventListener: EventBindingArgs | null = null;
    private _hideEventListener: EventBindingArgs | null = null;
    private _toolTip: HTMLParagraphElement;
    private _nanoPop: NanoPop;
    private _visible = false;
    private _connected = false;

    constructor() {
        super();
        this._toolTip = document.createElement('p');
        this._toolTip.classList.add(styles.tooltip);
        this._nanoPop = new NanoPop(document.body, this._toolTip);
    }

    static get observedAttributes(): Array<string> {
        return REFLECTED_ATTRIBUTES;
    }

    private updateText(): void {
        this._toolTip.innerHTML = this.getAttribute('content') as string;
    }

    private updatePosition(reference?: HTMLElement): string | null {
        return this._nanoPop.update({
            container: document.body.getBoundingClientRect(),
            position: (this.getAttribute('pos') || 'bottom-middle') as NanoPopPosition,
            reference
        });
    }

    private hide(): void {
        if (this._visible) {
            const tt = this._toolTip;

            // Fade-out
            tt.classList.add(styles.removing);
            tt.classList.remove(styles.visible);

            // Remove after transition is done
            setTimeout(() => {
                tt.classList.remove(styles.removing);
                document.body.removeChild(tt);
                this._visible = false;
            }, 300);

            // Clean up listeners
            this._hideEventListener && off(...this._hideEventListener);
        }
    }

    private show(): void {
        if (!this._connected || this._visible || !this.parentElement) {
            return;
        }

        // Shortcuts
        const ref = this.parentElement;
        const tt = this._toolTip;

        // Add tooltip to body and update position
        document.body.appendChild(tt);
        this.updateText();

        const pos = this.updatePosition(ref);
        if (pos) {
            this._visible = true;

            // Update position attributes
            // See https://github.com/Simonwep/nanopop#functions
            const [p, v] = pos;
            tt.setAttribute('data-pos', p);
            tt.setAttribute('data-var', v);

            // Fade-in
            requestAnimationFrame(() => {
                tt.classList.add(styles.visible);

                // Remove tool-tip if user un-hovers the element
                this._hideEventListener = on(window, 'mousemove', (e: MouseEvent) => {
                    const tr = ref.getBoundingClientRect();
                    const padding = BeamCafeTooltip.PADDING;

                    // Calculate distance
                    if (e.pageY < (tr.top - padding) ||
                        e.pageY > (tr.bottom + padding) ||
                        e.pageX < (tr.left - padding) ||
                        e.pageX > (tr.right + padding)) {
                        this.hide();
                    }
                });
            });
        } else {
            document.body.removeChild(tt);
        }
    }

    connectedCallback(): void {
        if (!isMobile && !this._connected) {
            this.setAttribute('role', 'tooltip');
            this.style.display = 'none';
            this._connected = true;

            const ref = this.parentElement as HTMLElement;
            this._triggerEventListener = on(ref, 'mouseenter', () => {
                this.show();
            });
        }
    }

    disconnectedCallback(): void {
        if (!isMobile) {
            this._connected = false;
            this.hide();

            // Clean up listeners
            this._triggerEventListener && off(...this._triggerEventListener);
        }
    }

    attributeChangedCallback(name: string): void {
        if (REFLECTED_ATTRIBUTES.includes(name)) {
            switch (name) {
                case 'content': {
                    this.updateText();

                    if (this._visible && this.parentElement) {
                        this.updatePosition(this.parentElement);
                    }

                    break;
                }
                case 'pos': {
                    this.updatePosition();
                    break;
                }
            }
        }
    }
}

customElements.define('bc-tooltip', BeamCafeTooltip);
