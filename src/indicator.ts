import GObject from 'gi://GObject';
import St from 'gi://St';
import Gio from 'gi://Gio';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import { Pixabay } from './pixabay.js';
import Gallery from './gallery.js';
import Pager from './pager.js';
import SearchBox from './searchbox.js'
import { getIcon } from './utils.js';

export default class Indicator extends PanelMenu.Button {
    _extension: Extension;
    _pixabay: Pixabay;
    _gallery: Gallery;
    _pager: Pager;
    _searchBox: SearchBox;
    _search: string = "";
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
            gicon: getIcon('pixabay-symbolic'),
            style_class: 'system-status-icon',
        });
        this.add_child(icon);
        extension.getSettings().connect('changed', () => {
            const apiKey = extension.getSettings().get_string("pixabay-api-key");
            const lang = extension.getSettings().get_string("lang");
            console.log(`[PSI] Settings changed: ${apiKey} - ${lang}`);
            this._pixabay = new Pixabay(apiKey, lang);
        });
        this._pager = new Pager(1);
        this._searchBox = new SearchBox();
        (this.menu as PopupMenu.PopupMenu).addMenuItem(this._searchBox);
        (this.menu as PopupMenu.PopupMenu).addMenuItem(this._pager);
        (this.menu as PopupMenu.PopupMenu).addMenuItem(this._gallery);

        this._searchBox.connect('new-search', async (_entry, text) => {
            console.log(`[PSI] Searching for: ${text}`);
            if(text == this._search){
                this._pager.incPage();
            }else{
                this._pager.reset();
                this._search = text;
            }
            await this.search(text);
        });

        this._pager.connect('page-changed', async () => {
            const searchText = this._searchBox.getText();
            await this.search(searchText);
        });
    }

    private async search(searchText: string): Promise<void> {
            console.log(`[PSI] Searching for: ${searchText}`);
            const page = this._pager.getPage();
            const imageType = this._extension.getSettings().get_string("image-type");
            const orientation = this._extension.getSettings().get_string("orientation");
            const category = this._extension.getSettings().get_string("category");
            const color = this._extension.getSettings().get_string("color");
            const order = this._extension.getSettings().get_string("order");
            const response = await this._pixabay.search(
                searchText, page, imageType, orientation, order, category,
                color, new Gio.Cancellable());
            if(response != null) {
                this._pager.setPages(Math.ceil(response.totalHits / 20));
                console.log(`[PSI] Found: ${response.totalHits}`);
                this._gallery.setImages(response.hits);
            }
    }
}
