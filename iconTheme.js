import Gio from 'gi://Gio';


export default class IconTheme {
  constructor() {
    this.settings = new Gio.Settings({ schema_id: 'org.gnome.desktop.interface' });
    this._oldIconTheme = this.settings.get_string('icon-theme');
    this._applyIconTheme();
    this._iconThemeSignalID = this.settings.connect('changed::color-scheme', () => this._applyIconTheme());
  }

  _applyIconTheme() {
    let mode = this.settings.get_string('color-scheme');
    let icon_theme = mode == 'prefer-dark' ? 'Papirus-Dark' : 'Papirus-Light';

    this.settings.set_string('icon-theme', icon_theme);
  }

  destroy() {
    this.settings.set_string('icon-theme', this._oldIconTheme);
    this.settings.disconnect(this._iconThemeSignalID);
  }
}
