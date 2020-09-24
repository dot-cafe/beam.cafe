/**
 * Polyfill for safari & firefox for the eventPath event property.
 * @param evt The event object.
 * @return [String] event path.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
export function eventPath(evt: any): Array<EventTarget> {
    let path: Array<EventTarget> = evt.path || (evt.composedPath && evt.composedPath());
    if (path) {
        return path;
    }

    let el = evt.target.parentElement;
    path = [evt.target, el];
    while (el = el.parentElement) {
        path.push(el);
    }

    path.push(document, window);
    return path;
}
