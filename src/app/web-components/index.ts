import './bc-icon/bc-icon';

/* eslint-disable @typescript-eslint/no-namespace */
declare module 'preact/src/jsx' {
    namespace JSXInternal {
        import HTMLAttributes = JSXInternal.HTMLAttributes;

        interface IntrinsicElements {
            'bc-icon': HTMLAttributes<CheckBoxElement>;
        }
    }
}
