import GLib from 'gi://GLib';
import Gio from 'gi://Gio';

Gio._promisify(Gio.Subprocess.prototype, 'communicate_utf8_async',
    'communicate_utf8_finish');

export default class Conversor {
    static async convert(source: string, extension: string, cancellable: Gio.Cancellable) {
        const magick = GLib.find_program_in_path('magick');
        if(magick === null){
            throw new Error('ImageMagick not found');
        }
        const pattern = /\..*$/gm;
        console.log('[PSI]', `pattern: ${pattern}`);
        const destination = source.replace(pattern, `.${extension}`)
        console.log('[PSI]', `from ${source} to ${destination}`);
        const proc = new Gio.Subprocess({
            argv: [magick, source, destination],
            flags: Gio.SubprocessFlags.STDOUT_PIPE |
                Gio.SubprocessFlags.STDERR_PIPE
        });
        proc.init(cancellable);
        const [stdout, stderr] = await proc.communicate_utf8_async(null, cancellable);
        console.log('[PSI]', `stdout ${stdout}`);
        console.log('[PSI]', `stderr ${stderr}`);
        console.log('[PSI]', `successful ${proc.get_successful()}`);
        if(proc.get_successful() && !stderr){
            return destination;
        }
        throw new Error(stderr);
    }
}

