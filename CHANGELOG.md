# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-11-17

### Added
- Initial release of OpenFortiVPN Status Indicator for GNOME Shell 50.
- Top panel status icon with dynamic color feedback (Green when connected, Red when disconnected).
- Process status polling via `pgrep` for `openfortivpn`.
- Virtual network tunnel interface detection on `/sys/class/net/ppp0`.
- Quick installer script (`install.sh`).
- Project documentation and visual previews.
