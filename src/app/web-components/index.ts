import './bc-icon';
import './bc-tooltip';

/* eslint-disable @typescript-eslint/no-namespace */
declare module 'preact/src/jsx' {
    namespace JSXInternal {
        import HTMLAttributes = JSXInternal.HTMLAttributes;

        // TODO: Custom-element props somewhat don't get recognized by TS :(
        interface IntrinsicElements {
            'bc-icon': HTMLAttributes<IconElement>;
            'bc-tooltip': HTMLAttributes<TooltipElement>;
        }
    }
}
