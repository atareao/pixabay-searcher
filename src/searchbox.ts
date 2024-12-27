import GObject from 'gi://GObject';
import St from 'gi://St';
import Clutter from 'gi://Clutter';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

export default class SearchBox extends PopupMenu.PopupBaseMenuItem {
    private _icon: St.Icon;
    private _entry: St.Entry;
    private _transition: Clutter.PropertyTransition;
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
            vertical: false,
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
        this._icon = new St.Icon({
            icon_name: 'edit-find-symbolic',
            style_class: 'popup-menu-icon',
        });
        this._entry.set_secondary_icon(this._icon);

        this._transition = Clutter.PropertyTransition.new('opacity');
        this._transition.set_from(0);
        this._transition.set_to(255);
        this._transition.set_duration(500);
        this._transition.set_auto_reverse(true);
        this._transition.set_repeat_count(-1);
        this._transition.set_progress_mode(Clutter.AnimationMode.EASE_IN_OUT_SINE);
        vbox.add_child(this._entry);
        this.add_child(vbox);
    }

    play(): void {
        this._icon.remove_transition("testTransition");
        this._icon.add_transition("testTransition", this._transition);
    }

    stop(): void {
        this._icon.remove_transition("testTransition");
        this._icon.opacity = 255;
    }

    getText(): string {
        return this._entry.get_text();
    }

}
