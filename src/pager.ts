import GObject from 'gi://GObject';
import St from 'gi://St';
import Clutter from 'gi://Clutter';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import { debug, getIcon } from './utils.js';

export default class Pager extends PopupMenu.PopupBaseMenuItem {
    static {
        GObject.registerClass({
            Signals: {
                'page-changed': {
                    param_types: [GObject.TYPE_INT],
                },
            },
        }, this);
    }
    _page: number = 1;
    _pages: number = 1;
    _leftButton: St.Button;
    _rightButton: St.Button;
    _entry: St.Entry;
    constructor(pages: number) {
        super({
            reactive: false,
            can_focus: false,
        });
        const main = new St.BoxLayout({
            vertical: false,
            style_class: 'popup-combobox-item',
            reactive: false,
            can_focus: false,
            x_expand: true,
            y_expand: true,
            x_align: Clutter.ActorAlign.CENTER,
            y_align: Clutter.ActorAlign.CENTER,
        });
        this.add_child(main);
        this._leftButton = new St.Button({
            reactive: true,
            can_focus: false,
            track_hover: true,
            child: new St.Icon({
                gicon: getIcon("left-small-symbolic"),
                icon_size: 24,
                style_class: 'system-status-icon',
            }),
            x_expand: true,
            y_expand: true,
            x_align: Clutter.ActorAlign.CENTER,
            y_align: Clutter.ActorAlign.CENTER,
            styleClass: "LeftButton",
        });
        this._leftButton.connect('clicked', () => {
            this.setPage(this._page - 1);
        });
        this._rightButton = new St.Button({
            reactive: true,
            can_focus: false,
            track_hover: true,
            child: new St.Icon({
                gicon: getIcon("right-small-symbolic"),
                icon_size: 24,
                style_class: 'system-status-icon',
            }),
            x_expand: true,
            y_expand: true,
            x_align: Clutter.ActorAlign.CENTER,
            y_align: Clutter.ActorAlign.CENTER,
            styleClass: "RightButton",
        });
        this._rightButton.connect('clicked', () => {
            this.setPage(this._page + 1);
        });
        this._entry = new St.Entry({
            reactive: false
        });
        main.add_child(this._leftButton);
        main.add_child(this._entry);
        main.add_child(this._rightButton);
        this.setPages(pages);
    }
    getPage() {
        return this._page;
    }
    reset() {
        this._page = 1;
        this._pages = 1;
        this._leftButton.set_reactive(false);
        this._rightButton.set_reactive(false);
    }

    incPage() {
        this.setPage(this._page + 1);
    }

    setPage(page: number) {
        debug(`[PSI] Setting page: ${page}`);
        const oldPage = this._page;
        this._page = page;
        if (this._page <= 1) {
            this._page = 1;
            this._leftButton.set_opacity(80);
            this._leftButton.set_reactive(false);
        } else {
            this._leftButton.set_opacity(255);
            this._leftButton.set_reactive(true);
        }
        if (this._page >= this._pages) {
            this._page = this._pages;
            this._rightButton.set_opacity(80);
            this._rightButton.set_reactive(false);
        } else {
            this._rightButton.set_opacity(255);
            this._rightButton.set_reactive(true);
        }
        this._entry.set_text(this._page.toString());
        if (oldPage != this._page) {
            debug(`[PSI] Page changed: ${this._page}`);
            this.emit('page-changed', this._page);
        }
    }
    setPages(pages: number) {
        debug(`[PSI] Setting pages: ${pages}`);
        this._pages = pages;
        this.setPage(this._page);
    }

    setEnable(enable: boolean) {
        this._leftButton.set_reactive(enable);
        this._rightButton.set_reactive(enable);
    }
}
