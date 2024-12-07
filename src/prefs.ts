import Adw from 'gi://Adw';
import Gtk from 'gi://Gtk';
import Gio from 'gi://Gio';
import { ExtensionPreferences, gettext as _ } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class GnomeRectanglePreferences extends ExtensionPreferences {
  _settings?: Gio.Settings


  override async fillPreferencesWindow(window: Adw.PreferencesWindow) {
    this._settings = this.getSettings();

    const page = new Adw.PreferencesPage({
      title: _('General'),
      iconName: 'dialog-information-symbolic',
    });

    const pixabayInfo = new Adw.PreferencesGroup({
      title: _('Pixabay'),
      description: _('Set Pixabay data'),
    });
    page.add(pixabayInfo);

    const apiKey = new Adw.EntryRow({
      title: _('API key'),
    });
    pixabayInfo.add(apiKey);

    const lang = new Adw.EntryRow({
        title: _('Language'),
    });
    pixabayInfo.add(lang);

    window.add(page)

    this._settings!.bind('pixabay-api-key', apiKey, 'text', Gio.SettingsBindFlags.DEFAULT);
    this._settings!.bind('lang', lang, 'text', Gio.SettingsBindFlags.DEFAULT);
  }
}
