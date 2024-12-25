import Adw from 'gi://Adw';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import { ExtensionPreferences,gettext as _ } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';
import DropDownText from './dropdowntext.js';
import FolderBox from './folderbox.js';
import About from './about.js';
interface WindowSettingRegistry {
    _settings: Gio.Settings
}

export default class PixabaySearcherPreferences extends ExtensionPreferences {
    _settings?: Gio.Settings


    override async fillPreferencesWindow(window: Adw.PreferencesWindow & WindowSettingRegistry) {
        this._settings = this.getSettings();

        const iconTheme = Gtk.IconTheme.get_for_display(window.get_display());
        const iconsDirectory = this.dir.get_child('icons').get_path();
        if(iconsDirectory){
            console.log(`Adding ${iconsDirectory} to the icon theme search path`);
            iconTheme.add_search_path(iconsDirectory);
        }

        window.add(this.buildGeneralPage(window));
        window.add(this.buildPixabayPage());
        const about = new About(this);
        window.add(about);
    }

    private buildGeneralPage(window: Adw.PreferencesWindow): Adw.PreferencesPage {
        const generalPage = new Adw.PreferencesPage({
            title: _('General'),
            iconName: 'dialog-information-symbolic',
        });

        const generalInfo = new Adw.PreferencesGroup({
            title: _('General'),
            description: _('Set General Info'),
        });
        generalPage.add(generalInfo);

        const folder = new FolderBox(_("Download folder"), window);
        generalInfo.add(folder);

        const formats = [
            ["no", _("None")], ["png", _("PNG")], ["jpg", _("JPG")],
            ["webp", _("WEBP")]
        ];
        const format = new DropDownText(_("Format"), formats);
        generalInfo.add(format);

        this._settings!.bind('folder', folder, 'folder', Gio.SettingsBindFlags.DEFAULT);
        this._settings!.bind('image-format', format, 'selected', Gio.SettingsBindFlags.DEFAULT);
        return generalPage;
    }
    private buildPixabayPage(): Adw.PreferencesPage {
        const pixabayPage = new Adw.PreferencesPage({
            title: _('Pixabay'),
            iconName: 'dialog-information-symbolic',
        });

        const pixabayInfo = new Adw.PreferencesGroup({
            title: _('Pixabay'),
            description: _('Set Pixabay data'),
        });
        pixabayPage.add(pixabayInfo);

        const apiKey = new Adw.EntryRow({
            title: _('API key'),
        });
        pixabayInfo.add(apiKey);

        const langs = [
            ['cs', _('cs')], ['da', _('da')], ['de', _('de')], ['en', _('en')],
            ['es', _('es')], ['fr', _('fr')], ['id', _('id')], ['it', _('it')],
            ['hu', _('hu')], ['nl', _('nl')], ['no', _('no')], ['pl', _('pl')],
            ['pt', _('pt')], ['ro', _('ro')], ['sk', _('sk')], ['fi', _('fi')],
            ['sv', _('sv')], ['tr', _('tr')], ['vi', _('vi')], ['th', _('th')],
            ['bg', _('bg')], ['ru', _('ru')], ['el', _('el')], ['ja', _('ja')],
            ['ko', _('ko')], ['zh', _('zh')]];
        const lang = new DropDownText(_("Language"), langs);
        pixabayInfo.add(lang);


        const imageTypes = [
            ['all', _('All')],
            ['photo', _('Photo')],
            ['illustration', _('Illustration')],
            ['vector', _('Vector')]];
        const imageType = new DropDownText(_("Image type"), imageTypes);
        pixabayInfo.add(imageType);

        const orientations = [
            ['all', _('All')],
            ['horizontal', _('Horizontal')],
            ['vertical', _('Vertical')]];
        const orientation = new DropDownText(_("Orientation"), orientations);
        pixabayInfo.add(orientation);

        const categories = [
            ['any', _('Any')], ['backgrounds', _('backgrounds')],
            ['fashion', _('fashion')], ['nature', _('nature')],
            ['science', _('science')], ['education', _('education')],
            ['feelings', _('feelings')], ['health', _('health')],
            ['people', _('people')], ['religion', _('religion')],
            ['places', _('places')], ['animals', _('animals')],
            ['industry', _('industry')], ['computer', _('computer')],
            ['food', _('food')], ['sports', _('sports')],
            ['transportation', _('transportation')], ['travel', _('travel')],
            ['buildings', _('buildings')], ['business', _('business')],
            ['music', _('music')]
        ];
        const category = new DropDownText(_("Category"), categories);
        pixabayInfo.add(category);

        const colors = [
            ['any', _('any')], ['grayscale', _('grayscale')],
            ['transparent', _('transparent')], ['red', _('red')],
            ['orange', _('orange')], ['yellow', _('yellow')],
            ['green', _('green')], ['turquoise', _('turquoise')],
            ['blue', _('blue')], ['lilac', _('lilac')], ['pink', _('pink')],
            ['white', _('white')], ['gray', _('gray')], ['black', _('black')],
            ['brown', _('brown')] 
        ];
        const color = new DropDownText(_("Color"), colors);
        pixabayInfo.add(color);

        const orders = [
            ['popular', _('Popular')],
            ['latest', _('Latest')]
        ];
        const order = new DropDownText(_("Order"), orders);
        pixabayInfo.add(order);


        this._settings!.bind('pixabay-api-key', apiKey, 'text', Gio.SettingsBindFlags.DEFAULT);
        this._settings!.bind('lang', lang, 'selected', Gio.SettingsBindFlags.DEFAULT);
        this._settings!.bind('image-type', imageType, 'selected', Gio.SettingsBindFlags.DEFAULT);
        this._settings!.bind('orientation', orientation, 'selected', Gio.SettingsBindFlags.DEFAULT);
        this._settings!.bind('category', category, 'selected', Gio.SettingsBindFlags.DEFAULT);
        this._settings!.bind('color', color, 'selected', Gio.SettingsBindFlags.DEFAULT);
        this._settings!.bind('order', order, 'selected', Gio.SettingsBindFlags.DEFAULT);

        return pixabayPage;
    }
}
