import Gio from 'gi://Gio';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';

export function getIcon(icon_name: string): Gio.Icon {
    const path = Extension.lookupByURL(import.meta.url)?.path;
    return Gio.icon_new_for_string(`${path}/icons/${icon_name}.svg`);
}
