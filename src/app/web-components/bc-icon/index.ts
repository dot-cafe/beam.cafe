/* eslint-disable @typescript-eslint/no-var-requires */

// Load icons dynamically
const icons = new Map();
const svgContext = require.context('./icons', false, /\.svg$/);
for (const path of svgContext.keys()) {
    const nameWithExt = path.slice(2);
    const name = nameWithExt.slice(0, -4);
    icons.set(name, require(`./icons/${nameWithExt}`));
}

const REFLECTED_ATTRIBUTES = ['name'];

class BeamCafeIcon extends HTMLElement {
    private _connected = false;
    private _updating = false;

    static get observedAttributes(): Array<string> {
        return REFLECTED_ATTRIBUTES;
    }

    connectedCallback(): void {
        if (!this._connected) {
            const iconName = this.getAttribute('name');
            this.innerHTML = icons.get(iconName) || '';
            this._connected = true;
        }
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string | null): void {
        if (!this._updating && REFLECTED_ATTRIBUTES.includes(name)) {
            if (!newValue) {
                throw new Error('Icon cannot be null');
            }

            this.innerHTML = icons.get(newValue) || '';
        }
    }
}

customElements.define('bc-icon', BeamCafeIcon);
