import Gio from 'gi://Gio';


export default class GnomeTheme {
  constructor() {
    this.settings = new Gio.Settings({ schema_id: 'org.gnome.desktop.interface' });
    this._oldIconTheme = this.settings.get_string('icon-theme');
    this._legacyGtkTheme = this.settings.get_string('gtk-theme');
    this._applyTheme();
    this._iconThemeSignalID = this.settings.connect('changed::color-scheme', () => this._applyTheme());
  }

  _applyTheme() {
    let mode = this.settings.get_string('color-scheme');
    let icon_theme = mode == 'prefer-dark' ? 'Papirus-Dark' : 'Papirus-Light';
    let gtk_theme = mode == 'prefer-dark' ? 'Adwaita-dark' : 'Adwaita';

    this.settings.set_string('icon-theme', icon_theme);
    this.settings.set_string('gtk-theme', gtk_theme);
  }

  destroy() {
    this.settings.set_string('icon-theme', this._oldIconTheme);
    this.settings.set_string('gtk-theme', this._legacyGtkTheme);
    this.settings.disconnect(this._iconThemeSignalID);
  }
}
