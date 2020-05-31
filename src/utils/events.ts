type Method = 'addEventListener' | 'removeEventListener';

export type EventContainer = {
    on(args: EventBindingArgs): void;
    onMany(args: Array<EventBindingArgs>): void;
    clear(): void;
};

export type EventBindingArgs = [
    EventTarget | Array<EventTarget>,
    string | Array<string>,
    Function,
    object?
];

interface EventBinding {
    (
        elements: EventTarget | Array<EventTarget>,
        events: string | Array<string>,
        fn: Function, options?: object
    ): EventBindingArgs;
}

/* eslint-disable prefer-rest-params */
function eventListener(method: Method): EventBinding {
    return (
        items: EventTarget | Array<EventTarget>,
        events: string | Array<string>,
        fn: Function, options = {}
    ): EventBindingArgs => {

        // Normalize array
        if (items instanceof HTMLCollection || items instanceof NodeList) {
            items = Array.from(items);
        } else if (!Array.isArray(items)) {
            items = [items];
        }

        if (!Array.isArray(events)) {
            events = [events];
        }

        for (const el of items) {
            for (const ev of events) {
                el[method](ev, fn as EventListener, {capture: false, ...options});
            }
        }

        return [items, events, fn, options];
    };
}

/**
 * Add event(s) to element(s).
 * @param elements DOM-Elements
 * @param events Event names
 * @param fn Callback
 * @param options Optional options
 * @return Array passed arguments
 */
export const on = eventListener('addEventListener');

/**
 * Remove event(s) from element(s).
 * @param elements DOM-Elements
 * @param events Event names
 * @param fn Callback
 * @param options Optional options
 * @return Array passed arguments
 */
export const off = eventListener('removeEventListener');

/**
 * Clean up utility function.
 */
export const createNativeEventContainer = () => {
    let listeners: Array<EventBindingArgs> = [];

    return {
        unbind(): void {
            for (const args of listeners) {
                off(...args);
            }

            listeners = [];
        },

        onMany(args: Array<EventBindingArgs>): void {
            for (const set of args) {
                listeners.push(on(...set));
            }
        },

        on(...args: EventBindingArgs): void {
            listeners.push(on(...args));
        }
    };
};

/**
 * Simplifies a touch / mouse-event
 * @param evt
 */
export const simplifyEvent = (evt: TouchEvent) => {
    const tap = (evt.touches && evt.touches[0] || evt);
    return {
        tap,
        x: tap.clientX,
        y: tap.clientY,
        target: tap.target
    };
};
