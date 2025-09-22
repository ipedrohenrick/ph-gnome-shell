/* TrayIconsSize
 * 
 * set size for height padding in RightBoxIconsSize
 *
 * inspired in https://extensions.gnome.org/extension/355/status-area-horizontal-spacing
 */

import * as Main from 'resource:///org/gnome/shell/ui/main.js';


export default class TrayIcons {
  constructor() {
    this.customTrayIconsStyle = '-natural-hpadding: 6px; ';
    this.buttonsToIgnore = [
      'a11y',
      'activities',
      'dateMenu',
      'dwellClick',
      'quickSettings',
      'screenRecording',
      'screenSharing',
    ];

    // apply style to statusArea buttons
    for (let key in Main.panel.statusArea) {
      if (this.buttonsToIgnore.includes(key)) continue;
      this.setTrayIconStyle(Main.panel.statusArea[key]);
    }

    // apply style and reorder new icons
    this.actorAddedID = Main.panel._rightBox.connect('child-added', (container, actor) => {
      for (let key in this.buttonsToIgnore) {
        if (actor === Main.panel.statusArea[key]) return;
      }
      this.setTrayIconStyle(actor);
    });
  }

  _refreshIcon(actor) {
    // necessary for gnome to apply the style
    let oldActorClass = actor.get_style_class_name();
    actor.set_style_class_name('sou-foda-apenas');
    actor.set_style_class_name(oldActorClass);
  }

  getPanelButton(actor, secondDiv = false) {
    // gets the child object of the icon if it does not have the panel-button class
    if (!actor.has_style_class_name || !actor.has_style_class_name('panel-button')) {
      if (secondDiv) return;
      return this.getPanelButton(actor.get_children()[0], true);
    }
    return actor;
  }

  setTrayIconStyle(actor) {
    actor = this.getPanelButton(actor);
    if (actor) {
      if (actor._original_inline_style_ === undefined) {
        actor._original_inline_style_ = actor.get_style();
      }
      actor.set_style(this.customTrayIconsStyle + (actor._original_inline_style_ || ''));
      this._refreshIcon(actor);
    }
  }

  destroy() {
    for (let key in Main.panel.statusArea) {
      if (this.buttonsToIgnore.includes(key)) continue;
      let actor = this.getPanelButton(Main.panel.statusArea[key]); 
      if (actor) {
        if (actor._original_inline_style_ !== undefined) {
          actor.set_style(actor._original_inline_style_);
          delete actor._original_inline_style_;
        }

        if (actor._styleChangedSignalID) {
          actor.disconnect(actor._styleChangedSignalID);
          delete actor._styleChangedSignalID;
        }
        this._refreshIcon(actor);
      }
    }
    Main.panel._rightBox.disconnect(this.actorAddedID);
  }
}
