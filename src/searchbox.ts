import GObject from 'gi://GObject';
import St from 'gi://St';
import Clutter from 'gi://Clutter';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import { getIcon } from './utils.js';

export default class SearchBox extends PopupMenu.PopupBaseMenuItem {
    private _entry: St.Entry;
    static {
        GObject.registerClass({
            Signals: {
                'new-search': {
                    param_types: [GObject.TYPE_STRING],
                },
            },
        },
        this);
    }

    constructor(){
        super({
            reactive: false,
        });
        this.connect('key-release-event', async (entry, event) => {
            if(event.get_key_symbol() === Clutter.KEY_Return){
                this.emit('new-search', entry.get_text());
            }
        });
        const vbox = new St.BoxLayout({
            vertical: true,
            style_class: 'popup-combobox-item',
        });
        this._entry = new St.Entry({
            name: 'searchEntry',
            styleClass: "search-entry",
            width: 300,
            can_focus: true,
            hint_text: "Type here to search...",
            track_hover: true,
            x_expand: true,
        });
        this._entry.connect('key-release-event', async (entry, event) => {
            if(event.get_key_symbol() === Clutter.KEY_Return){
                this.emit('new-search', entry.get_text());
            }
        });
        vbox.add_child(this._entry);
        this.add_child(vbox);
    }

    getText(): string {
        return this._entry.get_text();
    }

}
