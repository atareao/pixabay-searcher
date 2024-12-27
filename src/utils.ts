import Gio from 'gi://Gio';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';

export function getIcon(icon_name: string): Gio.Icon {
    const path = Extension.lookupByURL(import.meta.url)?.path;
    return Gio.icon_new_for_string(`${path}/icons/${icon_name}.svg`);
}

export function debug(message: any): void {
    const settings = Extension.lookupByURL(import.meta.url)?.getSettings();
    if (settings?.get_boolean("debug")){
        console.log("[PSI]", message);
    }
}
