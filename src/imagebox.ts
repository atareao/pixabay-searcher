import GObject from 'gi://GObject';
import St from 'gi://St';
import Gio from 'gi://Gio';
import Clutter from 'gi://Clutter';
import { Pixabay, PixabayImage } from './pixabay.js';

export default class ImageBox extends St.BoxLayout {
    static {
        GObject.registerClass(this);
    }
    constructor(image: PixabayImage) {
        super({
            vertical: false,
            style_class: 'popup-combobox-item',
            height: 150,
            width: 200,
        });
        const gicon = Gio.icon_new_for_string(image.previewURL);
        console.log("[PSI]", `${image.previewWidth}x${image.previewHeight}`);
        const icon = new St.Icon({
            gicon: gicon,
            width: image.previewWidth,
            height: image.previewHeight,
        });
        const container = new Clutter.Actor({
            width: 150,
            height: 150,
        });
        container.add_child(icon);
        this.add_child(container);
        const downloadButton = new St.Button({
            reactive: true,
            can_focus: true,
            track_hover: true,
          child: new St.Icon({
            icon_name: "folder-download-symbolic",
            icon_size: 16,
          }),
          x_expand: true,
          y_expand: true,
          x_align: Clutter.ActorAlign.CENTER,
          y_align: Clutter.ActorAlign.CENTER,
          styleClass: "DownloadButton",
        });
        downloadButton.connect('clicked', async () => {
            console.log(`[PSI] Downloading: ${image.tags}`);
            console.log(`[PSI] Downloading: ${image.imageURL}`);
            console.log(`[PSI] Downloading: ${image.id}`);
            await Pixabay.download(image, new Gio.Cancellable());
        });
        this.add_child(downloadButton);
    }
}

