import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import St from 'gi://St';

import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';

const REFRESH_SECONDS = 3;
const INTERFACE_PATH = '/sys/class/net/ppp0';
const PgrepPath = '/usr/bin/pgrep';

export default class OpenFortiVPNIndicator extends Extension {
    enable() {
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

    _isProcessRunning() {
        try {
            const [, , , waitStatus] = GLib.spawn_sync(
                null,
                [PgrepPath, '-x', 'openfortivpn'],
                null,
                GLib.SpawnFlags.SEARCH_PATH,
                null
            );
            return waitStatus === 0;
        } catch (error) {
            console.error(`OpenFortiVPN Indicator: unable to check process: ${error}`);
            return false;
        }
    }

    _hasTunnelInterface() {
        return Gio.File.new_for_path(INTERFACE_PATH).query_exists(null);
    }

    _update() {
        const connected = this._isProcessRunning() && this._hasTunnelInterface();

        this._icon.set_style(
            connected
                ? 'color: #2ec27e;'
                : 'color: #e1151d;'
        );
        this._icon.icon_name = connected
            ? 'network-vpn-symbolic'
            : 'network-vpn-symbolic';
    }

    disable() {
        if (this._timeoutId) {
            GLib.Source.remove(this._timeoutId);
            this._timeoutId = null;
        }

        if (this._button) {
            this._button.destroy();
            this._button = null;
            this._icon = null;
        }
    }
}
