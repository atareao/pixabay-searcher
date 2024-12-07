import Gio from 'gi://Gio';
export const APP = "pixabay-searcher";

export function getIcon(str: string): Gio.Icon {

    return Gio.Icon.new_for_string(
        `resource:////org/gnome/shell/extensions/${APP}/icons/scalable/categories/${APP}-${str}`
    );
}
