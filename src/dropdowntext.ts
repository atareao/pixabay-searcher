import Adw from 'gi://Adw';
import Gtk from 'gi://Gtk';
import GObject from 'gi://GObject';

export default class DropDownText extends Adw.ActionRow {
    static {
        GObject.registerClass({
            Properties: {
                'selected': GObject.ParamSpec.string(
                    'selected',
                    'Selected',
                    'A read-write string property',
                    GObject.ParamFlags.READWRITE,
                    "" 
                ),
            },
        }, this);
    }
    _items: string[][];
    _selected?: string;
    _combo: Gtk.DropDown;

    constructor(title: string, items: string[][]) {
        super({ title: title });
        this._items = items;
        const values = items.map((item) => item[1]);
        this._combo = Gtk.DropDown.new_from_strings(values);
        this._combo.connect('notify::selected-item', (sw) => {
            const selected = sw.get_selected();
            if(this._selected != selected) {
                this._selected = items[selected][0];
                this.notify("selected");
            }
        });
        this.add_suffix(this._combo);
    }

    private getKey(position: number): string {
        return this._items[position][0];
    }

    private getValue(position: number): string {
        return this._items[position][1];
    }


    private getPosition(key: string): number {
        for(let item of this._items){
            if(item[0] == key){
                return this._items.indexOf(item);
            }
        }
        return 1
    }

    get selected(): string | null {
        return this._combo ? this.getKey(this._combo.get_selected()) : null;
    }

   set selected(item: string) {
        const position = this.getPosition(item);
        if (position && this._combo) {
            const model = this._combo.get_model();
            if (model &&
                position != this._combo.get_selected() &&
                position >= 0 &&
                position < model.get_n_items()
            ) {
                this._combo.set_selected(position);
                this._selected = item;
                this.notify('selected');
            }
        }
    }

    getSelectedItem(): string | null {
        return this._combo ? this.getValue(this._combo.get_selected()) : null;
    }
}
