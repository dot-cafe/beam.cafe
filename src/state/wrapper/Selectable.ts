import {clearArray}                   from '@utils/array';
import {action, computed, observable} from 'mobx';

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
