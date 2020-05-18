import {IconElement, TooltipElement} from './typings';
import './bc-icon';
import './bc-tooltip';

/* eslint-disable @typescript-eslint/no-namespace */
declare module 'preact/src/jsx' {
    namespace JSXInternal {
        import HTMLAttributes = JSXInternal.HTMLAttributes;

        interface IntrinsicElements {
            'bc-icon': HTMLAttributes<IconElement> | IconElement;
            'bc-tooltip': HTMLAttributes<TooltipElement> | TooltipElement;
        }
    }
}
