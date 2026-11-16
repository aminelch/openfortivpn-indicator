# Contributing to OpenFortiVPN Status Indicator

Thank you for your interest in contributing! Whether you are reporting a bug, suggesting a feature, or submitting code, your help is appreciated.

---

## Reporting Issues

If you encounter a bug or have an idea for an improvement:
1. Check the [Issues tab](https://github.com/aminelch/openfortivpn-indicator/issues) to ensure it hasn't already been reported.
2. If not, open a new issue describing:
   - Your GNOME Shell version (`gnome-shell --version`).
   - Your Linux distribution and kernel version.
   - The steps to reproduce the issue or expected vs. actual behavior.
   - Any relevant logs obtained via:
     ```bash
     journalctl -f -o cat /usr/bin/gnome-shell
     ```

---

## Submitting Pull Requests

### 1. Fork and Branch
- Fork the repository on GitHub.
- Create a feature branch with a descriptive name:
  ```bash
  git checkout -b feature/my-enhancement
  ```

### 2. Local Development & Testing
- Symlink or copy the repository to your extensions directory:
  ```bash
  ln -s "$(pwd)" ~/.local/share/gnome-shell/extensions/openfortivpn-indicator@aminelch.github.io
  ```
- Enable the extension:
  ```bash
  gnome-extensions enable openfortivpn-indicator@aminelch.github.io
  ```
- Monitor GNOME Shell logs during testing:
  ```bash
  journalctl -f -o cat /usr/bin/gnome-shell
  ```
- On Wayland sessions, log out and log back in to reload changes. On X11 sessions, you can press `Alt + F2`, type `r`, and hit `Enter`.

### 3. Guidelines
- Keep code clean, readable, and consistent with the existing JavaScript (ESM format used in GNOME Shell).
- Ensure the extension remains lightweight and purely user-space (no root requirement).
- Keep pull requests focused on a single topic or fix.

### 4. Open a Pull Request
- Push your branch to GitHub and submit a Pull Request against the `main` branch.
- Provide a concise summary of the changes and motivation.

---

## License

By contributing to this repository, you agree that your contributions will be licensed under the project's [GNU General Public License v3.0 or later](LICENSE).
