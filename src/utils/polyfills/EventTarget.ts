
// Safari again... graceful-ws also got this problem
// See https://github.com/Simonwep/graceful-ws/blob/master/src/index.ts#L8
export class EventTarget {

    /* eslint-disable no-invalid-this */
    /* eslint-disable @typescript-eslint/no-explicit-any */
    private readonly _eventProxy = document.createElement('div');
    public addEventListener = this._eventProxy.addEventListener.bind(this._eventProxy) as any;
    public dispatchEvent = this._eventProxy.dispatchEvent.bind(this._eventProxy) as any;
    public removeEventListener = this._eventProxy.removeEventListener.bind(this._eventProxy) as any;

    // Let's also support on, off and emit like node
    public on = this.addEventListener;
    public emit = this.dispatchEvent;
    public off = this.removeEventListener;
}
