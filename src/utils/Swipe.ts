import {createNativeEventContainer, simplifyEvent} from './events';
import {EventTarget}                               from './polyfills/EventTarget';

export type SwipeOptions = {
    activationThreshold?: number;
    cancelThreshold?: number;
    swipeThreshold?: number;
    target?: Node;
};

export type SwipeDirection = 'left' | 'right' | 'none';
export type SwipeEventName = 'start' | 'snap' | 'cancel' | 'swipe';

export class SwipeEvent extends Event {
    public readonly dir: SwipeDirection;
    public readonly amount: number;

    constructor(
        event: SwipeEventName,
        dir: SwipeDirection = 'none',
        amount = 0
    ) {
        super(event);
        this.dir = dir;
        this.amount = amount;
    }
}

// I'm aware of https://github.com/nolimits4web/swiper but this framework is way to bloated
export class Swipe extends EventTarget {
    private readonly _events = createNativeEventContainer();
    public state: SwipeEventName | 'idle' = 'idle';
    public dragging = false;

    constructor(
        {
            activationThreshold = 10,
            cancelThreshold = 0.2,
            swipeThreshold = 15,
            target = document
        }: SwipeOptions = {}
    ) {
        super();

        let active = false;
        let sx = 0, sy = 0, offset = 0;

        this._events.on(target, [
            'touchstart',
            'touchmove',
            'touchcancel',
            'touchend'
        ], (e: TouchEvent) => {
            switch (e.type) {
                case 'touchstart': {
                    const s = simplifyEvent(e);
                    sx = s.x;
                    sy = s.y;
                    break;
                }
                case 'touchmove': {
                    const {x, y} = simplifyEvent(e);
                    offset = ((x - sx) / window.innerWidth) * 100;

                    if (!(this.dragging || Math.abs(offset) > activationThreshold)) {
                        return;
                    }

                    this.dragging = true;
                    if (!active) {
                        sx = x;
                        active = true;
                        this.emit(new SwipeEvent('start'));
                        return;
                    }

                    const dir = offset < 0 ? 'left' : 'right';
                    this.emit(new SwipeEvent('swipe', dir, offset));

                    // User may scroll
                    if (Math.abs(sy - y) / window.innerWidth > cancelThreshold) {
                        this.dragging = false;
                        this.emit(new SwipeEvent('cancel'));
                    }
                    break;
                }
                case 'touchcancel':
                case 'touchend': {
                    if (this.dragging) {
                        this.dragging = false;
                        active = false;

                        const dir = offset < 0 ? 'left' : 'right';
                        if (Math.abs(offset) > swipeThreshold) {
                            this.emit(new SwipeEvent('snap', dir, offset));
                        } else {
                            this.emit(new SwipeEvent('cancel', dir, offset));
                        }
                    }
                }
            }
        }, {passive: true});
    }

    public destroy() {
        this._events.unbind();
    }
}
