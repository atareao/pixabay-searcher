import GObject from 'gi://GObject';
import St from 'gi://St';
import Gio from 'gi://Gio';
import Clutter from 'gi://Clutter';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import { Pixabay } from './pixabay.js';
import Gallery from './gallery.js';
import ImageBox from './imagebox.js';

export default class Indicator extends PanelMenu.Button {
    _extension: Extension;
    _pixabay: Pixabay;
    _gallery: Gallery;
    _page: number = 1;
    _pages: number = 1;
    static {
        GObject.registerClass(this);
    }
    constructor(extension: Extension) {
        super(0.0, extension.metadata.name, false);
        this._extension = extension;
        const apiKey = extension.getSettings().get_string("pixabay-api-key");
        const lang = extension.getSettings().get_string("lang");
        this._pixabay = new Pixabay(apiKey, lang);
        this._gallery = new Gallery({});

        const icon = new St.Icon({
            icon_name: 'face-laugh-symbolic',
            style_class: 'system-status-icon',
        });
        this.add_child(icon);
        extension.getSettings().connect('changed', () => {
            const apiKey = extension.getSettings().get_string("pixabay-api-key");
            const lang = extension.getSettings().get_string("lang");
            console.log(`[PSI] Settings changed: ${apiKey} - ${lang}`);
            this._pixabay = new Pixabay(apiKey, lang);
        });
        (this.menu as PopupMenu.PopupMenu).addMenuItem(this._getEntry());
        (this.menu as PopupMenu.PopupMenu).addMenuItem(this._gallery);
    }

    private _getEntry(): PopupMenu.PopupBaseMenuItem {
        const menuItem = new PopupMenu.PopupBaseMenuItem({
            reactive: false,
        });
        const vbox = new St.BoxLayout({
            vertical: true,
            style_class: 'popup-combobox-item',
        });
        const hbox = new St.BoxLayout({
            vertical: false,
            style_class: 'popup-combobox-item',
        });
        const searchEntry = new St.Entry({
            name: 'searchEntry',
            styleClass: "search-entry",
            width: 200,
            can_focus: true,
            hint_text: "Type here to search...",
            track_hover: true,
            x_expand: true,
        });
        hbox.add_child(searchEntry);
        const searchButton = new St.Button({
          reactive: true,
          can_focus: true,
          track_hover: true,
          toggle_mode: true,
          child: new St.Icon({
            icon_name: "edit-find-symbolic",
            icon_size: 16,
          }),
          x_expand: true,
          x_align: Clutter.ActorAlign.CENTER,
          marginLeft: 30,
          styleClass: "SearchButton",
        });
        searchButton.connect('clicked', async () => {
            const searchText = searchEntry.get_text();
            console.log(`[PSI] Searching for: ${searchText}`);
            const response = await this._pixabay.search(searchText, this._page, new Gio.Cancellable());
            if(response != null) {
                this._pages = Math.ceil(response.totalHits / 20);
                console.log(`[PSI] Found: ${response.totalHits}`);
                this._gallery.setImages(response.hits);
            }
        });
        hbox.add_child(searchButton);
        vbox.add_child(hbox);
        menuItem.add_child(vbox);
        return menuItem;
    }

}
