import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import St from 'gi://St';

import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';

const REFRESH_SECONDS = 3;
const INTERFACE_PATH = '/sys/class/net/ppp0';

export default class OpenFortiVPNIndicator extends Extension {
    enable() {
        this._cancellable = new Gio.Cancellable();

        this._button = new PanelMenu.Button(0.0, 'OpenFortiVPN Indicator', true);
        this._icon = new St.Icon({
            icon_name: 'network-vpn-symbolic',
            style_class: 'system-status-icon',
        });
        this._button.add_child(this._icon);
        Main.panel.addToStatusArea('openfortivpn-indicator', this._button, 1, 'right');

        this._update();
        this._timeoutId = GLib.timeout_add_seconds(
            GLib.PRIORITY_DEFAULT,
            REFRESH_SECONDS,
            () => {
                this._update();
                return GLib.SOURCE_CONTINUE;
            }
        );
    }

    _checkProcessAsync() {
        return new Promise(resolve => {
            try {
                const proc = new Gio.Subprocess({
                    argv: ['pgrep', '-x', 'openfortivpn'],
                    flags: Gio.SubprocessFlags.NONE,
                });
                proc.init(this._cancellable);
                proc.wait_check_async(this._cancellable, (source, res) => {
                    try {
                        resolve(source.wait_check_finish(res));
                    } catch {
                        resolve(false);
                    }
                });
            } catch {
                resolve(false);
            }
        });
    }

    _hasTunnelInterface() {
        return Gio.File.new_for_path(INTERFACE_PATH).query_exists(null);
    }

    async _update() {
        const processRunning = await this._checkProcessAsync();
        const tunnelActive = this._hasTunnelInterface();
        const connected = processRunning && tunnelActive;

        if (!this._icon)
            return;

        this._icon.set_style(
            connected
                ? 'color: #2ec27e;'
                : 'color: #e1151d;'
        );
    }

    disable() {
        if (this._timeoutId) {
            GLib.Source.remove(this._timeoutId);
            this._timeoutId = null;
        }

        if (this._cancellable) {
            this._cancellable.cancel();
            this._cancellable = null;
        }

        if (this._icon) {
            this._icon.destroy();
            this._icon = null;
        }

        if (this._button) {
            this._button.destroy();
            this._button = null;
        }
    }
}
