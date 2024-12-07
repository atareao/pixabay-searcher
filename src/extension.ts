import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import Indicator from './indicator.js';


export default class MyExtension extends Extension {
    gsettings?: Gio.Settings;
    animationsEnabled: boolean = true;
    _indicator?: PanelMenu.Button;
    _resource?: Gio.Resource;

    enable() {
        const resourcePath = GLib.build_filenamev([
            this.path + '/data',
            'pixabay-searcher.gresource'
        ]);
        console.log(`[PSI] Loading resource: ${resourcePath}`);
        this._resource = Gio.resource_load(resourcePath);
        console.log(`[PSI] Resource: ${this._resource}`);
        Gio.resources_register(this._resource);

        this.gsettings = this.getSettings();
        this._indicator = new Indicator(this);

        // Add the indicator to the panel
        Main.panel.addToStatusArea(this.uuid, this._indicator);
    }

    disable() {
        this.gsettings = undefined;
        this._indicator?.destroy();
        this._indicator = undefined;
        if(this._resource){
            Gio.resources_unregister(this._resource);
        }
    }
}
