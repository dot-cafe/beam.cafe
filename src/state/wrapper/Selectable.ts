import {clearArray, nearestElementIndex} from '@utils/array';
import {action, computed, observable}    from 'mobx';

export class Selectable<T> {

    // We can't use Set as we need the index of an element
    @observable private readonly selected: Array<T> = [];

    @computed
    get selectedItems(): Array<T> {
        return [...this.selected];
    }

    @computed
    get selectedAmount(): number {
        return this.selected.length;
    }

    @action
    public selectViaMouseEvent(ev: MouseEvent, item: T, subset: Array<T>) {
        const index = subset.indexOf(item);

        // Range selection
        if ((ev.ctrlKey || ev.metaKey)) {
            if (ev.shiftKey) {

                if (index === -1) {
                    return;
                }

                // Resolve nearest element
                const nextOffset = nearestElementIndex(subset, index, v => this.isSelected(v));

                if (~nextOffset) {
                    const [begin, end] = nextOffset > index ? [index, nextOffset] : [nextOffset, index];
                    this.select(...subset.slice(begin, end + 1));
                }
            } else {
                this.toggleSelect(item);
            }
        } else {
            const {selected} = this;

            // If there are more than one items selected and the clicked
            // element is already part of the selection - unselect just the others.
            if (selected.length === 1 && selected.includes(item)) {
                this.clearSelection();
            } else {
                this.clearSelection();
                this.select(item);
            }
        }
    }

    @action
    public clearSelection(): void {
        clearArray(this.selected);
    }

    @action
    public select(...items: Array<T>): void {
        for (const item of items) {
            if (!this.selected.includes(item)) {
                this.selected.push(item);
            }
        }
    }

    @action
    public unselect(...items: Array<T>): void {
        for (const item of items) {
            const index = this.selected.indexOf(item);

            if (~index) {
                this.selected.splice(index, 1);
            }
        }
    }

    @action
    public toggleSelect(...items: Array<T>): void {
        for (const item of items) {
            const index = this.selected.indexOf(item);

            if (~index) {
                this.selected.splice(index, 1);
            } else {
                this.selected.push(item);
            }
        }
    }


    public isSelected(item: T): boolean {
        return this.selected.includes(item);
    }
}
