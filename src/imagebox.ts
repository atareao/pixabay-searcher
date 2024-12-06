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
            height: 150,
            x_expand: true,
            y_expand: false,
            styleClass: "ImageBox",
            reactive: true,
            can_focus: true,
            track_hover: true,
        });
        const gicon = Gio.icon_new_for_string(image.previewURL);
        const icon = new St.Icon({
            gicon: gicon,
            width: image.previewWidth,
            height: image.previewHeight,
            x_align: Clutter.ActorAlign.CENTER,
            y_align: Clutter.ActorAlign.CENTER,
            x_expand: true,
            styleClass: "Image",
        });
        const container = new Clutter.Actor({
            width: 150,
            height: 150,
            x_expand: true,
            x_align: Clutter.ActorAlign.START,
            y_align: Clutter.ActorAlign.CENTER,
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
          x_expand: false,
          x_align: Clutter.ActorAlign.END,
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

