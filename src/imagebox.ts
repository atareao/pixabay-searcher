import GObject from 'gi://GObject';
import St from 'gi://St';
import Gio from 'gi://Gio';
import Clutter from 'gi://Clutter';
import * as MessageTray from 'resource:///org/gnome/shell/ui/messageTray.js';
import { Pixabay, PixabayImage } from './pixabay.js';
import Conversor from './conversor.js';

export default class ImageBox extends St.BoxLayout {
    static {
        GObject.registerClass(this);
    }
    _format: string;
    _directory: string;
    constructor(image: PixabayImage, format: string, directory: string) {
        super({
            vertical: false,
            //height: 150,
            x_expand: true,
            y_expand: false,
            styleClass: "ImageBox",
            reactive: true,
            can_focus: true,
            track_hover: true,
        });
        this._format = format;
        this._directory = directory
        const gicon = Gio.icon_new_for_string(image.previewURL);
        const size = image.previewWidth > image.previewHeight?image.previewWidth:image.previewHeight;
        const icon = new St.Icon({
            gicon: gicon,
            //width: image.previewWidth,
            //height: image.previewHeight,
            icon_size: size,
            x_align: Clutter.ActorAlign.CENTER,
            y_align: Clutter.ActorAlign.CENTER,
            x_expand: true,
            styleClass: "Image",
        });
        const container = new Clutter.Actor({
            width: size,
            height: size,
            /*
            width: 150,
            height: 150,
            */
            x_expand: true,
            x_align: Clutter.ActorAlign.CENTER,
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
            const file = await Pixabay.download(image, new Gio.Cancellable());
            if(!file){
                this._createNotification("Pixabay Searcher", "Can NOT download image");
                return;
            }
            this._createNotification("Pixabay Searcher", `Downloaded image ${file}`);
            if(this._format === "PNG" && !file.endsWith(".png")){
                const response = Conversor.convert(file, "png", new Gio.Cancellable());
                console.log(response);
                Gio.File.new_for_path(file).delete(null);
                this._createNotification("Pixabay Searcher", `Saved image as PNG`);
            }else if(this._format === "JPG" && !file.endsWith(".jpg")){
                const response = Conversor.convert(file, "jpg", new Gio.Cancellable());
                console.log(response);
                Gio.File.new_for_path(file).delete(null);
                this._createNotification("Pixabay Searcher", `Saved image as JPG`);
            }
        });
        this.add_child(downloadButton);
    }

    _createNotification(title: string, body: string) {
        const systemSource = MessageTray.getSystemSource();
        const notification = new MessageTray.Notification({
            source: systemSource,
            title: title,
            body: body,
            gicon: new Gio.ThemedIcon({name: 'image-x-generic'}),
            iconName: 'image-x-generic',
        });
        systemSource.addNotification(notification);
    }
}

