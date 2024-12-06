import Gio from 'gi://Gio';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import Indicator from './indicator.js';


export default class MyExtension extends Extension {
    gsettings?: Gio.Settings;
    animationsEnabled: boolean = true;
    _indicator?: PanelMenu.Button;

    enable() {
        this.gsettings = this.getSettings();
        this._indicator = new Indicator(this);

        // Add the indicator to the panel
        Main.panel.addToStatusArea(this.uuid, this._indicator);
    }

    disable() {
        this.gsettings = undefined;
        this._indicator?.destroy();
        this._indicator = undefined;
    }
}
