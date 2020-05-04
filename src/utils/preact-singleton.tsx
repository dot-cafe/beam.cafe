import {Component, ComponentConstructor, createRef, h} from 'preact';
import {JSXInternal}                                   from 'preact/src/jsx';

export type SingletonComponent<T> = {
    getInstance(): T;
    getElement(): JSXInternal.Element;
} & T;

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
    const element = <Component ref={ref}/>;

    Object.defineProperty(target, 'getInstance', {
        value: () => ref.current
    });

    Object.defineProperty(target, 'getElement', {
        value: () => element
    });

    return target as SingletonComponent<T>;
}
