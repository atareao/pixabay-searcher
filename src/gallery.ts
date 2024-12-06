import GObject from 'gi://GObject';
import St from 'gi://St';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import { PixabayImage } from './pixabay.js';
import ImageBox from './imagebox.js';

export default class Gallery extends PopupMenu.PopupBaseMenuItem {
    _box: St.BoxLayout;
    static {
        GObject.registerClass(this);
    }

    constructor({}) {
        super({
            reactive: false,
            can_focus: false,
        });
        this._box = new St.BoxLayout({
            vertical: true,
            reactive: false,
            can_focus: false,
            style_class: 'popup-combobox-item',
        });
        const scrollView = new St.ScrollView({
            reactive: true,
            can_focus: false,
        });
        scrollView.set_column_size(1);
        scrollView.set_row_size(1);
        scrollView.add_child(this._box);
        this.add_child(scrollView);
    }

    setImages(images: PixabayImage[]) {
        this._box.remove_all_children();
        this._box.destroy_all_children();
        images.forEach((image) => {
            this._box.add_child(new ImageBox(image))
        });
    }

}
