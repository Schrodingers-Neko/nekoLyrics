const {lyricsCache} = require("./utils/lyricsCache.js");

const {Plugins, Actions, log} = require("./utils/plugin.js");

const platform = process.platform;
const plugin = new Plugins();
const currentAction = {};

lyricsCache.init();

plugin.nekolyrics = new Actions({
    default: {},
    async _willAppear({context}) {
        initializeMediaBridge(currentAction, platform, __dirname);
        if (context in currentAction) {
            return;
        }
        currentAction[context] = new NekoLyrics(context);
    },
    _willDisappear({context}) {
        log.info("willDisappear", context);
        delete currentAction[context];
        if (Object.keys(currentAction).length === 0) {
            killMediaBridge();
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

const getSystemFonts = require("./utils/systemFontFetcher");

const {LyricsAnimator, estimateTextWidth} = require("./utils/lyricsAnimator");

const MetadataCleaner = require("./utils/metadataCleaner");

const HybridSearch = require("./utils/hybridSearch");

const getCurrentLyrics = require("./utils/lyricsParser");

const {initializeMediaBridge, killMediaBridge} = require("./utils/mediaBridge");

class NekoLyrics {
    constructor(context) {
        this.context = context;
        this.cs = {width: 0, text1: "", text2: "", lyricsAnimator: null};
        this.isDrawing = false;
        this.track = {
            starttime: 0, author: "", name: "", title: "", album: "",
            duration: 0, cover: null, lyrics: null, startelapsed: 0,
            playbackRate: 0, trackChanged: false, appName: "",
            offsettime: 0, bundleIdentifier: ""
        };
        this.lastSearchTime = 0;
        this.selectsongmid = "";
        this.currentsongmid = "";
        this.globalOffset = 500;

        // NEW: Flag to prevent duplicate searches without blocking the UI
        this.isSearching = false;

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
            lyricsCache.setSongLyricsOffset(this.track, this.track.offsettime);
        }
    }

    // NEW: Background search method. Notice it does not block the draw loop!
    async fetchLyricsBackground(snapshot) {
        try {
            const candidates = await HybridSearch.search(snapshot.author, snapshot.name, snapshot.album, snapshot.duration);

            // Double check the song hasn't changed while we were searching
            if (this.track.name !== snapshot.name || this.track.author !== snapshot.author) {
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

                            lyricsCache.setSongLyrics(snapshot, this.track.lyrics);
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
                    lyricsCache.setSongLyrics(snapshot, null);
                }
            } else {
                log.warn("No matches found for:", this.track.name);
                this.track.lyrics = null;
            }
        } catch (err) {
            log.error("Background search error:", err);
        } finally {
            // Always unlock the search flag so a new search can happen later if needed
            this.isSearching = false;
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

            if (this.track.name !== "" && this.track.trackChanged) {
                this.track.trackChanged = false;
                const snapshot = {
                    name: this.track.name, author: this.track.author,
                    title: this.track.title, album: this.track.album,
                    duration: this.track.duration, bundleIdentifier: this.track.bundleIdentifier
                };

                this.track.lyrics = null;
                this.cs.text1 = "";
                this.cs.text2 = "";
                if (this.cs.lyricsAnimator) this.cs.lyricsAnimator.lines = ["", "", "", ""];

                if (MetadataCleaner.isInstrumental(this.track.name) || MetadataCleaner.isInstrumental(this.track.title)) {
                    log.info("Instrumental detected, skipping search:", this.track.name);
                    this.track.lyrics = null;
                    this.isDrawing = false;
                    return;
                }

                const cached = await lyricsCache.getSongLyrics(snapshot);
                if (this.track.name !== snapshot.name || this.track.author !== snapshot.author) {
                    this.isDrawing = false;
                    return;
                }

                if (cached !== null) {
                    log.info("Cache hit for:", this.track.name);
                    this.track.lyrics = cached.lyrics === "null" ? null : cached;
                    this.track.offsettime = lyricsCache.getSongLyricsOffset(snapshot) || 0;
                } else {
                    const now = Date.now();
                    const diff = now - this.lastSearchTime;

                    if (diff < 10000) {
                        const remaining = Math.ceil((10000 - diff) / 1000);
                        await this.drawText(this.context, "Hybrid Search", `on cooldown: ${remaining}s`);
                        this.isDrawing = false;
                        return;
                    }

                    // MODIFIED: Fire and forget the background search!
                    // No 'await' means the draw loop finishes instantly and hits the placeholder block below.
                    if (!this.isSearching) {
                        this.isSearching = true;
                        this.lastSearchTime = now;
                        this.fetchLyricsBackground(snapshot).catch(err => log.error(err));
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
                        lyricsCache.setSongLyrics(snapshot, this.track.lyrics);
                    }
                }
            }

            // ONE SINGLE SOURCE OF TRUTH:
            // This runs every 50ms. If background search is still running, lyrics are null, and the placeholder renders.
            let {text1: o, text2: a} = getCurrentLyrics(this.track.lyrics, this.getCurrentTime());

            if (!this.track.lyrics || o === "") {
                await this.drawPlaceholder();
            } else {
                await this.drawText(this.context, o, a);
            }
        } catch (err) {
            log.error("Draw error:", err);
        } finally {
            this.isDrawing = false;
        }
    }

    async drawPlaceholder() {
        const infoStr1 = `${this.track.title || this.track.name}`;
        const infoStr2 = `${this.track.author} - ${this.track.album}`;
        await this.drawText(this.context, infoStr1, infoStr2);
    }

    getTrackInfo(payload_data) {
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
            this.track.trackChanged = true;
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