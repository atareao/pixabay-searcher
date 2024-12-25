import Adw from 'gi://Adw';
import Gtk from 'gi://Gtk';
import Gio from 'gi://Gio';
import GObject from 'gi://GObject';

export default class FolderBox extends Adw.ActionRow {
    static {
        GObject.registerClass({
            Properties: {
                'folder': GObject.ParamSpec.string(
                    'folder',
                    'folder',
                    'A read-write string property',
                    GObject.ParamFlags.READWRITE,
                    "" 
                ),
            },
        }, this);
    }
    _folder?: string | null;
    _button: Gtk.Button;

    constructor(title: string, window: Gtk.Window) {
        super({ title: title });
        this._button = Gtk.Button.new_with_label("Select folder");
        this._button.connect('clicked', () => {
            console.log('[PSI]', 'button clicked');

            const dialog = new Gtk.FileDialog();
            console.log('[PSI]', `dialog created: ${dialog}`);
            if(this._folder){
                dialog.set_initial_folder(Gio.File.new_for_path(this._folder))
            }
            dialog.select_folder(
                window,
                new Gio.Cancellable(),
                (source, result) => {
                    console.log('[PSI]', 'select_folder callback');
                    console.log('[PSI]', `source: ${source}`);
                    console.log('[PSI]', `result: ${result}`);
                    if(source){
                        const selected = source.select_folder_finish(result);
                        if(selected){
                            const folder = selected.get_path();
                            if(folder){
                                this._folder = folder;
                                this._button.set_label(this._folder);
                                this.notify("folder");
                            }
                        }
                    }
                });
        });
        this.add_suffix(this._button);
    }

    get folder(): string | null {
        if(this._folder){
            return this._folder;
        }
        return null;
    }

    set folder(folder: string) {
        this._folder = folder;
        this._button.set_label(this._folder);
        this.notify("folder");
    }
}
