import {Component, createRef, h} from 'preact';
import {bind, cn}                from '@utils/preact-utils';
import {Popper}                  from './Popper';
import styles                    from './DropDown.module.scss';

type Props = {
    selected?: number | string;
    items: Array<string> | {[key: string]: string} | Array<[string, string]>;
    onSelect: (index: number | string) => void;
};

export class DropDown extends Component<Props, {}> {
    private readonly popper = createRef<Popper>();

    @bind
    select(index: number | string) {
        return () => {
            this.popper.current?.toggle();
            this.props.onSelect(index);
        };
    }

    render() {
        const {items, selected} = this.props;
        const isEntries = Array.isArray(items) && items[0]?.length === 2;

        // Convert input to key-value pairs
        const entries = (isEntries ? items : Object.entries(items)) as Array<[string, string]>;

        // Use first item if not specified
        const selectedItem = selected === undefined ? entries[0][0] : selected;

        // Currently selected option
        const current = entries.find(v => v[0] === selectedItem);

        if (!current) {
            throw new Error('Failed to resolve currently selected element in dropdown');
        }

        // Available options
        const buttons = [];
        for (const [key, value] of entries) {
            if (key !== selectedItem) {
                buttons.push(
                    <button key={key}
                            onClick={this.select(key)}>
                        {value}
                    </button>
                );
            }
        }

        return (
            <Popper ref={this.popper}
                    button={open =>
                        <button className={cn(styles.button, {
                            [styles.open]: open,
                            [styles.empty]: !buttons.length
                        })}>
                            <span>{current[1]}</span>
                            <bc-icon name="arrow-down"/>
                        </button>
                    }
                    content={
                        <section className={styles.items}>
                            {buttons}
                        </section>
                    }/>
        );
    }
}
