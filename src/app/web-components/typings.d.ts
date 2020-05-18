import {NanoPopPositionCombination} from 'nanopop';

declare interface IconElement extends HTMLElement {
    name: string;
}

declare interface TooltipElement extends HTMLElement {
    content: string;
    pos?: NanoPopPositionCombination;
}
