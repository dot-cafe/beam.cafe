import {Component, ComponentConstructor, createRef, h} from 'preact';
import {JSXInternal}                                   from 'preact/src/jsx';

export type SingletonComponent<T> = {
    instance: T;
    element: JSXInternal.Element;
};

/**
 * Makes a component a singleton.
 * Does not work as decorator, see https://github.com/Microsoft/TypeScript/issues/4881
 * @param target
 */
export function singleton<T extends Function>(
    target: T
): SingletonComponent<T['prototype']> {
    const ref = createRef();

    // I have no Idea how this works.
    const Component = target as unknown as ComponentConstructor;

    Object.defineProperty(target, 'instance', {
        get: () => ref.current,
        set: () => {
            throw new Error('instance is a readonly property');
        }
    });

    /**
     * This DOES re-create the component right? No, not really. I don't
     * know why but it works. Even with hot-reload.
     */
    Object.defineProperty(target, 'element', {
        get: () => <Component ref={ref}/>,
        set: () => {
            throw new Error('element is a readonly property');
        }
    });

    return target as unknown as SingletonComponent<T>;
}
