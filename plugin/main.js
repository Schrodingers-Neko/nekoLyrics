const {spawn, exec} = require("child_process");
const axios = require("axios");
const {SongStorage} = require("./SongStorage.js");

const {Plugins, Actions, log} = require("./utils/plugin.js");
const path = require("path");

const platform = process.platform;
const plugin = new Plugins();
const currentAction = {};
let SongInfoGetter = null;
let cachedFonts = null;

SongStorage.initSongStorage();

plugin.nekolyrics = new Actions({
    default: {},
    async _willAppear({context}) {
        if (SongInfoGetter === null) {
            initSongInfoGetter();
        }
        if (context in currentAction) {
            return;
        }
        currentAction[context] = new NekoLyrics(context);
    },
    _willDisappear({context}) {
        log.info("willDisappear", context);
        delete currentAction[context];
        if (Object.keys(currentAction).length === 0) {
            if (SongInfoGetter) {
                SongInfoGetter.kill("SIGINT");
                SongInfoGetter = null;
            }
        }
    },
    _propertyInspectorDidAppear() {
        getSystemFonts((fonts) => {
            plugin.sendToPropertyInspector({
                event: "getFonts",
                fonts: fonts
            });
        });
    },
    async sendToPlugin({payload, context}) {
        currentAction[context].sendToPlugin({payload});
    },
    _didReceiveSettings({payload, context}) {
        currentAction[context].didReceiveSettings({payload});
    }
});

function getSystemFonts(callback) {
    if (cachedFonts) return callback(cachedFonts);
    if (platform !== "win32") return callback(["Arial", "Helvetica", "PingFang SC"]);

    const cmd = "powershell -NoProfile -Command \"$OutputEncoding = [Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Add-Type -AssemblyName System.Drawing; [System.Drawing.Text.InstalledFontCollection]::new().Families.Name\"";
    exec(cmd, {encoding: "utf8", maxBuffer: 1024 * 1024}, (err, stdout) => {
        if (err) {
            log.error("Font fetch error: " + err.message);
            return callback(["Arial"]);
        }
        const fonts = stdout.split(/\r?\n/).map(f => f.trim()).filter(f => f.length > 0);
        cachedFonts = [...new Set(fonts)].sort();
        callback(cachedFonts);
    });
}

function escapeXml(unsafe) {
    if (!unsafe) return "";
    return unsafe.replace(/[<>&"']/g, function (c) {
        switch (c) {
            case "<":
                return "&lt;";
            case ">":
                return "&gt;";
            case "&":
                return "&amp;";
            case "\"":
                return "&quot;";
            case "'":
                return "&apos;";
            default:
                return c;
        }
    });
}

class LyricsAnimator {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.lines = ["", "", "", ""];
        this.process = 0;
        this.ypos = [73, 55, 28, -20, -73];
        this.fact = [1, 1, 1, 1];
        this.fontwidth = [0, 0, 0, 0];
        this.lastLyrics = "";
        this.currentEffect = 0;
        this.maxwidth = 750;
        this.color = "white";
        this.fontFamily = "Arial";
        this.time = 0;
        this.colorMode = "center";
    }

    setEffect(effect) {
        switch (effect) {
            case 0:
                this.currentEffect = 0;
                this.maxwidth = this.width;
                break;
            case 1:
                this.currentEffect = 1;
                this.maxwidth = Math.floor(this.width / 3 * 2);
                break;
            case 2:
                this.currentEffect = 2;
                this.maxwidth = this.width;
                break;
        }
    }

    addLine(line) {
        const t = ["", "", "", ""];
        if (this.currentEffect === 0 || this.currentEffect === 2) {
            t[0] = line || "";
            t[1] = this.lines[0] || "";
            t[2] = this.lines[1] || "";
            t[3] = this.lines[2] || "";
            this.lines = t;
            this.process = 0;
        } else {
            if (this.lastLyrics !== "") {
                t[0] = line || "";
                t[1] = this.lastLyrics || "";
                t[2] = this.lines[0] || "";
                t[3] = this.lines[1] || "";
                this.lastLyrics = "";
                this.lines = t;
                this.process = 0;
            } else {
                this.lastLyrics = line;
                return;
            }
        }
        for (let i = 0; i < 4; i++) {
            let size = 15;
            if (i === 1 && i === 2 && this.currentEffect === 0) {
                size = 10;
            }
            if (this.currentEffect === 2) {
                size = 20;
            }
            let n = estimateTextWidth(this.lines[i], size, size * 2);
            if (n > this.maxwidth) {
                this.fact[i] = this.maxwidth / n;
                this.fontwidth[i] = this.maxwidth;
            } else {
                this.fact[i] = 1;
                this.fontwidth[i] = n;
            }
        }
    }

    getSvg() {
        if (this.colorMode !== "center") {
            this.color = "url(#rainbow)";
        }
        this.time++;
        this.process = Math.min(this.process + 0.1, 1);
        let e;
        switch (this.currentEffect) {
            case 0:
                e = this.renderSvg(this.process);
                break;
            case 1:
                e = this.renderSvg1(this.process);
                break;
            case 2:
                e = this.renderSvg2(this.process);
                break;
        }
        if (this.colorMode !== "center") {
            e = this.buildColor() + e;
        }
        e = `<svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">${e}</svg>`;
        return e;
    }

    renderSvg2(e) {
        let t = [];
        let n = this.lines[1];
        let i = -this.width;
        let s = this.width / 2;
        let o = i + (s - i) * e;
        let a = Math.floor(40 * this.fact[1]);
        t.push(this.svgText(n, this.color, o, this.height / 2 + 10, a, 1));
        n = this.lines[2];
        i = this.width / 2;
        s = this.width * 1.5;
        o = i + (s - i) * e;
        a = Math.floor(40 * this.fact[2]);
        t.push(this.svgText(n, this.color, o, this.height / 2 + 10, a, 1));
        return t.join("\n");
    }

    renderSvg(e) {
        const t = [];
        for (let n = 0; n < this.lines.length; n++) {
            const i = this.lines[n];
            if (!i) continue;
            const s = this.ypos[n];
            const o = this.ypos[n + 1];
            const a = s + (o - s) * e;
            const r = n === 2 ? 30 : 20;
            const c = n === 1 ? 30 : 20;
            let l = Math.floor((r + (c - r) * e) * this.fact[n]);
            const p = n === 2 ? 1 : 0.5;
            const u = n === 1 ? 1 : 0.5;
            const d = p + (u - p) * e;
            t.push(this.svgText(i, this.color, this.width / 2, a, l, d));
        }
        return t.join("\n");
    }

    renderSvg1(e) {
        const t = 45 - 45 * e;
        const n = -45 * e;
        const i = this.width / 2;
        const s = this.height / 2;
        const o = this.height * 0.3;
        const a = this.height * 0.8;
        let r = `<g transform="rotate(${t}, ${i}, ${s})">
                <text x="0" y="${o}" font-family="${this.fontFamily}" font-weight="bold" font-size="${Math.floor(24 * this.fact[0])}"
                    fill="${this.color}" text-anchor="start" stroke="black" stroke-width="2">
                    ${escapeXml(this.lines[0])}
                </text>
                <text x="${this.width}" y="${a}" font-family="${this.fontFamily}" font-weight="bold" font-size="${Math.floor(24 * this.fact[1])}"
                    fill="${this.color}" text-anchor="end" stroke="black" stroke-width="2">
                    ${escapeXml(this.lines[1])}
                </text>
            </g>`;
        if (e < 0.99) {
            r += `<g transform="rotate(${n}, ${i}, ${s})">
            <text x="${-this.width / 2 * this.process}" y="${o}" font-family="${this.fontFamily}" font-weight="bold" font-size="${Math.floor(24 * this.fact[2])}"
                fill="${this.color}" text-anchor="start" stroke="black" stroke-width="2">
                ${escapeXml(this.lines[2])}
            </text>
            <text x="${this.width + this.width / 2 * this.process}" y="${a}" font-family="${this.fontFamily}" font-weight="bold" font-size="${Math.floor(24 * this.fact[3])}"
                fill="${this.color}" text-anchor="end" stroke="black" stroke-width="2">
                ${escapeXml(this.lines[3])}
            </text>
            </g>`;
        }
        return r;
    }

    buildColor() {
        const e = [];
        const t = 6;
        for (let n = 0; n <= t; n++) {
            let i = (this.time * 0.04 + n / t) % 1;
            let [s, o, a] = hsvToRgb(i, 1, 1);
            e.push(`<stop offset="${n / t * 100}%" stop-color="rgb(${s},${o},${a})"/>`);
        }
        return `<defs>
        <linearGradient id="rainbow" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${2 * this.width}" y2="0">
            ${e.join("\n")}
        </linearGradient>
    </defs>`;
    }

    svgText(text, color, x, y, size, opacity) {
        const escapedText = escapeXml(text);
        return `<text 
            x="${x}" y="${y}" font-family="${this.fontFamily}" font-weight="bold"
            font-size="${size}" fill="${color}" text-anchor="middle"
            opacity="${opacity}" stroke="black" stroke-width="2"
        >${escapedText}</text>`;
    }
}

function hsvToRgb(e, t, n) {
    let i = n * t;
    let s = i * (1 - Math.abs(e * 6 % 2 - 1));
    let o = n - i;
    let a;
    if (0 <= e && e < 1 / 6) a = [i, s, 0];
    else if (1 / 6 <= e && e < 2 / 6) a = [s, i, 0];
    else if (2 / 6 <= e && e < 3 / 6) a = [0, i, s];
    else if (3 / 6 <= e && e < 4 / 6) a = [0, s, i];
    else if (4 / 6 <= e && e < 5 / 6) a = [s, 0, i];
    else a = [i, 0, s];
    return a.map((val => Math.floor((val + o) * 255)));
}

function isFullWidthChar(char) {
    const t = char.codePointAt(0);
    return (t >= 4352 && t <= 4447 || t >= 11904 && t <= 42191 || t >= 44032 && t <= 55203 || t >= 63744 && t <= 64255 || t >= 65040 && t <= 65135 || t >= 65280 && t <= 65376 || t >= 65504 && t <= 65510 || t >= 127744 && t <= 129791);
}

function estimateTextWidth(text, size = 10, fullWidthSize = 20) {
    let width = 0;
    for (const char of text) {
        width += isFullWidthChar(char) ? fullWidthSize : size;
    }
    return width;
}

const MetadataCleaner = {
    clean(text) {
        if (!text) return "";
        return text
            .replace(/\(feat\..*?\)/gi, "")
            .replace(/\[.*?]/g, "")
            .replace(/\(.*?Remaster.*?\)/gi, "")
            .replace(/\(.*?Live.*?\)/gi, "")
            .replace(/\(.*?Single.*?\)/gi, "")
            .replace(/\(.*?Album.*?\)/gi, "")
            .replace(/\(.*?Instrumental.*?\)/gi, "")
            .replace(/\(.*?伴奏.*?\)/gi, "")
            .replace(/- Single$/i, "")
            .replace(/- EP$/i, "")
            .trim();
    },
    isInstrumental(text) {
        if (!text) return false;
        const lower = text.toLowerCase();
        return lower.includes("伴奏") ||
            lower.includes("instrumental") ||
            lower.includes("piano version") ||
            lower.includes("karaoke") ||
            lower.includes("backing track");
    },
    similarity(s1, s2) {
        if (!s1 || !s2) return 0;
        s1 = s1.toLowerCase();
        s2 = s2.toLowerCase();
        if (s1 === s2) return 1;
        let longer = s1.length < s2.length ? s2 : s1;
        let shorter = s1.length < s2.length ? s1 : s2;
        if (longer.length === 0) return 1.0;
        return (longer.length - this.editDistance(longer, shorter)) / parseFloat(longer.length);
    },
    editDistance(s1, s2) {
        let costs = [];
        for (let i = 0; i <= s1.length; i++) {
            let lastValue = i;
            for (let j = 0; j <= s2.length; j++) {
                if (i === 0) costs[j] = j;
                else if (j > 0) {
                    let newValue = costs[j - 1];
                    if (s1.charAt(i - 1) !== s2.charAt(j - 1))
                        newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
            if (i > 0) costs[s2.length] = lastValue;
        }
        return costs[s2.length];
    }
};

const HybridSearch = {
    async search(author, title, album, actualDuration) {
        const cleanTitle = MetadataCleaner.clean(title || "");
        const cleanAuthor = MetadataCleaner.clean(author || "");
        const cleanAlbum = MetadataCleaner.clean(album || "");
        const query = `${cleanTitle} ${cleanAuthor}`;

        log.info(`Hybrid Search: "${query}" (Target: ${Math.floor(actualDuration)}s)`);

        const results = await Promise.allSettled([
            this.searchNetease(query),
            this.searchQQ(query),
            this.searchLRCLIB(cleanTitle, cleanAuthor, cleanAlbum, actualDuration)
        ]);

        const pool = [];
        results.forEach(res => {
            if (res.status === "fulfilled" && res.value) {
                const valid = res.value.filter(s => s.songname && s.singer && s.singer.length > 0);
                pool.push(...valid);
            }
        });

        if (pool.length === 0) return null;

        const versionKeywords = ["remix", "edit", "acoustic", "live", "cover", "piano", "version", "remaster"];
        const titleLower = (title || "").toLowerCase();

        pool.forEach(item => {
            if (item.duration > 0 && item.duration < 30) {
                item.score = 0;
                return;
            }

            let score = 0;
            const diff = Math.abs(item.duration - actualDuration);
            if (actualDuration > 0) {
                if (diff < 2) score += 100;
                else if (diff < 5) score += 50;
                else if (diff > 15) score -= 100;
            }

            const resTitleLow = item.songname.toLowerCase();
            const titleSim = MetadataCleaner.similarity(cleanTitle, item.songname);
            const titleContains = resTitleLow.includes(titleLower) || titleLower.includes(resTitleLow);

            if (!titleContains && titleSim < 0.5) {
                score -= 100;
            } else {
                score += (titleSim * 40) + (titleContains ? 20 : 0);
            }

            const authorLow = cleanAuthor.toLowerCase();
            const artistSim = MetadataCleaner.similarity(cleanAuthor, item.singer.join(" "));
            const artistContains = item.singer.some(s => {
                const sLow = s.toLowerCase();
                return sLow.includes(authorLow) || authorLow.includes(sLow);
            });

            if (!artistContains && artistSim < 0.4) {
                score -= 100;
            } else {
                score += (artistSim * 30) + (artistContains ? 10 : 0);
            }

            const resultNameLower = item.songname.toLowerCase();
            for (const kw of versionKeywords) {
                if (resultNameLower.includes(kw) && !titleLower.includes(kw)) {
                    score -= 50;
                    break;
                }
            }

            if (item.source === "lrclib") score += 30;
            else if (item.source === "netease") score += 5;

            item.score = score;
        });

        pool.sort((a, b) => b.score - a.score);

        const threshold = 80;
        const filteredPool = pool.filter(item => item.score >= threshold);

        if (filteredPool.length === 0) {
            log.warn(`Best match rejected: ${pool[0].songname} (Score: ${Math.floor(pool[0].score)} < ${threshold})`);
            return null;
        }

        return filteredPool;
    },

    async searchNetease(query) {
        try {
            const res = await axios.get("https://music.163.com/api/search/get/web", {
                params: {s: query, type: 1, limit: 5},
                headers: {Referer: "https://music.163.com"}
            });
            return (res.data.result?.songs || []).map(s => ({
                songmid: s.id,
                songname: s.name,
                singer: s.artists.map(a => a.name),
                duration: s.duration / 1000,
                cover: s.album?.picUrl || null,
                source: "netease"
            }));
        } catch (_e) {
            return [];
        }
    },

    async searchQQ(query) {
        try {
            const res = await axios.get("https://c.y.qq.com/soso/fcgi-bin/client_search_cp", {
                params: {format: "json", n: 5, w: query, cr: 1, g_tk: 5381, t: 0},
                headers: {Referer: "https://y.qq.com"}
            });
            return (res.data.data?.song?.list || []).map(s => ({
                songmid: s.songmid,
                songname: s.songname,
                singer: s.singer.map(a => a.name),
                duration: s.interval,
                cover: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${s.albummid}.jpg`,
                source: "qqmusic"
            }));
        } catch (_e) {
            return [];
        }
    },

    async searchLRCLIB(title, artist, album, duration) {
        try {
            try {
                const getRes = await axios.get("https://lrclib.net/api/get", {
                    params: {
                        track_name: title,
                        artist_name: artist,
                        album_name: album,
                        duration: Math.round(duration)
                    }
                });
                if (getRes.data) {
                    return [{
                        songmid: getRes.data.id,
                        songname: getRes.data.trackName,
                        singer: [getRes.data.artistName],
                        duration: getRes.data.duration,
                        cover: null,
                        source: "lrclib",
                        syncedLyrics: getRes.data.syncedLyrics || getRes.data.plainLyrics
                    }];
                }
            } catch (_e) { /* ignore 404 */
            }

            const searchRes = await axios.get("https://lrclib.net/api/search", {
                params: {track_name: title, artist_name: artist}
            });
            return (searchRes.data || []).map(s => ({
                songmid: s.id,
                songname: s.trackName,
                singer: [s.artistName],
                duration: s.duration,
                source: "lrclib",
                syncedLyrics: s.syncedLyrics || s.plainLyrics
            }));
        } catch (_e) {
            return [];
        }
    },

    async getLyric(source, songmid) {
        switch (source) {
            case "netease":
                return await this.fetchNeteaseLyric(songmid);
            case "qqmusic":
                return await this.fetchQQLyric(songmid);
            case "lrclib":
                try {
                    const res = await axios.get(`https://lrclib.net/api/get/${songmid}`);
                    return {lyrics: res.data.syncedLyrics || res.data.plainLyrics};
                } catch (_e) {
                    return null;
                }
            default:
                return await this.fetchQQLyric(songmid);
        }
    },

    async fetchNeteaseLyric(songId) {
        try {
            const url = `https://music.163.com/api/song/media?id=${songId}`;
            const response = await axios.get(url, {headers: {Referer: "https://music.163.com"}});
            return {lyrics: response.data.lyric};
        } catch (error) {
            log.error("Fetch Netease lyric error:", error);
            return null;
        }
    },

    async fetchQQLyric(songmid) {
        try {
            const response = await axios.get(`https://api.vkeys.cn/v2/music/tencent/lyric?mid=${songmid}`);
            return {lyrics: response.data.data.lrc};
        } catch (error) {
            log.error("Fetch QQ lyric error:", error);
            return null;
        }
    }
};

class NekoLyrics {
    constructor(context) {
        this.context = context;
        this.cs = {width: 0, text1: "", text2: "", lyricsAnimator: null};
        this.isDrawing = false;
        this.track = {
            starttime: 0, author: "", name: "", title: "", album: "",
            duration: 0, cover: null, lyrics: null, startelapsed: 0,
            playbackRate: 0, hassongchange: false, appName: "",
            offsettime: 0, bundleIdentifier: ""
        };
        this.lastSearchTime = 0;
        this.selectsongmid = "";
        this.currentsongmid = "";
        this.globalOffset = 500;

        log.info("_willAppear: ", context);
        if (this.timers !== undefined) clearInterval(this.timers);
        this.timers = setInterval(this.draw.bind(this), 50);
    }

    didReceiveSettings({payload}) {
        const data = plugin.nekolyrics.data[this.context] || {};
        const touchbarWidth = data.touchbarWidth || 142;
        if (touchbarWidth !== this.cs.width) {
            this.cs.width = touchbarWidth;
            this.cs.lyricsAnimator = new LyricsAnimator(touchbarWidth, 66);
            this.cs.text1 = "";
            this.cs.text2 = "";
        }
        if (payload && payload.mode) {
            this.cs.lyricsAnimator.setEffect(payload.mode === "fade" ? 0 : payload.mode === "double" ? 1 : 2);
        }
    }

    async drawText(context, text1, text2) {
        const data = plugin.nekolyrics.data[context] || {};
        const touchbarWidth = data.touchbarWidth || 142;
        if (touchbarWidth !== this.cs.width) {
            this.cs.width = touchbarWidth;
            this.cs.lyricsAnimator = new LyricsAnimator(touchbarWidth, 66);
            this.cs.text1 = "";
            this.cs.text2 = "";
        }

        const animator = this.cs.lyricsAnimator;
        animator.color = data.color || "white";
        animator.colorMode = data.colorMode || "center";
        animator.fontFamily = data.fontFamily || "Arial";
        animator.setEffect(data.mode === "fade" ? 0 : data.mode === "double" ? 1 : 2);

        if (this.cs.text1 !== text1 || this.cs.text2 !== text2) {
            if (this.cs.text2 !== text1) {
                animator.addLine(text1);
            }
            animator.addLine(text2);
        }

        this.cs.text1 = text1;
        this.cs.text2 = text2;
        const c = animator.getSvg();
        plugin.setImage(context, `data:image/svg+xml;charset=utf8,${encodeURIComponent(c)}`);
    }

    getCurrentTime() {
        return (new Date()).getTime() - this.track.starttime
            + this.track.startelapsed + this.track.offsettime + this.globalOffset;
    }

    async sendToPlugin({payload}) {
        if (payload.songmid) {
            this.selectsongmid = payload.songmid;
        }
        if (payload.offsettime !== undefined) {
            this.track.offsettime = payload.offsettime;
            SongStorage.setSongLyricsOffset(this.track, this.track.offsettime);
        }
    }

    async draw() {
        if (this.isDrawing) return;
        this.isDrawing = true;

        try {
            if (this.track.playbackRate === 0) {
                plugin.setImage(this.context, "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7");
                if (this.cs.lyricsAnimator) {
                    this.cs.lyricsAnimator.lines = ["", "", "", ""];
                    this.cs.text1 = "";
                    this.cs.text2 = "";
                }
                return;
            }

            if (this.track.name !== "" && this.track.hassongchange) {
                const snapshot = {
                    name: this.track.name, author: this.track.author,
                    title: this.track.title, album: this.track.album,
                    duration: this.track.duration, bundleIdentifier: this.track.bundleIdentifier
                };

                this.cs.text1 = "";
                this.cs.text2 = "";
                if (this.cs.lyricsAnimator) this.cs.lyricsAnimator.lines = ["", "", "", ""];

                if (MetadataCleaner.isInstrumental(this.track.name) || MetadataCleaner.isInstrumental(this.track.title)) {
                    log.info("Instrumental detected, skipping search:", this.track.name);
                    this.track.lyrics = null;
                    this.track.hassongchange = false;
                    this.isDrawing = false;
                    return;
                }

                const cached = await SongStorage.getSongLyrics(snapshot);
                if (this.track.name !== snapshot.name || this.track.author !== snapshot.author) {
                    this.isDrawing = false;
                    return;
                }

                if (cached !== null) {
                    log.info("Cache hit for:", this.track.name);
                    this.track.lyrics = cached;
                    this.track.offsettime = SongStorage.getSongLyricsOffset(snapshot) || 0;
                    this.track.hassongchange = false;
                } else {
                    const now = Date.now();
                    const diff = now - this.lastSearchTime;
                    if (diff < 10000) {
                        const remaining = Math.ceil((10000 - diff) / 1000);
                        await this.drawText(this.context, "Hybrid Search", `on cooldown: ${remaining}s`);
                        this.isDrawing = false;
                        return;
                    }

                    this.lastSearchTime = now;
                    this.track.hassongchange = false;
                    const candidates = await HybridSearch.search(snapshot.author, snapshot.name, snapshot.album, snapshot.duration);

                    if (this.track.name !== snapshot.name || this.track.author !== snapshot.author) {
                        this.isDrawing = false;
                        return;
                    }

                    if (candidates && candidates.length > 0) {
                        let foundValid = false;
                        const maxAttempts = Math.min(candidates.length, 3);

                        for (let i = 0; i < maxAttempts; i++) {
                            const candidate = candidates[i];
                            log.info(`Attempting candidate ${i + 1}/${maxAttempts}: ${candidate.songname} (${candidate.source})`);

                            let lyricsResult = null;
                            if (candidate.source === "lrclib" && candidate.syncedLyrics) {
                                lyricsResult = {lyrics: candidate.syncedLyrics};
                            } else {
                                lyricsResult = await HybridSearch.getLyric(candidate.source, candidate.songmid);
                            }

                            if (lyricsResult && lyricsResult.lyrics) {
                                const lineCount = lyricsResult.lyrics.split(/\r?\n/).filter(l => l.trim()).length;
                                const isSynced = /\[\d{1,2}:\d{2}/.test(lyricsResult.lyrics);

                                if (lineCount >= 20 && isSynced) {
                                    this.currentsongmid = this.selectsongmid = candidate.songmid;
                                    this.track.lyrics = lyricsResult;
                                    this.track.cover = candidate.cover;

                                    plugin.nekolyrics.data[this.context].list = candidates;
                                    plugin.nekolyrics.data[this.context].songmid = this.selectsongmid;
                                    plugin.setSettings(this.context, plugin.nekolyrics.data[this.context]);

                                    SongStorage.setSongLyrics(snapshot, this.track.lyrics);
                                    foundValid = true;
                                    log.info(`Successfully loaded synced lyrics with ${lineCount} lines.`);
                                    break;
                                } else {
                                    log.warn(`Candidate ${i + 1} rejected: ${!isSynced ? "Not time-synced" : "Only " + lineCount + " lines"}.`);
                                }
                            }
                        }

                        if (!foundValid) {
                            log.warn("No candidates yielded valid lyrics after retry loop.");
                            this.track.lyrics = null;
                        }
                    } else {
                        log.warn("No matches found for:", this.track.name);
                        this.track.lyrics = null;
                    }
                }
            }

            if (this.currentsongmid !== this.selectsongmid) {
                const snapshot = {
                    name: this.track.name,
                    author: this.track.author,
                    bundleIdentifier: this.track.bundleIdentifier
                };

                this.cs.text1 = "";
                this.cs.text2 = "";
                if (this.cs.lyricsAnimator) this.cs.lyricsAnimator.lines = ["", "", "", ""];

                this.currentsongmid = this.selectsongmid;
                const match = plugin.nekolyrics.data[this.context].list?.find(s => s.songmid === this.selectsongmid);
                const source = match?.source || "qqmusic";

                log.info("Manual selection fetch:", this.selectsongmid);
                let lyricsResult;
                if (source === "lrclib" && match?.syncedLyrics) {
                    lyricsResult = {lyrics: match.syncedLyrics};
                } else {
                    lyricsResult = await HybridSearch.getLyric(source, this.selectsongmid);
                }

                if (this.track.name === snapshot.name) {
                    this.track.lyrics = lyricsResult;
                    this.track.cover = match?.cover || null;
                    if (this.track.lyrics) {
                        SongStorage.setSongLyrics(snapshot, this.track.lyrics);
                    }
                }
            }

            let {text1: o, text2: a} = getCurrentLyrics(this.track.lyrics, this.getCurrentTime());

            if (!this.track.lyrics || o === "") {
                const infoStr1 = `${this.track.author} - ${this.track.album}`;
                const infoStr2 = `${this.track.title || this.track.name}`;
                await this.drawText(this.context, infoStr1, infoStr2);
            } else {
                await this.drawText(this.context, o, a);
            }
        } catch (err) {
            log.error("Draw error:", err);
        } finally {
            this.isDrawing = false;
        }
    }

    getSonginfo(payload_data) {
        const payload = payload_data.payload;
        if (!payload) return;
        const newTitle = payload.title || "";
        const newAlbum = payload.album || "";
        const newArtist = payload.artist || "";
        const newBundle = payload.bundleIdentifier || "";
        const newDuration = payload.duration || 0;

        if (!newTitle && !newArtist && !newAlbum) return;

        if (payload.playing !== undefined) {
            this.track.playbackRate = payload.playing ? 1 : 0;
        } else if (payload.playbackRate !== undefined) {
            this.track.playbackRate = payload.playbackRate;
        }

        const searchName = newTitle || newAlbum;

        if (this.track.name !== searchName || this.track.author !== newArtist || Math.abs(this.track.duration - newDuration) > 1) {
            this.track.hassongchange = true;
            this.track.lyrics = null;
            this.track.name = searchName;
            this.track.title = newTitle;
            this.track.album = newAlbum;
            this.track.author = newArtist;
            this.track.duration = newDuration;
            this.track.cover = null;
            this.track.bundleIdentifier = newBundle;

            this.cs.text1 = "";
            this.cs.text2 = "";
            if (this.cs.lyricsAnimator) {
                this.cs.lyricsAnimator.lines = ["", "", "", ""];
            }

            log.info("Metadata update:", searchName, "by", newArtist, `(${Math.floor(newDuration)}s)`);
        }

        if (this.track.playbackRate === 1) {
            this.track.starttime = (new Date()).getTime();
            this.track.startelapsed = (payload.elapsedTime || 0) * 1e3;
        }
    }
}

let buffer = "";

function initSongInfoGetter() {
    if (platform === "darwin") {
        SongInfoGetter = spawn("/usr/bin/perl", [__dirname + "/bin/mediaremote-adapter.pl", __dirname + "/build/MediaRemoteAdapter.framework", "stream", "--no-diff", "--debounce=1000"]);
    } else if (platform === "win32") {
        const exePath = path.join(...[__dirname, "bin", "MediaBridge.exe"]);
        SongInfoGetter = spawn(exePath);
    }

    if (SongInfoGetter) {
        SongInfoGetter.stdout.setEncoding("utf8");
        SongInfoGetter.stdout.on("data", (data) => {
            buffer += data;
            let lines = buffer.split(/\r?\n/);
            buffer = lines.pop();

            for (let line of lines) {
                if (!line.trim()) continue;
                let t;
                try {
                    t = JSON.parse(line);
                } catch (err) {
                    log.error("JSON Parse Error:", err.message, "Line:", line);
                    continue;
                }

                if (t.payload && t.payload.playbackRate !== undefined) {
                    for (let id in currentAction) {
                        currentAction[id].getSonginfo(t);
                    }
                }
            }
        });
        SongInfoGetter.stderr.on("data", (data) => {
            log.error(`stderr:${data}`);
        });
        SongInfoGetter.on("error", (err) => {
            log.error(`MediaBridge Error: ${err.message}`);
            SongInfoGetter = null;
        });
    }
}

function getCurrentLyrics(lyricsData, t) {
    if (!lyricsData || !lyricsData.lyrics) {
        return {text1: "", text2: ""};
    }
    const lines = lyricsData.lyrics.split("\n");
    const timeRegex = /\[(\d{1,3}):(\d{2})(?:\.(\d{1,3}))?]/;
    const parsedLyrics = [];

    for (let line of lines) {
        const match = timeRegex.exec(line);
        if (match) {
            const mins = parseInt(match[1]);
            const secs = parseInt(match[2]);
            const msPart = match[3] || "0";
            const ms = parseInt(msPart.padEnd(3, "0").substring(0, 3));
            const totalMs = mins * 60000 + secs * 1000 + ms;
            const text = line.replace(/\[.*?]/g, "").trim();
            if (text) {
                parsedLyrics.push({time: totalMs, text});
            }
        }
    }

    parsedLyrics.sort((a, b) => a.time - b.time);

    let currentIdx = -1;
    for (let i = 0; i < parsedLyrics.length; i++) {
        if (parsedLyrics[i].time <= t) {
            currentIdx = i;
        } else {
            break;
        }
    }

    if (currentIdx === -1) {
        return {text1: "", text2: ""};
    }

    return {
        text1: parsedLyrics[currentIdx].text,
        text2: (currentIdx + 1 < parsedLyrics.length) ? parsedLyrics[currentIdx + 1].text : ""
    };
}