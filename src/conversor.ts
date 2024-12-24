import GLib from 'gi://GLib';
import Gio from 'gi://Gio';

Gio._promisify(Gio.Subprocess.prototype, 'communicate_utf8_async',
    'communicate_utf8_finish');

function execCommand(argv: string[], cancellable: Gio.Cancellable | null = null) {
    const proc = new Gio.Subprocess({
        argv: argv,
        flags: Gio.SubprocessFlags.STDOUT_PIPE |
               Gio.SubprocessFlags.STDERR_PIPE
    });
    proc.init(cancellable);

    return new Promise((resolve, reject) => {
        proc.communicate_utf8_async(null, cancellable, (proc, res) => {
            try {
                resolve(proc?.communicate_utf8_finish(res)[1]);
            } catch (e) {
                reject(e);
            }
        });
    });
}

export default class Conversor {
    static async convert(source: string, extension: string, cancellable: Gio.Cancellable) {
        const magick = GLib.find_program_in_path('magick');
        if(magick === null){
            throw new Error('ImageMagick not found');
        }
        const pattern = new RegExp(`\..*$`);
        const destination = source.replace(pattern, `.${extension}`)
        return await execCommand([magick, source, destination], cancellable);
    }
}

