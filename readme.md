# com.neko.nekoLyrics

A high-performance, cross-platform lyrics display plugin for the Mirabox StreamDock (Models 293N4, N4 Pro, etc.) based on `com.hotspot.streamdock.maclyrics` with significant improvements and adaptations for the Windows platform. Written primarily in JavaScript for the core logic, it provides real-time, time-synced lyrics display.

The Windows bridge is written in C++, while macOS utilizes a Perl-based bridge for media sensing. 

### WIP:
- [ ] Localizations
  - [x] zh_CN
  - [ ] remaining languages
- [x] Meow

## Build:

```bash
npm ci
npm run package:plugin
```
