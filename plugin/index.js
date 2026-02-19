(() => {
    var __webpack_modules__ = {
        6495: (e, t, n) => {
            const {log: i} = n(895);
            const s = n(7977);

            class SongProcessor {
                async getLyric(e) {
                    throw new Error("getLyric() must be implemented")
                }

                async searchSong(e, t) {
                    throw new Error("searchSong() must be implemented")
                }
            }

            class NeteaseSongProcessor extends SongProcessor {
                async getLyric(e) {
                    try {
                        const t = `https://music.163.com/api/song/media?id=${e}`;
                        const n = await s.get(t, {headers: {Referer: "https://music.163.com"}});
                        return {lyric: n.data.lyric}
                    } catch (e) {
                        i.error("Fetch lyric error:", e);
                        return null
                    }
                }

                async searchSong(e, t) {
                    try {
                        const n = {s: e + " " + t, type: 1, offset: 0, total: true, limit: 3};
                        const o = await s.get("https://music.163.com/api/search/get/web", {params: n});
                        const a = [];
                        const r = o.data;
                        i.info(r);
                        if (r.result?.songs?.length > 0) {
                            r.result.songs.forEach((e => {
                                const t = {};
                                t.songmid = e.id;
                                t.songname = e.name;
                                t.singer = e.artists.map((e => e.name));
                                a.push(t)
                            }));
                            if (a) {
                                return a
                            }
                        }
                        return null
                    } catch (e) {
                        i.error("Search song error:", e);
                        return null
                    }
                }
            }

            class QQMusicSongProcessor extends SongProcessor {
                async getLyric(e) {
                    try {
                        const t = await s.get(`https://api.vkeys.cn/v2/music/tencent/lyric?mid=${e}`);
                        return {lyric: t.data.data.lrc}
                    } catch (e) {
                        i.error("Fetch lyric error:", e);
                        return null
                    }
                }

                async searchSong(e, t) {
                    try {
                        const n = "http://c.y.qq.com/soso/fcgi-bin/client_search_cp";
                        const i = {format: "json", n: 1, p: 1, w: `${t} ${e}`, cr: 1, g_tk: 5381, t: 0};
                        const o = await s.get(n, {params: i, headers: {Referer: "https://y.qq.com"}});
                        const a = o.data;
                        const r = [];
                        if (a.data?.song?.list?.length > 0) {
                            a.data.song.list.forEach((e => {
                                const t = {};
                                t.songmid = e.songmid;
                                t.songname = e.songname;
                                t.singer = e.singer.map((e => e.name));
                                r.push(t)
                            }));
                            if (r) {
                                return r
                            }
                        }
                        return null
                    } catch (e) {
                        i.error("Search song error:", e);
                        return null
                    }
                }
            }

            function createSongProcessor(e) {
                if (e.includes("netease")) {
                    return new NeteaseSongProcessor
                } else if (e.includes("qq")) {
                    return new QQMusicSongProcessor
                } else {
                    return new QQMusicSongProcessor
                }
            }

            e.exports = {createSongProcessor: createSongProcessor, SongProcessor: SongProcessor}
        }, 8118: (e, t, n) => {
            const i = n(6982);
            const s = n(9896);
            const o = n(6928);
            const a = "./SongStorage";

            function getMd5(e) {
                var t = i.createHash("md5");
                return t.update(e).digest("hex")
            }

            function getSongFile(e) {
                return o.join(a, getMd5(e.name + e.author + e.bundleIdentifier))
            }

            class SongStorage {
                static initSongStorage() {
                    if (!s.existsSync(a)) {
                        s.mkdirSync(a)
                    }
                }

                static getSongLyric(e) {
                    const t = getSongFile(e);
                    if (!s.existsSync(t)) {
                        return null
                    }
                    const n = s.readFileSync(t, "utf8");
                    return JSON.parse(n)
                }

                static setSongLyric(e, t) {
                    const n = getSongFile(e);
                    const i = JSON.stringify(t);
                    s.writeFileSync(n, i)
                }

                static getSongLyricOffset(e) {
                    const t = getSongFile(e) + ".offset";
                    if (!s.existsSync(t)) {
                        return null
                    }
                    const n = s.readFileSync(t, "utf8");
                    return parseInt(n)
                }

                static setSongLyricOffset(e, t) {
                    const n = getSongFile(e) + ".offset";
                    s.writeFileSync(n, t.toString())
                }
            }

            e.exports = {SongStorage: SongStorage}
        }, 108: (e, t, n) => {
            e.exports = {parallel: n(9233), serial: n(6686), serialOrdered: n(937)}
        }, 9282: e => {
            e.exports = abort;

            function abort(e) {
                Object.keys(e.jobs).forEach(clean.bind(e));
                e.jobs = {}
            }

            function clean(e) {
                if (typeof this.jobs[e] == "function") {
                    this.jobs[e]()
                }
            }
        }, 7956: (e, t, n) => {
            var i = n(9504);
            e.exports = async;

            function async(e) {
                var t = false;
                i((function () {
                    t = true
                }));
                return function async_callback(n, s) {
                    if (t) {
                        e(n, s)
                    } else {
                        i((function nextTick_callback() {
                            e(n, s)
                        }))
                    }
                }
            }
        }, 9504: e => {
            e.exports = defer;

            function defer(e) {
                var t = typeof setImmediate == "function" ? setImmediate : typeof process == "object" && typeof process.nextTick == "function" ? process.nextTick : null;
                if (t) {
                    t(e)
                } else {
                    setTimeout(e, 0)
                }
            }
        }, 1862: (e, t, n) => {
            var i = n(7956), s = n(9282);
            e.exports = iterate;

            function iterate(e, t, n, i) {
                var o = n["keyedList"] ? n["keyedList"][n.index] : n.index;
                n.jobs[o] = runJob(t, o, e[o], (function (e, t) {
                    if (!(o in n.jobs)) {
                        return
                    }
                    delete n.jobs[o];
                    if (e) {
                        s(n)
                    } else {
                        n.results[o] = t
                    }
                    i(e, n.results)
                }))
            }

            function runJob(e, t, n, s) {
                var o;
                if (e.length == 2) {
                    o = e(n, i(s))
                } else {
                    o = e(n, t, i(s))
                }
                return o
            }
        }, 8201: e => {
            e.exports = state;

            function state(e, t) {
                var n = !Array.isArray(e), i = {
                    index: 0,
                    keyedList: n || t ? Object.keys(e) : null,
                    jobs: {},
                    results: n ? {} : [],
                    size: n ? Object.keys(e).length : e.length
                };
                if (t) {
                    i.keyedList.sort(n ? t : function (n, i) {
                        return t(e[n], e[i])
                    })
                }
                return i
            }
        }, 5607: (e, t, n) => {
            var i = n(9282), s = n(7956);
            e.exports = terminator;

            function terminator(e) {
                if (!Object.keys(this.jobs).length) {
                    return
                }
                this.index = this.size;
                i(this);
                s(e)(null, this.results)
            }
        }, 9233: (e, t, n) => {
            var i = n(1862), s = n(8201), o = n(5607);
            e.exports = parallel;

            function parallel(e, t, n) {
                var a = s(e);
                while (a.index < (a["keyedList"] || e).length) {
                    i(e, t, a, (function (e, t) {
                        if (e) {
                            n(e, t);
                            return
                        }
                        if (Object.keys(a.jobs).length === 0) {
                            n(null, a.results);

                        }
                    }));
                    a.index++
                }
                return o.bind(a, n)
            }
        }, 6686: (e, t, n) => {
            var i = n(937);
            e.exports = serial;

            function serial(e, t, n) {
                return i(e, t, null, n)
            }
        }, 937: (e, t, n) => {
            var i = n(1862), s = n(8201), o = n(5607);
            e.exports = serialOrdered;
            e.exports.ascending = ascending;
            e.exports.descending = descending;

            function serialOrdered(e, t, n, a) {
                var r = s(e, n);
                i(e, t, r, (function iteratorHandler(n, s) {
                    if (n) {
                        a(n, s);
                        return
                    }
                    r.index++;
                    if (r.index < (r["keyedList"] || e).length) {
                        i(e, t, r, iteratorHandler);
                        return
                    }
                    a(null, r.results)
                }));
                return o.bind(r, a)
            }

            function ascending(e, t) {
                return e < t ? -1 : e > t ? 1 : 0
            }

            function descending(e, t) {
                return -1 * ascending(e, t)
            }
        }, 3919: (e, t, n) => {
            "use strict";
            var i = n(7756);
            var s = n(9049);
            var o = n(2765);
            var a = n(389);
            e.exports = a || i.call(o, s)
        }, 9049: e => {
            "use strict";
            e.exports = Function.prototype.apply
        }, 2765: e => {
            "use strict";
            e.exports = Function.prototype.call
        }, 6657: (e, t, n) => {
            "use strict";
            var i = n(7756);
            var s = n(178);
            var o = n(2765);
            var a = n(3919);
            e.exports = function callBindBasic(e) {
                if (e.length < 1 || typeof e[0] !== "function") {
                    throw new s("a function is required")
                }
                return a(i, o, e)
            }
        }, 389: e => {
            "use strict";
            e.exports = typeof Reflect !== "undefined" && Reflect && Reflect.apply
        }, 4398: (e, t, n) => {
            var i = n(9023);
            var s = n(2203).Stream;
            var o = n(4358);
            e.exports = CombinedStream;

            function CombinedStream() {
                this.writable = false;
                this.readable = true;
                this.dataSize = 0;
                this.maxDataSize = 2 * 1024 * 1024;
                this.pauseStreams = true;
                this._released = false;
                this._streams = [];
                this._currentStream = null;
                this._insideLoop = false;
                this._pendingNext = false
            }

            i.inherits(CombinedStream, s);
            CombinedStream.create = function (e) {
                var t = new this;
                e = e || {};
                for (var n in e) {
                    t[n] = e[n]
                }
                return t
            };
            CombinedStream.isStreamLike = function (e) {
                return typeof e !== "function" && typeof e !== "string" && typeof e !== "boolean" && typeof e !== "number" && !Buffer.isBuffer(e)
            };
            CombinedStream.prototype.append = function (e) {
                var t = CombinedStream.isStreamLike(e);
                if (t) {
                    if (!(e instanceof o)) {
                        var n = o.create(e, {maxDataSize: Infinity, pauseStream: this.pauseStreams});
                        e.on("data", this._checkDataSize.bind(this));
                        e = n
                    }
                    this._handleErrors(e);
                    if (this.pauseStreams) {
                        e.pause()
                    }
                }
                this._streams.push(e);
                return this
            };
            CombinedStream.prototype.pipe = function (e, t) {
                s.prototype.pipe.call(this, e, t);
                this.resume();
                return e
            };
            CombinedStream.prototype._getNext = function () {
                this._currentStream = null;
                if (this._insideLoop) {
                    this._pendingNext = true;
                    return
                }
                this._insideLoop = true;
                try {
                    do {
                        this._pendingNext = false;
                        this._realGetNext()
                    } while (this._pendingNext)
                } finally {
                    this._insideLoop = false
                }
            };
            CombinedStream.prototype._realGetNext = function () {
                var e = this._streams.shift();
                if (typeof e == "undefined") {
                    this.end();
                    return
                }
                if (typeof e !== "function") {
                    this._pipeNext(e);
                    return
                }
                var t = e;
                t(function (e) {
                    var t = CombinedStream.isStreamLike(e);
                    if (t) {
                        e.on("data", this._checkDataSize.bind(this));
                        this._handleErrors(e)
                    }
                    this._pipeNext(e)
                }.bind(this))
            };
            CombinedStream.prototype._pipeNext = function (e) {
                this._currentStream = e;
                var t = CombinedStream.isStreamLike(e);
                if (t) {
                    e.on("end", this._getNext.bind(this));
                    e.pipe(this, {end: false});
                    return
                }
                var n = e;
                this.write(n);
                this._getNext()
            };
            CombinedStream.prototype._handleErrors = function (e) {
                var t = this;
                e.on("error", (function (e) {
                    t._emitError(e)
                }))
            };
            CombinedStream.prototype.write = function (e) {
                this.emit("data", e)
            };
            CombinedStream.prototype.pause = function () {
                if (!this.pauseStreams) {
                    return
                }
                if (this.pauseStreams && this._currentStream && typeof this._currentStream.pause == "function") this._currentStream.pause();
                this.emit("pause")
            };
            CombinedStream.prototype.resume = function () {
                if (!this._released) {
                    this._released = true;
                    this.writable = true;
                    this._getNext()
                }
                if (this.pauseStreams && this._currentStream && typeof this._currentStream.resume == "function") this._currentStream.resume();
                this.emit("resume")
            };
            CombinedStream.prototype.end = function () {
                this._reset();
                this.emit("end")
            };
            CombinedStream.prototype.destroy = function () {
                this._reset();
                this.emit("close")
            };
            CombinedStream.prototype._reset = function () {
                this.writable = false;
                this._streams = [];
                this._currentStream = null
            };
            CombinedStream.prototype._checkDataSize = function () {
                this._updateDataSize();
                if (this.dataSize <= this.maxDataSize) {
                    return
                }
                var e = "DelayedStream#maxDataSize of " + this.maxDataSize + " bytes exceeded.";
                this._emitError(new Error(e))
            };
            CombinedStream.prototype._updateDataSize = function () {
                this.dataSize = 0;
                var e = this;
                this._streams.forEach((function (t) {
                    if (!t.dataSize) {
                        return
                    }
                    e.dataSize += t.dataSize
                }));
                if (this._currentStream && this._currentStream.dataSize) {
                    this.dataSize += this._currentStream.dataSize
                }
            };
            CombinedStream.prototype._emitError = function (e) {
                this._reset();
                this.emit("error", e)
            }
        }, 6028: e => {
            "use strict";

            function padWithZeros(e, t) {
                var n = e.toString();
                while (n.length < t) {
                    n = "0" + n
                }
                return n
            }

            function addZero(e) {
                return padWithZeros(e, 2)
            }

            function offset(e) {
                var t = Math.abs(e);
                var n = String(Math.floor(t / 60));
                var i = String(t % 60);
                n = ("0" + n).slice(-2);
                i = ("0" + i).slice(-2);
                return e === 0 ? "Z" : (e < 0 ? "+" : "-") + n + ":" + i
            }

            function asString(t, n) {
                if (typeof t !== "string") {
                    n = t;
                    t = e.exports.ISO8601_FORMAT
                }
                if (!n) {
                    n = e.exports.now()
                }
                var i = addZero(n.getDate());
                var s = addZero(n.getMonth() + 1);
                var o = addZero(n.getFullYear());
                var a = addZero(o.substring(2, 4));
                var r = t.indexOf("yyyy") > -1 ? o : a;
                var c = addZero(n.getHours());
                var l = addZero(n.getMinutes());
                var p = addZero(n.getSeconds());
                var u = padWithZeros(n.getMilliseconds(), 3);
                var d = offset(n.getTimezoneOffset());
                var f = t.replace(/dd/g, i).replace(/MM/g, s).replace(/y{1,4}/g, r).replace(/hh/g, c).replace(/mm/g, l).replace(/ss/g, p).replace(/SSS/g, u).replace(/O/g, d);
                return f
            }

            function setDatePart(e, t, n, i) {
                e["set" + (i ? "" : "UTC") + t](n)
            }

            function extractDateParts(t, n, i) {
                var s = t.indexOf("O") < 0;
                var o = false;
                var a = [{
                    pattern: /y{1,4}/, regexp: "\\d{1,4}", fn: function (e, t) {
                        setDatePart(e, "FullYear", t, s)
                    }
                }, {
                    pattern: /MM/, regexp: "\\d{1,2}", fn: function (e, t) {
                        setDatePart(e, "Month", t - 1, s);
                        if (e.getMonth() !== t - 1) {
                            o = true
                        }
                    }
                }, {
                    pattern: /dd/, regexp: "\\d{1,2}", fn: function (e, t) {
                        if (o) {
                            setDatePart(e, "Month", e.getMonth() - 1, s)
                        }
                        setDatePart(e, "Date", t, s)
                    }
                }, {
                    pattern: /hh/, regexp: "\\d{1,2}", fn: function (e, t) {
                        setDatePart(e, "Hours", t, s)
                    }
                }, {
                    pattern: /mm/, regexp: "\\d\\d", fn: function (e, t) {
                        setDatePart(e, "Minutes", t, s)
                    }
                }, {
                    pattern: /ss/, regexp: "\\d\\d", fn: function (e, t) {
                        setDatePart(e, "Seconds", t, s)
                    }
                }, {
                    pattern: /SSS/, regexp: "\\d\\d\\d", fn: function (e, t) {
                        setDatePart(e, "Milliseconds", t, s)
                    }
                }, {
                    pattern: /O/, regexp: "[+-]\\d{1,2}:?\\d{2}?|Z", fn: function (e, t) {
                        if (t === "Z") {
                            t = 0
                        } else {
                            t = t.replace(":", "")
                        }
                        var n = Math.abs(t);
                        var i = (t > 0 ? -1 : 1) * (n % 100 + Math.floor(n / 100) * 60);
                        e.setUTCMinutes(e.getUTCMinutes() + i)
                    }
                }];
                var r = a.reduce((function (e, t) {
                    if (t.pattern.test(e.regexp)) {
                        t.index = e.regexp.match(t.pattern).index;
                        e.regexp = e.regexp.replace(t.pattern, "(" + t.regexp + ")")
                    } else {
                        t.index = -1
                    }
                    return e
                }), {regexp: t, index: []});
                var c = a.filter((function (e) {
                    return e.index > -1
                }));
                c.sort((function (e, t) {
                    return e.index - t.index
                }));
                var l = new RegExp(r.regexp);
                var p = l.exec(n);
                if (p) {
                    var u = i || e.exports.now();
                    c.forEach((function (e, t) {
                        e.fn(u, p[t + 1])
                    }));
                    return u
                }
                throw new Error("String '" + n + "' could not be parsed as '" + t + "'")
            }

            function parse(e, t, n) {
                if (!e) {
                    throw new Error("pattern must be supplied")
                }
                return extractDateParts(e, t, n)
            }

            function now() {
                return new Date
            }

            e.exports = asString;
            e.exports.asString = asString;
            e.exports.parse = parse;
            e.exports.now = now;
            e.exports.ISO8601_FORMAT = "yyyy-MM-ddThh:mm:ss.SSS";
            e.exports.ISO8601_WITH_TZ_OFFSET_FORMAT = "yyyy-MM-ddThh:mm:ss.SSSO";
            e.exports.DATETIME_FORMAT = "dd MM yyyy hh:mm:ss.SSS";
            e.exports.ABSOLUTETIME_FORMAT = "hh:mm:ss.SSS"
        }, 1854: (e, t, n) => {
            t.formatArgs = formatArgs;
            t.save = save;
            t.load = load;
            t.useColors = useColors;
            t.storage = localstorage();
            t.destroy = (() => {
                let e = false;
                return () => {
                    if (!e) {
                        e = true;
                        console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.")
                    }
                }
            })();
            t.colors = ["#0000CC", "#0000FF", "#0033CC", "#0033FF", "#0066CC", "#0066FF", "#0099CC", "#0099FF", "#00CC00", "#00CC33", "#00CC66", "#00CC99", "#00CCCC", "#00CCFF", "#3300CC", "#3300FF", "#3333CC", "#3333FF", "#3366CC", "#3366FF", "#3399CC", "#3399FF", "#33CC00", "#33CC33", "#33CC66", "#33CC99", "#33CCCC", "#33CCFF", "#6600CC", "#6600FF", "#6633CC", "#6633FF", "#66CC00", "#66CC33", "#9900CC", "#9900FF", "#9933CC", "#9933FF", "#99CC00", "#99CC33", "#CC0000", "#CC0033", "#CC0066", "#CC0099", "#CC00CC", "#CC00FF", "#CC3300", "#CC3333", "#CC3366", "#CC3399", "#CC33CC", "#CC33FF", "#CC6600", "#CC6633", "#CC9900", "#CC9933", "#CCCC00", "#CCCC33", "#FF0000", "#FF0033", "#FF0066", "#FF0099", "#FF00CC", "#FF00FF", "#FF3300", "#FF3333", "#FF3366", "#FF3399", "#FF33CC", "#FF33FF", "#FF6600", "#FF6633", "#FF9900", "#FF9933", "#FFCC00", "#FFCC33"];

            function useColors() {
                if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) {
                    return true
                }
                if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
                    return false
                }
                let e;
                return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || typeof navigator !== "undefined" && navigator.userAgent && (e = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(e[1], 10) >= 31 || typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/)
            }

            function formatArgs(t) {
                t[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + t[0] + (this.useColors ? "%c " : " ") + "+" + e.exports.humanize(this.diff);
                if (!this.useColors) {
                    return
                }
                const n = "color: " + this.color;
                t.splice(1, 0, n, "color: inherit");
                let i = 0;
                let s = 0;
                t[0].replace(/%[a-zA-Z%]/g, (e => {
                    if (e === "%%") {
                        return
                    }
                    i++;
                    if (e === "%c") {
                        s = i
                    }
                }));
                t.splice(s, 0, n)
            }

            t.log = console.debug || console.log || (() => {
            });

            function save(e) {
                try {
                    if (e) {
                        t.storage.setItem("debug", e)
                    } else {
                        t.storage.removeItem("debug")
                    }
                } catch (e) {
                }
            }

            function load() {
                let e;
                try {
                    e = t.storage.getItem("debug") || t.storage.getItem("DEBUG")
                } catch (e) {
                }
                if (!e && typeof process !== "undefined" && "env" in process) {
                    e = process.env.DEBUG
                }
                return e
            }

            function localstorage() {
                try {
                    return localStorage
                } catch (e) {
                }
            }

            e.exports = n(5665)(t);
            const {formatters: i} = e.exports;
            i.j = function (e) {
                try {
                    return JSON.stringify(e)
                } catch (e) {
                    return "[UnexpectedJSONParseError]: " + e.message
                }
            }
        }, 5665: (e, t, n) => {
            function setup(e) {
                createDebug.debug = createDebug;
                createDebug.default = createDebug;
                createDebug.coerce = coerce;
                createDebug.disable = disable;
                createDebug.enable = enable;
                createDebug.enabled = enabled;
                createDebug.humanize = n(376);
                createDebug.destroy = destroy;
                Object.keys(e).forEach((t => {
                    createDebug[t] = e[t]
                }));
                createDebug.names = [];
                createDebug.skips = [];
                createDebug.formatters = {};

                function selectColor(e) {
                    let t = 0;
                    for (let n = 0; n < e.length; n++) {
                        t = (t << 5) - t + e.charCodeAt(n);
                        t |= 0
                    }
                    return createDebug.colors[Math.abs(t) % createDebug.colors.length]
                }

                createDebug.selectColor = selectColor;

                function createDebug(e) {
                    let t;
                    let n = null;
                    let i;
                    let s;

                    function debug(...e) {
                        if (!debug.enabled) {
                            return
                        }
                        const n = debug;
                        const i = Number(new Date);
                        const s = i - (t || i);
                        n.diff = s;
                        n.prev = t;
                        n.curr = i;
                        t = i;
                        e[0] = createDebug.coerce(e[0]);
                        if (typeof e[0] !== "string") {
                            e.unshift("%O")
                        }
                        let o = 0;
                        e[0] = e[0].replace(/%([a-zA-Z%])/g, ((t, i) => {
                            if (t === "%%") {
                                return "%"
                            }
                            o++;
                            const s = createDebug.formatters[i];
                            if (typeof s === "function") {
                                const i = e[o];
                                t = s.call(n, i);
                                e.splice(o, 1);
                                o--
                            }
                            return t
                        }));
                        createDebug.formatArgs.call(n, e);
                        const a = n.log || createDebug.log;
                        a.apply(n, e)
                    }

                    debug.namespace = e;
                    debug.useColors = createDebug.useColors();
                    debug.color = createDebug.selectColor(e);
                    debug.extend = extend;
                    debug.destroy = createDebug.destroy;
                    Object.defineProperty(debug, "enabled", {
                        enumerable: true, configurable: false, get: () => {
                            if (n !== null) {
                                return n
                            }
                            if (i !== createDebug.namespaces) {
                                i = createDebug.namespaces;
                                s = createDebug.enabled(e)
                            }
                            return s
                        }, set: e => {
                            n = e
                        }
                    });
                    if (typeof createDebug.init === "function") {
                        createDebug.init(debug)
                    }
                    return debug
                }

                function extend(e, t) {
                    const n = createDebug(this.namespace + (typeof t === "undefined" ? ":" : t) + e);
                    n.log = this.log;
                    return n
                }

                function enable(e) {
                    createDebug.save(e);
                    createDebug.namespaces = e;
                    createDebug.names = [];
                    createDebug.skips = [];
                    const t = (typeof e === "string" ? e : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
                    for (const e of t) {
                        if (e[0] === "-") {
                            createDebug.skips.push(e.slice(1))
                        } else {
                            createDebug.names.push(e)
                        }
                    }
                }

                function matchesTemplate(e, t) {
                    let n = 0;
                    let i = 0;
                    let s = -1;
                    let o = 0;
                    while (n < e.length) {
                        if (i < t.length && (t[i] === e[n] || t[i] === "*")) {
                            if (t[i] === "*") {
                                s = i;
                                o = n;
                                i++
                            } else {
                                n++;
                                i++
                            }
                        } else if (s !== -1) {
                            i = s + 1;
                            o++;
                            n = o
                        } else {
                            return false
                        }
                    }
                    while (i < t.length && t[i] === "*") {
                        i++
                    }
                    return i === t.length
                }

                function disable() {
                    const e = [...createDebug.names, ...createDebug.skips.map((e => "-" + e))].join(",");
                    createDebug.enable("");
                    return e
                }

                function enabled(e) {
                    for (const t of createDebug.skips) {
                        if (matchesTemplate(e, t)) {
                            return false
                        }
                    }
                    for (const t of createDebug.names) {
                        if (matchesTemplate(e, t)) {
                            return true
                        }
                    }
                    return false
                }

                function coerce(e) {
                    if (e instanceof Error) {
                        return e.stack || e.message
                    }
                    return e
                }

                function destroy() {
                    console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.")
                }

                createDebug.enable(createDebug.load());
                return createDebug
            }

            e.exports = setup
        }, 4078: (e, t, n) => {
            if (typeof process === "undefined" || process.type === "renderer" || process.browser === true || process.__nwjs) {
                e.exports = n(1854)
            } else {
                e.exports = n(7012)
            }
        }, 7012: (e, t, n) => {
            const i = n(2018);
            const s = n(9023);
            t.init = init;
            t.log = log;
            t.formatArgs = formatArgs;
            t.save = save;
            t.load = load;
            t.useColors = useColors;
            t.destroy = s.deprecate((() => {
            }), "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
            t.colors = [6, 2, 3, 4, 5, 1];
            try {
                const e = n(2963);
                if (e && (e.stderr || e).level >= 2) {
                    t.colors = [20, 21, 26, 27, 32, 33, 38, 39, 40, 41, 42, 43, 44, 45, 56, 57, 62, 63, 68, 69, 74, 75, 76, 77, 78, 79, 80, 81, 92, 93, 98, 99, 112, 113, 128, 129, 134, 135, 148, 149, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 178, 179, 184, 185, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 214, 215, 220, 221]
                }
            } catch (e) {
            }
            t.inspectOpts = Object.keys(process.env).filter((e => /^debug_/i.test(e))).reduce(((e, t) => {
                const n = t.substring(6).toLowerCase().replace(/_([a-z])/g, ((e, t) => t.toUpperCase()));
                let i = process.env[t];
                if (/^(yes|on|true|enabled)$/i.test(i)) {
                    i = true
                } else if (/^(no|off|false|disabled)$/i.test(i)) {
                    i = false
                } else if (i === "null") {
                    i = null
                } else {
                    i = Number(i)
                }
                e[n] = i;
                return e
            }), {});

            function useColors() {
                return "colors" in t.inspectOpts ? Boolean(t.inspectOpts.colors) : i.isatty(process.stderr.fd)
            }

            function formatArgs(t) {
                const {namespace: n, useColors: i} = this;
                if (i) {
                    const i = this.color;
                    const s = "[3" + (i < 8 ? i : "8;5;" + i);
                    const o = `  ${s};1m${n} [0m`;
                    t[0] = o + t[0].split("\n").join("\n" + o);
                    t.push(s + "m+" + e.exports.humanize(this.diff) + "[0m")
                } else {
                    t[0] = getDate() + n + " " + t[0]
                }
            }

            function getDate() {
                if (t.inspectOpts.hideDate) {
                    return ""
                }
                return (new Date).toISOString() + " "
            }

            function log(...e) {
                return process.stderr.write(s.formatWithOptions(t.inspectOpts, ...e) + "\n")
            }

            function save(e) {
                if (e) {
                    process.env.DEBUG = e
                } else {
                    delete process.env.DEBUG
                }
            }

            function load() {
                return process.env.DEBUG
            }

            function init(e) {
                e.inspectOpts = {};
                const n = Object.keys(t.inspectOpts);
                for (let i = 0; i < n.length; i++) {
                    e.inspectOpts[n[i]] = t.inspectOpts[n[i]]
                }
            }

            e.exports = n(5665)(t);
            const {formatters: o} = e.exports;
            o.o = function (e) {
                this.inspectOpts.colors = this.useColors;
                return s.inspect(e, this.inspectOpts).split("\n").map((e => e.trim())).join(" ")
            };
            o.O = function (e) {
                this.inspectOpts.colors = this.useColors;
                return s.inspect(e, this.inspectOpts)
            }
        }, 4358: (e, t, n) => {
            var i = n(2203).Stream;
            var s = n(9023);
            e.exports = DelayedStream;

            function DelayedStream() {
                this.source = null;
                this.dataSize = 0;
                this.maxDataSize = 1024 * 1024;
                this.pauseStream = true;
                this._maxDataSizeExceeded = false;
                this._released = false;
                this._bufferedEvents = []
            }

            s.inherits(DelayedStream, i);
            DelayedStream.create = function (e, t) {
                var n = new this;
                t = t || {};
                for (var i in t) {
                    n[i] = t[i]
                }
                n.source = e;
                var s = e.emit;
                e.emit = function () {
                    n._handleEmit(arguments);
                    return s.apply(e, arguments)
                };
                e.on("error", (function () {
                }));
                if (n.pauseStream) {
                    e.pause()
                }
                return n
            };
            Object.defineProperty(DelayedStream.prototype, "readable", {
                configurable: true,
                enumerable: true,
                get: function () {
                    return this.source.readable
                }
            });
            DelayedStream.prototype.setEncoding = function () {
                return this.source.setEncoding.apply(this.source, arguments)
            };
            DelayedStream.prototype.resume = function () {
                if (!this._released) {
                    this.release()
                }
                this.source.resume()
            };
            DelayedStream.prototype.pause = function () {
                this.source.pause()
            };
            DelayedStream.prototype.release = function () {
                this._released = true;
                this._bufferedEvents.forEach(function (e) {
                    this.emit.apply(this, e)
                }.bind(this));
                this._bufferedEvents = []
            };
            DelayedStream.prototype.pipe = function () {
                var e = i.prototype.pipe.apply(this, arguments);
                this.resume();
                return e
            };
            DelayedStream.prototype._handleEmit = function (e) {
                if (this._released) {
                    this.emit.apply(this, e);
                    return
                }
                if (e[0] === "data") {
                    this.dataSize += e[1].length;
                    this._checkIfMaxDataSizeExceeded()
                }
                this._bufferedEvents.push(e)
            };
            DelayedStream.prototype._checkIfMaxDataSizeExceeded = function () {
                if (this._maxDataSizeExceeded) {
                    return
                }
                if (this.dataSize <= this.maxDataSize) {
                    return
                }
                this._maxDataSizeExceeded = true;
                var e = "DelayedStream#maxDataSize of " + this.maxDataSize + " bytes exceeded.";
                this.emit("error", new Error(e))
            }
        }, 4762: (e, t, n) => {
            "use strict";
            var i = n(6657);
            var s = n(2674);
            var o;
            try {
                o = [].__proto__ === Array.prototype
            } catch (e) {
                if (!e || typeof e !== "object" || !("code" in e) || e.code !== "ERR_PROTO_ACCESS") {
                    throw e
                }
            }
            var a = !!o && s && s(Object.prototype, "__proto__");
            var r = Object;
            var c = r.getPrototypeOf;
            e.exports = a && typeof a.get === "function" ? i([a.get]) : typeof c === "function" ? function getDunder(e) {
                return c(e == null ? e : r(e))
            } : false
        }, 2470: e => {
            "use strict";
            var t = Object.defineProperty || false;
            if (t) {
                try {
                    t({}, "a", {value: 1})
                } catch (e) {
                    t = false
                }
            }
            e.exports = t
        }, 3168: e => {
            "use strict";
            e.exports = EvalError
        }, 6980: e => {
            "use strict";
            e.exports = Error
        }, 3673: e => {
            "use strict";
            e.exports = RangeError
        }, 8745: e => {
            "use strict";
            e.exports = ReferenceError
        }, 1241: e => {
            "use strict";
            e.exports = SyntaxError
        }, 178: e => {
            "use strict";
            e.exports = TypeError
        }, 8898: e => {
            "use strict";
            e.exports = URIError
        }, 1111: e => {
            "use strict";
            e.exports = Object
        }, 3980: (e, t, n) => {
            "use strict";
            var i = n(4022);
            var s = i("%Object.defineProperty%", true);
            var o = n(9431)();
            var a = n(8508);
            var r = n(178);
            var c = o ? Symbol.toStringTag : null;
            e.exports = function setToStringTag(e, t) {
                var n = arguments.length > 2 && !!arguments[2] && arguments[2].force;
                var i = arguments.length > 2 && !!arguments[2] && arguments[2].nonConfigurable;
                if (typeof n !== "undefined" && typeof n !== "boolean" || typeof i !== "undefined" && typeof i !== "boolean") {
                    throw new r("if provided, the `overrideIfSet` and `nonConfigurable` options must be booleans")
                }
                if (c && (n || !a(e, c))) {
                    if (s) {
                        s(e, c, {configurable: !i, enumerable: false, value: t, writable: false})
                    } else {
                        e[c] = t
                    }
                }
            }
        }, 3546: (e, t, n) => {
            var i;
            e.exports = function () {
                if (!i) {
                    try {
                        i = n(4078)("follow-redirects")
                    } catch (e) {
                    }
                    if (typeof i !== "function") {
                        i = function () {
                        }
                    }
                }
                i.apply(null, arguments)
            }
        }, 8853: (e, t, n) => {
            var i = n(7016);
            var s = i.URL;
            var o = n(8611);
            var a = n(5692);
            var r = n(2203).Writable;
            var c = n(2613);
            var l = n(3546);
            (function detectUnsupportedEnvironment() {
                var e = typeof process !== "undefined";
                var t = typeof window !== "undefined" && typeof document !== "undefined";
                var n = isFunction(Error.captureStackTrace);
                if (!e && (t || !n)) {
                    console.warn("The follow-redirects package should be excluded from browser builds.")
                }
            })();
            var p = false;
            try {
                c(new s(""))
            } catch (e) {
                p = e.code === "ERR_INVALID_URL"
            }
            var u = ["auth", "host", "hostname", "href", "path", "pathname", "port", "protocol", "query", "search", "hash"];
            var d = ["abort", "aborted", "connect", "error", "socket", "timeout"];
            var f = Object.create(null);
            d.forEach((function (e) {
                f[e] = function (t, n, i) {
                    this._redirectable.emit(e, t, n, i)
                }
            }));
            var m = createErrorType("ERR_INVALID_URL", "Invalid URL", TypeError);
            var h = createErrorType("ERR_FR_REDIRECTION_FAILURE", "Redirected request failed");
            var x = createErrorType("ERR_FR_TOO_MANY_REDIRECTS", "Maximum number of redirects exceeded", h);
            var g = createErrorType("ERR_FR_MAX_BODY_LENGTH_EXCEEDED", "Request body larger than maxBodyLength limit");
            var v = createErrorType("ERR_STREAM_WRITE_AFTER_END", "write after end");
            var y = r.prototype.destroy || noop;

            function RedirectableRequest(e, t) {
                r.call(this);
                this._sanitizeOptions(e);
                this._options = e;
                this._ended = false;
                this._ending = false;
                this._redirectCount = 0;
                this._redirects = [];
                this._requestBodyLength = 0;
                this._requestBodyBuffers = [];
                if (t) {
                    this.on("response", t)
                }
                var n = this;
                this._onNativeResponse = function (e) {
                    try {
                        n._processResponse(e)
                    } catch (e) {
                        n.emit("error", e instanceof h ? e : new h({cause: e}))
                    }
                };
                this._performRequest()
            }

            RedirectableRequest.prototype = Object.create(r.prototype);
            RedirectableRequest.prototype.abort = function () {
                destroyRequest(this._currentRequest);
                this._currentRequest.abort();
                this.emit("abort")
            };
            RedirectableRequest.prototype.destroy = function (e) {
                destroyRequest(this._currentRequest, e);
                y.call(this, e);
                return this
            };
            RedirectableRequest.prototype.write = function (e, t, n) {
                if (this._ending) {
                    throw new v
                }
                if (!isString(e) && !isBuffer(e)) {
                    throw new TypeError("data should be a string, Buffer or Uint8Array")
                }
                if (isFunction(t)) {
                    n = t;
                    t = null
                }
                if (e.length === 0) {
                    if (n) {
                        n()
                    }
                    return
                }
                if (this._requestBodyLength + e.length <= this._options.maxBodyLength) {
                    this._requestBodyLength += e.length;
                    this._requestBodyBuffers.push({data: e, encoding: t});
                    this._currentRequest.write(e, t, n)
                } else {
                    this.emit("error", new g);
                    this.abort()
                }
            };
            RedirectableRequest.prototype.end = function (e, t, n) {
                if (isFunction(e)) {
                    n = e;
                    e = t = null
                } else if (isFunction(t)) {
                    n = t;
                    t = null
                }
                if (!e) {
                    this._ended = this._ending = true;
                    this._currentRequest.end(null, null, n)
                } else {
                    var i = this;
                    var s = this._currentRequest;
                    this.write(e, t, (function () {
                        i._ended = true;
                        s.end(null, null, n)
                    }));
                    this._ending = true
                }
            };
            RedirectableRequest.prototype.setHeader = function (e, t) {
                this._options.headers[e] = t;
                this._currentRequest.setHeader(e, t)
            };
            RedirectableRequest.prototype.removeHeader = function (e) {
                delete this._options.headers[e];
                this._currentRequest.removeHeader(e)
            };
            RedirectableRequest.prototype.setTimeout = function (e, t) {
                var n = this;

                function destroyOnTimeout(t) {
                    t.setTimeout(e);
                    t.removeListener("timeout", t.destroy);
                    t.addListener("timeout", t.destroy)
                }

                function startTimer(t) {
                    if (n._timeout) {
                        clearTimeout(n._timeout)
                    }
                    n._timeout = setTimeout((function () {
                        n.emit("timeout");
                        clearTimer()
                    }), e);
                    destroyOnTimeout(t)
                }

                function clearTimer() {
                    if (n._timeout) {
                        clearTimeout(n._timeout);
                        n._timeout = null
                    }
                    n.removeListener("abort", clearTimer);
                    n.removeListener("error", clearTimer);
                    n.removeListener("response", clearTimer);
                    n.removeListener("close", clearTimer);
                    if (t) {
                        n.removeListener("timeout", t)
                    }
                    if (!n.socket) {
                        n._currentRequest.removeListener("socket", startTimer)
                    }
                }

                if (t) {
                    this.on("timeout", t)
                }
                if (this.socket) {
                    startTimer(this.socket)
                } else {
                    this._currentRequest.once("socket", startTimer)
                }
                this.on("socket", destroyOnTimeout);
                this.on("abort", clearTimer);
                this.on("error", clearTimer);
                this.on("response", clearTimer);
                this.on("close", clearTimer);
                return this
            };
            ["flushHeaders", "getHeader", "setNoDelay", "setSocketKeepAlive"].forEach((function (e) {
                RedirectableRequest.prototype[e] = function (t, n) {
                    return this._currentRequest[e](t, n)
                }
            }));
            ["aborted", "connection", "socket"].forEach((function (e) {
                Object.defineProperty(RedirectableRequest.prototype, e, {
                    get: function () {
                        return this._currentRequest[e]
                    }
                })
            }));
            RedirectableRequest.prototype._sanitizeOptions = function (e) {
                if (!e.headers) {
                    e.headers = {}
                }
                if (e.host) {
                    if (!e.hostname) {
                        e.hostname = e.host
                    }
                    delete e.host
                }
                if (!e.pathname && e.path) {
                    var t = e.path.indexOf("?");
                    if (t < 0) {
                        e.pathname = e.path
                    } else {
                        e.pathname = e.path.substring(0, t);
                        e.search = e.path.substring(t)
                    }
                }
            };
            RedirectableRequest.prototype._performRequest = function () {
                var e = this._options.protocol;
                var t = this._options.nativeProtocols[e];
                if (!t) {
                    throw new TypeError("Unsupported protocol " + e)
                }
                if (this._options.agents) {
                    var n = e.slice(0, -1);
                    this._options.agent = this._options.agents[n]
                }
                var s = this._currentRequest = t.request(this._options, this._onNativeResponse);
                s._redirectable = this;
                for (var o of d) {
                    s.on(o, f[o])
                }
                this._currentUrl = /^\//.test(this._options.path) ? i.format(this._options) : this._options.path;
                if (this._isRedirect) {
                    var a = 0;
                    var r = this;
                    var c = this._requestBodyBuffers;
                    (function writeNext(e) {
                        if (s === r._currentRequest) {
                            if (e) {
                                r.emit("error", e)
                            } else if (a < c.length) {
                                var t = c[a++];
                                if (!s.finished) {
                                    s.write(t.data, t.encoding, writeNext)
                                }
                            } else if (r._ended) {
                                s.end()
                            }
                        }
                    })()
                }
            };
            RedirectableRequest.prototype._processResponse = function (e) {
                var t = e.statusCode;
                if (this._options.trackRedirects) {
                    this._redirects.push({url: this._currentUrl, headers: e.headers, statusCode: t})
                }
                var n = e.headers.location;
                if (!n || this._options.followRedirects === false || t < 300 || t >= 400) {
                    e.responseUrl = this._currentUrl;
                    e.redirects = this._redirects;
                    this.emit("response", e);
                    this._requestBodyBuffers = [];
                    return
                }
                destroyRequest(this._currentRequest);
                e.destroy();
                if (++this._redirectCount > this._options.maxRedirects) {
                    throw new x
                }
                var s;
                var o = this._options.beforeRedirect;
                if (o) {
                    s = Object.assign({Host: e.req.getHeader("host")}, this._options.headers)
                }
                var a = this._options.method;
                if ((t === 301 || t === 302) && this._options.method === "POST" || t === 303 && !/^(?:GET|HEAD)$/.test(this._options.method)) {
                    this._options.method = "GET";
                    this._requestBodyBuffers = [];
                    removeMatchingHeaders(/^content-/i, this._options.headers)
                }
                var r = removeMatchingHeaders(/^host$/i, this._options.headers);
                var c = parseUrl(this._currentUrl);
                var p = r || c.host;
                var u = /^\w+:/.test(n) ? this._currentUrl : i.format(Object.assign(c, {host: p}));
                var d = resolveUrl(n, u);
                l("redirecting to", d.href);
                this._isRedirect = true;
                spreadUrlObject(d, this._options);
                if (d.protocol !== c.protocol && d.protocol !== "https:" || d.host !== p && !isSubdomain(d.host, p)) {
                    removeMatchingHeaders(/^(?:(?:proxy-)?authorization|cookie)$/i, this._options.headers)
                }
                if (isFunction(o)) {
                    var f = {headers: e.headers, statusCode: t};
                    var m = {url: u, method: a, headers: s};
                    o(this._options, f, m);
                    this._sanitizeOptions(this._options)
                }
                this._performRequest()
            };

            function wrap(e) {
                var t = {maxRedirects: 21, maxBodyLength: 10 * 1024 * 1024};
                var n = {};
                Object.keys(e).forEach((function (i) {
                    var s = i + ":";
                    var o = n[s] = e[i];
                    var a = t[i] = Object.create(o);

                    function request(e, i, o) {
                        if (isURL(e)) {
                            e = spreadUrlObject(e)
                        } else if (isString(e)) {
                            e = spreadUrlObject(parseUrl(e))
                        } else {
                            o = i;
                            i = validateUrl(e);
                            e = {protocol: s}
                        }
                        if (isFunction(i)) {
                            o = i;
                            i = null
                        }
                        i = Object.assign({maxRedirects: t.maxRedirects, maxBodyLength: t.maxBodyLength}, e, i);
                        i.nativeProtocols = n;
                        if (!isString(i.host) && !isString(i.hostname)) {
                            i.hostname = "::1"
                        }
                        c.equal(i.protocol, s, "protocol mismatch");
                        l("options", i);
                        return new RedirectableRequest(i, o)
                    }

                    function get(e, t, n) {
                        var i = a.request(e, t, n);
                        i.end();
                        return i
                    }

                    Object.defineProperties(a, {
                        request: {
                            value: request,
                            configurable: true,
                            enumerable: true,
                            writable: true
                        }, get: {value: get, configurable: true, enumerable: true, writable: true}
                    })
                }));
                return t
            }

            function noop() {
            }

            function parseUrl(e) {
                var t;
                if (p) {
                    t = new s(e)
                } else {
                    t = validateUrl(i.parse(e));
                    if (!isString(t.protocol)) {
                        throw new m({input: e})
                    }
                }
                return t
            }

            function resolveUrl(e, t) {
                return p ? new s(e, t) : parseUrl(i.resolve(t, e))
            }

            function validateUrl(e) {
                if (/^\[/.test(e.hostname) && !/^\[[:0-9a-f]+\]$/i.test(e.hostname)) {
                    throw new m({input: e.href || e})
                }
                if (/^\[/.test(e.host) && !/^\[[:0-9a-f]+\](:\d+)?$/i.test(e.host)) {
                    throw new m({input: e.href || e})
                }
                return e
            }

            function spreadUrlObject(e, t) {
                var n = t || {};
                for (var i of u) {
                    n[i] = e[i]
                }
                if (n.hostname.startsWith("[")) {
                    n.hostname = n.hostname.slice(1, -1)
                }
                if (n.port !== "") {
                    n.port = Number(n.port)
                }
                n.path = n.search ? n.pathname + n.search : n.pathname;
                return n
            }

            function removeMatchingHeaders(e, t) {
                var n;
                for (var i in t) {
                    if (e.test(i)) {
                        n = t[i];
                        delete t[i]
                    }
                }
                return n === null || typeof n === "undefined" ? undefined : String(n).trim()
            }

            function createErrorType(e, t, n) {
                function CustomError(n) {
                    if (isFunction(Error.captureStackTrace)) {
                        Error.captureStackTrace(this, this.constructor)
                    }
                    Object.assign(this, n || {});
                    this.code = e;
                    this.message = this.cause ? t + ": " + this.cause.message : t
                }

                CustomError.prototype = new (n || Error);
                Object.defineProperties(CustomError.prototype, {
                    constructor: {value: CustomError, enumerable: false},
                    name: {value: "Error [" + e + "]", enumerable: false}
                });
                return CustomError
            }

            function destroyRequest(e, t) {
                for (var n of d) {
                    e.removeListener(n, f[n])
                }
                e.on("error", noop);
                e.destroy(t)
            }

            function isSubdomain(e, t) {
                c(isString(e) && isString(t));
                var n = e.length - t.length - 1;
                return n > 0 && e[n] === "." && e.endsWith(t)
            }

            function isString(e) {
                return typeof e === "string" || e instanceof String
            }

            function isFunction(e) {
                return typeof e === "function"
            }

            function isBuffer(e) {
                return typeof e === "object" && "length" in e
            }

            function isURL(e) {
                return s && e instanceof s
            }

            e.exports = wrap({http: o, https: a});
            e.exports.wrap = wrap
        }, 3846: (e, t, n) => {
            "use strict";
            var i = n(4398);
            var s = n(9023);
            var o = n(6928);
            var a = n(8611);
            var r = n(5692);
            var c = n(7016).parse;
            var l = n(9896);
            var p = n(2203).Stream;
            var u = n(6982);
            var d = n(6720);
            var f = n(108);
            var m = n(3980);
            var h = n(8508);
            var x = n(6139);

            function FormData(e) {
                if (!(this instanceof FormData)) {
                    return new FormData(e)
                }
                this._overheadLength = 0;
                this._valueLength = 0;
                this._valuesToMeasure = [];
                i.call(this);
                e = e || {};
                for (var t in e) {
                    this[t] = e[t]
                }
            }

            s.inherits(FormData, i);
            FormData.LINE_BREAK = "\r\n";
            FormData.DEFAULT_CONTENT_TYPE = "application/octet-stream";
            FormData.prototype.append = function (e, t, n) {
                n = n || {};
                if (typeof n === "string") {
                    n = {filename: n}
                }
                var s = i.prototype.append.bind(this);
                if (typeof t === "number" || t == null) {
                    t = String(t)
                }
                if (Array.isArray(t)) {
                    this._error(new Error("Arrays are not supported."));
                    return
                }
                var o = this._multiPartHeader(e, t, n);
                var a = this._multiPartFooter();
                s(o);
                s(t);
                s(a);
                this._trackLength(o, t, n)
            };
            FormData.prototype._trackLength = function (e, t, n) {
                var i = 0;
                if (n.knownLength != null) {
                    i += Number(n.knownLength)
                } else if (Buffer.isBuffer(t)) {
                    i = t.length
                } else if (typeof t === "string") {
                    i = Buffer.byteLength(t)
                }
                this._valueLength += i;
                this._overheadLength += Buffer.byteLength(e) + FormData.LINE_BREAK.length;
                if (!t || !t.path && !(t.readable && h(t, "httpVersion")) && !(t instanceof p)) {
                    return
                }
                if (!n.knownLength) {
                    this._valuesToMeasure.push(t)
                }
            };
            FormData.prototype._lengthRetriever = function (e, t) {
                if (h(e, "fd")) {
                    if (e.end != undefined && e.end != Infinity && e.start != undefined) {
                        t(null, e.end + 1 - (e.start ? e.start : 0))
                    } else {
                        l.stat(e.path, (function (n, i) {
                            if (n) {
                                t(n);
                                return
                            }
                            var s = i.size - (e.start ? e.start : 0);
                            t(null, s)
                        }))
                    }
                } else if (h(e, "httpVersion")) {
                    t(null, Number(e.headers["content-length"]))
                } else if (h(e, "httpModule")) {
                    e.on("response", (function (n) {
                        e.pause();
                        t(null, Number(n.headers["content-length"]))
                    }));
                    e.resume()
                } else {
                    t("Unknown stream")
                }
            };
            FormData.prototype._multiPartHeader = function (e, t, n) {
                if (typeof n.header === "string") {
                    return n.header
                }
                var i = this._getContentDisposition(t, n);
                var s = this._getContentType(t, n);
                var o = "";
                var a = {
                    "Content-Disposition": ["form-data", 'name="' + e + '"'].concat(i || []),
                    "Content-Type": [].concat(s || [])
                };
                if (typeof n.header === "object") {
                    x(a, n.header)
                }
                var r;
                for (var c in a) {
                    if (h(a, c)) {
                        r = a[c];
                        if (r == null) {
                            continue
                        }
                        if (!Array.isArray(r)) {
                            r = [r]
                        }
                        if (r.length) {
                            o += c + ": " + r.join("; ") + FormData.LINE_BREAK
                        }
                    }
                }
                return "--" + this.getBoundary() + FormData.LINE_BREAK + o + FormData.LINE_BREAK
            };
            FormData.prototype._getContentDisposition = function (e, t) {
                var n;
                if (typeof t.filepath === "string") {
                    n = o.normalize(t.filepath).replace(/\\/g, "/")
                } else if (t.filename || e && (e.name || e.path)) {
                    n = o.basename(t.filename || e && (e.name || e.path))
                } else if (e && e.readable && h(e, "httpVersion")) {
                    n = o.basename(e.client._httpMessage.path || "")
                }
                if (n) {
                    return 'filename="' + n + '"'
                }
            };
            FormData.prototype._getContentType = function (e, t) {
                var n = t.contentType;
                if (!n && e && e.name) {
                    n = d.lookup(e.name)
                }
                if (!n && e && e.path) {
                    n = d.lookup(e.path)
                }
                if (!n && e && e.readable && h(e, "httpVersion")) {
                    n = e.headers["content-type"]
                }
                if (!n && (t.filepath || t.filename)) {
                    n = d.lookup(t.filepath || t.filename)
                }
                if (!n && e && typeof e === "object") {
                    n = FormData.DEFAULT_CONTENT_TYPE
                }
                return n
            };
            FormData.prototype._multiPartFooter = function () {
                return function (e) {
                    var t = FormData.LINE_BREAK;
                    var n = this._streams.length === 0;
                    if (n) {
                        t += this._lastBoundary()
                    }
                    e(t)
                }.bind(this)
            };
            FormData.prototype._lastBoundary = function () {
                return "--" + this.getBoundary() + "--" + FormData.LINE_BREAK
            };
            FormData.prototype.getHeaders = function (e) {
                var t;
                var n = {"content-type": "multipart/form-data; boundary=" + this.getBoundary()};
                for (t in e) {
                    if (h(e, t)) {
                        n[t.toLowerCase()] = e[t]
                    }
                }
                return n
            };
            FormData.prototype.setBoundary = function (e) {
                if (typeof e !== "string") {
                    throw new TypeError("FormData boundary must be a string")
                }
                this._boundary = e
            };
            FormData.prototype.getBoundary = function () {
                if (!this._boundary) {
                    this._generateBoundary()
                }
                return this._boundary
            };
            FormData.prototype.getBuffer = function () {
                var e = new Buffer.alloc(0);
                var t = this.getBoundary();
                for (var n = 0, i = this._streams.length; n < i; n++) {
                    if (typeof this._streams[n] !== "function") {
                        if (Buffer.isBuffer(this._streams[n])) {
                            e = Buffer.concat([e, this._streams[n]])
                        } else {
                            e = Buffer.concat([e, Buffer.from(this._streams[n])])
                        }
                        if (typeof this._streams[n] !== "string" || this._streams[n].substring(2, t.length + 2) !== t) {
                            e = Buffer.concat([e, Buffer.from(FormData.LINE_BREAK)])
                        }
                    }
                }
                return Buffer.concat([e, Buffer.from(this._lastBoundary())])
            };
            FormData.prototype._generateBoundary = function () {
                this._boundary = "--------------------------" + u.randomBytes(12).toString("hex")
            };
            FormData.prototype.getLengthSync = function () {
                var e = this._overheadLength + this._valueLength;
                if (this._streams.length) {
                    e += this._lastBoundary().length
                }
                if (!this.hasKnownLength()) {
                    this._error(new Error("Cannot calculate proper length in synchronous way."))
                }
                return e
            };
            FormData.prototype.hasKnownLength = function () {
                var e = true;
                if (this._valuesToMeasure.length) {
                    e = false
                }
                return e
            };
            FormData.prototype.getLength = function (e) {
                var t = this._overheadLength + this._valueLength;
                if (this._streams.length) {
                    t += this._lastBoundary().length
                }
                if (!this._valuesToMeasure.length) {
                    process.nextTick(e.bind(this, null, t));
                    return
                }
                f.parallel(this._valuesToMeasure, this._lengthRetriever, (function (n, i) {
                    if (n) {
                        e(n);
                        return
                    }
                    i.forEach((function (e) {
                        t += e
                    }));
                    e(null, t)
                }))
            };
            FormData.prototype.submit = function (e, t) {
                var n;
                var i;
                var s = {method: "post"};
                if (typeof e === "string") {
                    e = c(e);
                    i = x({port: e.port, path: e.pathname, host: e.hostname, protocol: e.protocol}, s)
                } else {
                    i = x(e, s);
                    if (!i.port) {
                        i.port = i.protocol === "https:" ? 443 : 80
                    }
                }
                i.headers = this.getHeaders(e.headers);
                if (i.protocol === "https:") {
                    n = r.request(i)
                } else {
                    n = a.request(i)
                }
                this.getLength(function (e, i) {
                    if (e && e !== "Unknown stream") {
                        this._error(e);
                        return
                    }
                    if (i) {
                        n.setHeader("Content-Length", i)
                    }
                    this.pipe(n);
                    if (t) {
                        var s;
                        var callback = function (e, i) {
                            n.removeListener("error", callback);
                            n.removeListener("response", s);
                            return t.call(this, e, i)
                        };
                        s = callback.bind(this, null);
                        n.on("error", callback);
                        n.on("response", s)
                    }
                }.bind(this));
                return n
            };
            FormData.prototype._error = function (e) {
                if (!this.error) {
                    this.error = e;
                    this.pause();
                    this.emit("error", e)
                }
            };
            FormData.prototype.toString = function () {
                return "[object FormData]"
            };
            m(FormData, "FormData");
            e.exports = FormData
        }, 6139: e => {
            "use strict";
            e.exports = function (e, t) {
                Object.keys(t).forEach((function (n) {
                    e[n] = e[n] || t[n]
                }));
                return e
            }
        }, 7888: e => {
            "use strict";
            var t = "Function.prototype.bind called on incompatible ";
            var n = Object.prototype.toString;
            var i = Math.max;
            var s = "[object Function]";
            var o = function concatty(e, t) {
                var n = [];
                for (var i = 0; i < e.length; i += 1) {
                    n[i] = e[i]
                }
                for (var s = 0; s < t.length; s += 1) {
                    n[s + e.length] = t[s]
                }
                return n
            };
            var a = function slicy(e, t) {
                var n = [];
                for (var i = t || 0, s = 0; i < e.length; i += 1, s += 1) {
                    n[s] = e[i]
                }
                return n
            };
            var joiny = function (e, t) {
                var n = "";
                for (var i = 0; i < e.length; i += 1) {
                    n += e[i];
                    if (i + 1 < e.length) {
                        n += t
                    }
                }
                return n
            };
            e.exports = function bind(e) {
                var r = this;
                if (typeof r !== "function" || n.apply(r) !== s) {
                    throw new TypeError(t + r)
                }
                var c = a(arguments, 1);
                var l;
                var binder = function () {
                    if (this instanceof l) {
                        var t = r.apply(this, o(c, arguments));
                        if (Object(t) === t) {
                            return t
                        }
                        return this
                    }
                    return r.apply(e, o(c, arguments))
                };
                var p = i(0, r.length - c.length);
                var u = [];
                for (var d = 0; d < p; d++) {
                    u[d] = "$" + d
                }
                l = Function("binder", "return function (" + joiny(u, ",") + "){ return binder.apply(this,arguments); }")(binder);
                if (r.prototype) {
                    var f = function Empty() {
                    };
                    f.prototype = r.prototype;
                    l.prototype = new f;
                    f.prototype = null
                }
                return l
            }
        }, 7756: (e, t, n) => {
            "use strict";
            var i = n(7888);
            e.exports = Function.prototype.bind || i
        }, 4022: (e, t, n) => {
            "use strict";
            var i;
            var s = n(1111);
            var o = n(6980);
            var a = n(3168);
            var r = n(3673);
            var c = n(8745);
            var l = n(1241);
            var p = n(178);
            var u = n(8898);
            var d = n(4841);
            var f = n(3515);
            var m = n(6379);
            var h = n(7721);
            var x = n(3171);
            var g = n(4077);
            var v = n(3628);
            var y = Function;
            var getEvalledConstructor = function (e) {
                try {
                    return y('"use strict"; return (' + e + ").constructor;")()
                } catch (e) {
                }
            };
            var b = n(2674);
            var w = n(2470);
            var throwTypeError = function () {
                throw new p
            };
            var S = b ? function () {
                try {
                    arguments.callee;
                    return throwTypeError
                } catch (e) {
                    try {
                        return b(arguments, "callee").get
                    } catch (e) {
                        return throwTypeError
                    }
                }
            }() : throwTypeError;
            var _ = n(1512)();
            var k = n(2607);
            var E = n(6399);
            var O = n(9689);
            var C = n(9049);
            var T = n(2765);
            var F = {};
            var A = typeof Uint8Array === "undefined" || !k ? i : k(Uint8Array);
            var j = {
                __proto__: null,
                "%AggregateError%": typeof AggregateError === "undefined" ? i : AggregateError,
                "%Array%": Array,
                "%ArrayBuffer%": typeof ArrayBuffer === "undefined" ? i : ArrayBuffer,
                "%ArrayIteratorPrototype%": _ && k ? k([][Symbol.iterator]()) : i,
                "%AsyncFromSyncIteratorPrototype%": i,
                "%AsyncFunction%": F,
                "%AsyncGenerator%": F,
                "%AsyncGeneratorFunction%": F,
                "%AsyncIteratorPrototype%": F,
                "%Atomics%": typeof Atomics === "undefined" ? i : Atomics,
                "%BigInt%": typeof BigInt === "undefined" ? i : BigInt,
                "%BigInt64Array%": typeof BigInt64Array === "undefined" ? i : BigInt64Array,
                "%BigUint64Array%": typeof BigUint64Array === "undefined" ? i : BigUint64Array,
                "%Boolean%": Boolean,
                "%DataView%": typeof DataView === "undefined" ? i : DataView,
                "%Date%": Date,
                "%decodeURI%": decodeURI,
                "%decodeURIComponent%": decodeURIComponent,
                "%encodeURI%": encodeURI,
                "%encodeURIComponent%": encodeURIComponent,
                "%Error%": o,
                "%eval%": eval,
                "%EvalError%": a,
                "%Float16Array%": typeof Float16Array === "undefined" ? i : Float16Array,
                "%Float32Array%": typeof Float32Array === "undefined" ? i : Float32Array,
                "%Float64Array%": typeof Float64Array === "undefined" ? i : Float64Array,
                "%FinalizationRegistry%": typeof FinalizationRegistry === "undefined" ? i : FinalizationRegistry,
                "%Function%": y,
                "%GeneratorFunction%": F,
                "%Int8Array%": typeof Int8Array === "undefined" ? i : Int8Array,
                "%Int16Array%": typeof Int16Array === "undefined" ? i : Int16Array,
                "%Int32Array%": typeof Int32Array === "undefined" ? i : Int32Array,
                "%isFinite%": isFinite,
                "%isNaN%": isNaN,
                "%IteratorPrototype%": _ && k ? k(k([][Symbol.iterator]())) : i,
                "%JSON%": typeof JSON === "object" ? JSON : i,
                "%Map%": typeof Map === "undefined" ? i : Map,
                "%MapIteratorPrototype%": typeof Map === "undefined" || !_ || !k ? i : k((new Map)[Symbol.iterator]()),
                "%Math%": Math,
                "%Number%": Number,
                "%Object%": s,
                "%Object.getOwnPropertyDescriptor%": b,
                "%parseFloat%": parseFloat,
                "%parseInt%": parseInt,
                "%Promise%": typeof Promise === "undefined" ? i : Promise,
                "%Proxy%": typeof Proxy === "undefined" ? i : Proxy,
                "%RangeError%": r,
                "%ReferenceError%": c,
                "%Reflect%": typeof Reflect === "undefined" ? i : Reflect,
                "%RegExp%": RegExp,
                "%Set%": typeof Set === "undefined" ? i : Set,
                "%SetIteratorPrototype%": typeof Set === "undefined" || !_ || !k ? i : k((new Set)[Symbol.iterator]()),
                "%SharedArrayBuffer%": typeof SharedArrayBuffer === "undefined" ? i : SharedArrayBuffer,
                "%String%": String,
                "%StringIteratorPrototype%": _ && k ? k(""[Symbol.iterator]()) : i,
                "%Symbol%": _ ? Symbol : i,
                "%SyntaxError%": l,
                "%ThrowTypeError%": S,
                "%TypedArray%": A,
                "%TypeError%": p,
                "%Uint8Array%": typeof Uint8Array === "undefined" ? i : Uint8Array,
                "%Uint8ClampedArray%": typeof Uint8ClampedArray === "undefined" ? i : Uint8ClampedArray,
                "%Uint16Array%": typeof Uint16Array === "undefined" ? i : Uint16Array,
                "%Uint32Array%": typeof Uint32Array === "undefined" ? i : Uint32Array,
                "%URIError%": u,
                "%WeakMap%": typeof WeakMap === "undefined" ? i : WeakMap,
                "%WeakRef%": typeof WeakRef === "undefined" ? i : WeakRef,
                "%WeakSet%": typeof WeakSet === "undefined" ? i : WeakSet,
                "%Function.prototype.call%": T,
                "%Function.prototype.apply%": C,
                "%Object.defineProperty%": w,
                "%Object.getPrototypeOf%": E,
                "%Math.abs%": d,
                "%Math.floor%": f,
                "%Math.max%": m,
                "%Math.min%": h,
                "%Math.pow%": x,
                "%Math.round%": g,
                "%Math.sign%": v,
                "%Reflect.getPrototypeOf%": O
            };
            if (k) {
                try {
                    null.error
                } catch (e) {
                    var R = k(k(e));
                    j["%Error.prototype%"] = R
                }
            }
            var L = function doEval(e) {
                var t;
                if (e === "%AsyncFunction%") {
                    t = getEvalledConstructor("async function () {}")
                } else if (e === "%GeneratorFunction%") {
                    t = getEvalledConstructor("function* () {}")
                } else if (e === "%AsyncGeneratorFunction%") {
                    t = getEvalledConstructor("async function* () {}")
                } else if (e === "%AsyncGenerator%") {
                    var n = doEval("%AsyncGeneratorFunction%");
                    if (n) {
                        t = n.prototype
                    }
                } else if (e === "%AsyncIteratorPrototype%") {
                    var i = doEval("%AsyncGenerator%");
                    if (i && k) {
                        t = k(i.prototype)
                    }
                }
                j[e] = t;
                return t
            };
            var P = {
                __proto__: null,
                "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
                "%ArrayPrototype%": ["Array", "prototype"],
                "%ArrayProto_entries%": ["Array", "prototype", "entries"],
                "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
                "%ArrayProto_keys%": ["Array", "prototype", "keys"],
                "%ArrayProto_values%": ["Array", "prototype", "values"],
                "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
                "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
                "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
                "%BooleanPrototype%": ["Boolean", "prototype"],
                "%DataViewPrototype%": ["DataView", "prototype"],
                "%DatePrototype%": ["Date", "prototype"],
                "%ErrorPrototype%": ["Error", "prototype"],
                "%EvalErrorPrototype%": ["EvalError", "prototype"],
                "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
                "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
                "%FunctionPrototype%": ["Function", "prototype"],
                "%Generator%": ["GeneratorFunction", "prototype"],
                "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
                "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
                "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
                "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
                "%JSONParse%": ["JSON", "parse"],
                "%JSONStringify%": ["JSON", "stringify"],
                "%MapPrototype%": ["Map", "prototype"],
                "%NumberPrototype%": ["Number", "prototype"],
                "%ObjectPrototype%": ["Object", "prototype"],
                "%ObjProto_toString%": ["Object", "prototype", "toString"],
                "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
                "%PromisePrototype%": ["Promise", "prototype"],
                "%PromiseProto_then%": ["Promise", "prototype", "then"],
                "%Promise_all%": ["Promise", "all"],
                "%Promise_reject%": ["Promise", "reject"],
                "%Promise_resolve%": ["Promise", "resolve"],
                "%RangeErrorPrototype%": ["RangeError", "prototype"],
                "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
                "%RegExpPrototype%": ["RegExp", "prototype"],
                "%SetPrototype%": ["Set", "prototype"],
                "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
                "%StringPrototype%": ["String", "prototype"],
                "%SymbolPrototype%": ["Symbol", "prototype"],
                "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
                "%TypedArrayPrototype%": ["TypedArray", "prototype"],
                "%TypeErrorPrototype%": ["TypeError", "prototype"],
                "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
                "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
                "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
                "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
                "%URIErrorPrototype%": ["URIError", "prototype"],
                "%WeakMapPrototype%": ["WeakMap", "prototype"],
                "%WeakSetPrototype%": ["WeakSet", "prototype"]
            };
            var D = n(7756);
            var N = n(8508);
            var I = D.call(T, Array.prototype.concat);
            var B = D.call(C, Array.prototype.splice);
            var M = D.call(T, String.prototype.replace);
            var U = D.call(T, String.prototype.slice);
            var z = D.call(T, RegExp.prototype.exec);
            var $ = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
            var q = /\\(\\)?/g;
            var W = function stringToPath(e) {
                var t = U(e, 0, 1);
                var n = U(e, -1);
                if (t === "%" && n !== "%") {
                    throw new l("invalid intrinsic syntax, expected closing `%`")
                } else if (n === "%" && t !== "%") {
                    throw new l("invalid intrinsic syntax, expected opening `%`")
                }
                var i = [];
                M(e, $, (function (e, t, n, s) {
                    i[i.length] = n ? M(s, q, "$1") : t || e
                }));
                return i
            };
            var H = function getBaseIntrinsic(e, t) {
                var n = e;
                var i;
                if (N(P, n)) {
                    i = P[n];
                    n = "%" + i[0] + "%"
                }
                if (N(j, n)) {
                    var s = j[n];
                    if (s === F) {
                        s = L(n)
                    }
                    if (typeof s === "undefined" && !t) {
                        throw new p("intrinsic " + e + " exists, but is not available. Please file an issue!")
                    }
                    return {alias: i, name: n, value: s}
                }
                throw new l("intrinsic " + e + " does not exist!")
            };
            e.exports = function GetIntrinsic(e, t) {
                if (typeof e !== "string" || e.length === 0) {
                    throw new p("intrinsic name must be a non-empty string")
                }
                if (arguments.length > 1 && typeof t !== "boolean") {
                    throw new p('"allowMissing" argument must be a boolean')
                }
                if (z(/^%?[^%]*%?$/, e) === null) {
                    throw new l("`%` may not be present anywhere but at the beginning and end of the intrinsic name")
                }
                var n = W(e);
                var s = n.length > 0 ? n[0] : "";
                var o = H("%" + s + "%", t);
                var a = o.name;
                var r = o.value;
                var c = false;
                var u = o.alias;
                if (u) {
                    s = u[0];
                    B(n, I([0, 1], u))
                }
                for (var d = 1, f = true; d < n.length; d += 1) {
                    var m = n[d];
                    var h = U(m, 0, 1);
                    var x = U(m, -1);
                    if ((h === '"' || h === "'" || h === "`" || (x === '"' || x === "'" || x === "`")) && h !== x) {
                        throw new l("property names with quotes must have matching quotes")
                    }
                    if (m === "constructor" || !f) {
                        c = true
                    }
                    s += "." + m;
                    a = "%" + s + "%";
                    if (N(j, a)) {
                        r = j[a]
                    } else if (r != null) {
                        if (!(m in r)) {
                            if (!t) {
                                throw new p("base intrinsic for " + e + " exists, but the property is not available.")
                            }
                            return void i
                        }
                        if (b && d + 1 >= n.length) {
                            var g = b(r, m);
                            f = !!g;
                            if (f && "get" in g && !("originalValue" in g.get)) {
                                r = g.get
                            } else {
                                r = r[m]
                            }
                        } else {
                            f = N(r, m);
                            r = r[m]
                        }
                        if (f && !c) {
                            j[a] = r
                        }
                    }
                }
                return r
            }
        }, 6399: (e, t, n) => {
            "use strict";
            var i = n(1111);
            e.exports = i.getPrototypeOf || null
        }, 9689: e => {
            "use strict";
            e.exports = typeof Reflect !== "undefined" && Reflect.getPrototypeOf || null
        }, 2607: (e, t, n) => {
            "use strict";
            var i = n(9689);
            var s = n(6399);
            var o = n(4762);
            e.exports = i ? function getProto(e) {
                return i(e)
            } : s ? function getProto(e) {
                if (!e || typeof e !== "object" && typeof e !== "function") {
                    throw new TypeError("getProto: not an object")
                }
                return s(e)
            } : o ? function getProto(e) {
                return o(e)
            } : null
        }, 8790: e => {
            "use strict";
            e.exports = Object.getOwnPropertyDescriptor
        }, 2674: (e, t, n) => {
            "use strict";
            var i = n(8790);
            if (i) {
                try {
                    i([], "length")
                } catch (e) {
                    i = null
                }
            }
            e.exports = i
        }, 7148: e => {
            "use strict";
            e.exports = clone;
            var t = Object.getPrototypeOf || function (e) {
                return e.__proto__
            };

            function clone(e) {
                if (e === null || typeof e !== "object") return e;
                if (e instanceof Object) var n = {__proto__: t(e)}; else var n = Object.create(null);
                Object.getOwnPropertyNames(e).forEach((function (t) {
                    Object.defineProperty(n, t, Object.getOwnPropertyDescriptor(e, t))
                }));
                return n
            }
        }, 4896: (e, t, n) => {
            var i = n(9896);
            var s = n(7517);
            var o = n(1998);
            var a = n(7148);
            var r = n(9023);
            var c;
            var l;
            if (typeof Symbol === "function" && typeof Symbol.for === "function") {
                c = Symbol.for("graceful-fs.queue");
                l = Symbol.for("graceful-fs.previous")
            } else {
                c = "___graceful-fs.queue";
                l = "___graceful-fs.previous"
            }

            function noop() {
            }

            function publishQueue(e, t) {
                Object.defineProperty(e, c, {
                    get: function () {
                        return t
                    }
                })
            }

            var p = noop;
            if (r.debuglog) p = r.debuglog("gfs4"); else if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || "")) p = function () {
                var e = r.format.apply(r, arguments);
                e = "GFS4: " + e.split(/\n/).join("\nGFS4: ");
                console.error(e)
            };
            if (!i[c]) {
                var u = global[c] || [];
                publishQueue(i, u);
                i.close = function (e) {
                    function close(t, n) {
                        return e.call(i, t, (function (e) {
                            if (!e) {
                                resetQueue()
                            }
                            if (typeof n === "function") n.apply(this, arguments)
                        }))
                    }

                    Object.defineProperty(close, l, {value: e});
                    return close
                }(i.close);
                i.closeSync = function (e) {
                    function closeSync(t) {
                        e.apply(i, arguments);
                        resetQueue()
                    }

                    Object.defineProperty(closeSync, l, {value: e});
                    return closeSync
                }(i.closeSync);
                if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || "")) {
                    process.on("exit", (function () {
                        p(i[c]);
                        n(2613).equal(i[c].length, 0)
                    }))
                }
            }
            if (!global[c]) {
                publishQueue(global, i[c])
            }
            e.exports = patch(a(i));
            if (process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !i.__patched) {
                e.exports = patch(i);
                i.__patched = true
            }

            function patch(e) {
                s(e);
                e.gracefulify = patch;
                e.createReadStream = createReadStream;
                e.createWriteStream = createWriteStream;
                var t = e.readFile;
                e.readFile = readFile;

                function readFile(e, n, i) {
                    if (typeof n === "function") i = n, n = null;
                    return go$readFile(e, n, i);

                    function go$readFile(e, n, i, s) {
                        return t(e, n, (function (t) {
                            if (t && (t.code === "EMFILE" || t.code === "ENFILE")) enqueue([go$readFile, [e, n, i], t, s || Date.now(), Date.now()]); else {
                                if (typeof i === "function") i.apply(this, arguments)
                            }
                        }))
                    }
                }

                var n = e.writeFile;
                e.writeFile = writeFile;

                function writeFile(e, t, i, s) {
                    if (typeof i === "function") s = i, i = null;
                    return go$writeFile(e, t, i, s);

                    function go$writeFile(e, t, i, s, o) {
                        return n(e, t, i, (function (n) {
                            if (n && (n.code === "EMFILE" || n.code === "ENFILE")) enqueue([go$writeFile, [e, t, i, s], n, o || Date.now(), Date.now()]); else {
                                if (typeof s === "function") s.apply(this, arguments)
                            }
                        }))
                    }
                }

                var i = e.appendFile;
                if (i) e.appendFile = appendFile;

                function appendFile(e, t, n, s) {
                    if (typeof n === "function") s = n, n = null;
                    return go$appendFile(e, t, n, s);

                    function go$appendFile(e, t, n, s, o) {
                        return i(e, t, n, (function (i) {
                            if (i && (i.code === "EMFILE" || i.code === "ENFILE")) enqueue([go$appendFile, [e, t, n, s], i, o || Date.now(), Date.now()]); else {
                                if (typeof s === "function") s.apply(this, arguments)
                            }
                        }))
                    }
                }

                var a = e.copyFile;
                if (a) e.copyFile = copyFile;

                function copyFile(e, t, n, i) {
                    if (typeof n === "function") {
                        i = n;
                        n = 0
                    }
                    return go$copyFile(e, t, n, i);

                    function go$copyFile(e, t, n, i, s) {
                        return a(e, t, n, (function (o) {
                            if (o && (o.code === "EMFILE" || o.code === "ENFILE")) enqueue([go$copyFile, [e, t, n, i], o, s || Date.now(), Date.now()]); else {
                                if (typeof i === "function") i.apply(this, arguments)
                            }
                        }))
                    }
                }

                var r = e.readdir;
                e.readdir = readdir;
                var c = /^v[0-5]\./;

                function readdir(e, t, n) {
                    if (typeof t === "function") n = t, t = null;
                    var i = c.test(process.version) ? function go$readdir(e, t, n, i) {
                        return r(e, fs$readdirCallback(e, t, n, i))
                    } : function go$readdir(e, t, n, i) {
                        return r(e, t, fs$readdirCallback(e, t, n, i))
                    };
                    return i(e, t, n);

                    function fs$readdirCallback(e, t, n, s) {
                        return function (o, a) {
                            if (o && (o.code === "EMFILE" || o.code === "ENFILE")) enqueue([i, [e, t, n], o, s || Date.now(), Date.now()]); else {
                                if (a && a.sort) a.sort();
                                if (typeof n === "function") n.call(this, o, a)
                            }
                        }
                    }
                }

                if (process.version.substr(0, 4) === "v0.8") {
                    var l = o(e);
                    ReadStream = l.ReadStream;
                    WriteStream = l.WriteStream
                }
                var p = e.ReadStream;
                if (p) {
                    ReadStream.prototype = Object.create(p.prototype);
                    ReadStream.prototype.open = ReadStream$open
                }
                var u = e.WriteStream;
                if (u) {
                    WriteStream.prototype = Object.create(u.prototype);
                    WriteStream.prototype.open = WriteStream$open
                }
                Object.defineProperty(e, "ReadStream", {
                    get: function () {
                        return ReadStream
                    }, set: function (e) {
                        ReadStream = e
                    }, enumerable: true, configurable: true
                });
                Object.defineProperty(e, "WriteStream", {
                    get: function () {
                        return WriteStream
                    }, set: function (e) {
                        WriteStream = e
                    }, enumerable: true, configurable: true
                });
                var d = ReadStream;
                Object.defineProperty(e, "FileReadStream", {
                    get: function () {
                        return d
                    }, set: function (e) {
                        d = e
                    }, enumerable: true, configurable: true
                });
                var f = WriteStream;
                Object.defineProperty(e, "FileWriteStream", {
                    get: function () {
                        return f
                    }, set: function (e) {
                        f = e
                    }, enumerable: true, configurable: true
                });

                function ReadStream(e, t) {
                    if (this instanceof ReadStream) return p.apply(this, arguments), this; else return ReadStream.apply(Object.create(ReadStream.prototype), arguments)
                }

                function ReadStream$open() {
                    var e = this;
                    open(e.path, e.flags, e.mode, (function (t, n) {
                        if (t) {
                            if (e.autoClose) e.destroy();
                            e.emit("error", t)
                        } else {
                            e.fd = n;
                            e.emit("open", n);
                            e.read()
                        }
                    }))
                }

                function WriteStream(e, t) {
                    if (this instanceof WriteStream) return u.apply(this, arguments), this; else return WriteStream.apply(Object.create(WriteStream.prototype), arguments)
                }

                function WriteStream$open() {
                    var e = this;
                    open(e.path, e.flags, e.mode, (function (t, n) {
                        if (t) {
                            e.destroy();
                            e.emit("error", t)
                        } else {
                            e.fd = n;
                            e.emit("open", n)
                        }
                    }))
                }

                function createReadStream(t, n) {
                    return new e.ReadStream(t, n)
                }

                function createWriteStream(t, n) {
                    return new e.WriteStream(t, n)
                }

                var m = e.open;
                e.open = open;

                function open(e, t, n, i) {
                    if (typeof n === "function") i = n, n = null;
                    return go$open(e, t, n, i);

                    function go$open(e, t, n, i, s) {
                        return m(e, t, n, (function (o, a) {
                            if (o && (o.code === "EMFILE" || o.code === "ENFILE")) enqueue([go$open, [e, t, n, i], o, s || Date.now(), Date.now()]); else {
                                if (typeof i === "function") i.apply(this, arguments)
                            }
                        }))
                    }
                }

                return e
            }

            function enqueue(e) {
                p("ENQUEUE", e[0].name, e[1]);
                i[c].push(e);
                retry()
            }

            var d;

            function resetQueue() {
                var e = Date.now();
                for (var t = 0; t < i[c].length; ++t) {
                    if (i[c][t].length > 2) {
                        i[c][t][3] = e;
                        i[c][t][4] = e
                    }
                }
                retry()
            }

            function retry() {
                clearTimeout(d);
                d = undefined;
                if (i[c].length === 0) return;
                var e = i[c].shift();
                var t = e[0];
                var n = e[1];
                var s = e[2];
                var o = e[3];
                var a = e[4];
                if (o === undefined) {
                    p("RETRY", t.name, n);
                    t.apply(null, n)
                } else if (Date.now() - o >= 6e4) {
                    p("TIMEOUT", t.name, n);
                    var r = n.pop();
                    if (typeof r === "function") r.call(null, s)
                } else {
                    var l = Date.now() - a;
                    var u = Math.max(a - o, 1);
                    var f = Math.min(u * 1.2, 100);
                    if (l >= f) {
                        p("RETRY", t.name, n);
                        t.apply(null, n.concat([o]))
                    } else {
                        i[c].push(e)
                    }
                }
                if (d === undefined) {
                    d = setTimeout(retry, 0)
                }
            }
        }, 1998: (e, t, n) => {
            var i = n(2203).Stream;
            e.exports = legacy;

            function legacy(e) {
                return {ReadStream: ReadStream, WriteStream: WriteStream};

                function ReadStream(t, n) {
                    if (!(this instanceof ReadStream)) return new ReadStream(t, n);
                    i.call(this);
                    var s = this;
                    this.path = t;
                    this.fd = null;
                    this.readable = true;
                    this.paused = false;
                    this.flags = "r";
                    this.mode = 438;
                    this.bufferSize = 64 * 1024;
                    n = n || {};
                    var o = Object.keys(n);
                    for (var a = 0, r = o.length; a < r; a++) {
                        var c = o[a];
                        this[c] = n[c]
                    }
                    if (this.encoding) this.setEncoding(this.encoding);
                    if (this.start !== undefined) {
                        if ("number" !== typeof this.start) {
                            throw TypeError("start must be a Number")
                        }
                        if (this.end === undefined) {
                            this.end = Infinity
                        } else if ("number" !== typeof this.end) {
                            throw TypeError("end must be a Number")
                        }
                        if (this.start > this.end) {
                            throw new Error("start must be <= end")
                        }
                        this.pos = this.start
                    }
                    if (this.fd !== null) {
                        process.nextTick((function () {
                            s._read()
                        }));
                        return
                    }
                    e.open(this.path, this.flags, this.mode, (function (e, t) {
                        if (e) {
                            s.emit("error", e);
                            s.readable = false;
                            return
                        }
                        s.fd = t;
                        s.emit("open", t);
                        s._read()
                    }))
                }

                function WriteStream(t, n) {
                    if (!(this instanceof WriteStream)) return new WriteStream(t, n);
                    i.call(this);
                    this.path = t;
                    this.fd = null;
                    this.writable = true;
                    this.flags = "w";
                    this.encoding = "binary";
                    this.mode = 438;
                    this.bytesWritten = 0;
                    n = n || {};
                    var s = Object.keys(n);
                    for (var o = 0, a = s.length; o < a; o++) {
                        var r = s[o];
                        this[r] = n[r]
                    }
                    if (this.start !== undefined) {
                        if ("number" !== typeof this.start) {
                            throw TypeError("start must be a Number")
                        }
                        if (this.start < 0) {
                            throw new Error("start must be >= zero")
                        }
                        this.pos = this.start
                    }
                    this.busy = false;
                    this._queue = [];
                    if (this.fd === null) {
                        this._open = e.open;
                        this._queue.push([this._open, this.path, this.flags, this.mode, undefined]);
                        this.flush()
                    }
                }
            }
        }, 7517: (e, t, n) => {
            var i = n(9140);
            var s = process.cwd;
            var o = null;
            var a = process.env.GRACEFUL_FS_PLATFORM || process.platform;
            process.cwd = function () {
                if (!o) o = s.call(process);
                return o
            };
            try {
                process.cwd()
            } catch (e) {
            }
            if (typeof process.chdir === "function") {
                var r = process.chdir;
                process.chdir = function (e) {
                    o = null;
                    r.call(process, e)
                };
                if (Object.setPrototypeOf) Object.setPrototypeOf(process.chdir, r)
            }
            e.exports = patch;

            function patch(e) {
                if (i.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)) {
                    patchLchmod(e)
                }
                if (!e.lutimes) {
                    patchLutimes(e)
                }
                e.chown = chownFix(e.chown);
                e.fchown = chownFix(e.fchown);
                e.lchown = chownFix(e.lchown);
                e.chmod = chmodFix(e.chmod);
                e.fchmod = chmodFix(e.fchmod);
                e.lchmod = chmodFix(e.lchmod);
                e.chownSync = chownFixSync(e.chownSync);
                e.fchownSync = chownFixSync(e.fchownSync);
                e.lchownSync = chownFixSync(e.lchownSync);
                e.chmodSync = chmodFixSync(e.chmodSync);
                e.fchmodSync = chmodFixSync(e.fchmodSync);
                e.lchmodSync = chmodFixSync(e.lchmodSync);
                e.stat = statFix(e.stat);
                e.fstat = statFix(e.fstat);
                e.lstat = statFix(e.lstat);
                e.statSync = statFixSync(e.statSync);
                e.fstatSync = statFixSync(e.fstatSync);
                e.lstatSync = statFixSync(e.lstatSync);
                if (e.chmod && !e.lchmod) {
                    e.lchmod = function (e, t, n) {
                        if (n) process.nextTick(n)
                    };
                    e.lchmodSync = function () {
                    }
                }
                if (e.chown && !e.lchown) {
                    e.lchown = function (e, t, n, i) {
                        if (i) process.nextTick(i)
                    };
                    e.lchownSync = function () {
                    }
                }
                if (a === "win32") {
                    e.rename = typeof e.rename !== "function" ? e.rename : function (t) {
                        function rename(n, i, s) {
                            var o = Date.now();
                            var a = 0;
                            t(n, i, (function CB(r) {
                                if (r && (r.code === "EACCES" || r.code === "EPERM" || r.code === "EBUSY") && Date.now() - o < 6e4) {
                                    setTimeout((function () {
                                        e.stat(i, (function (e, o) {
                                            if (e && e.code === "ENOENT") t(n, i, CB); else s(r)
                                        }))
                                    }), a);
                                    if (a < 100) a += 10;
                                    return
                                }
                                if (s) s(r)
                            }))
                        }

                        if (Object.setPrototypeOf) Object.setPrototypeOf(rename, t);
                        return rename
                    }(e.rename)
                }
                e.read = typeof e.read !== "function" ? e.read : function (t) {
                    function read(n, i, s, o, a, r) {
                        var c;
                        if (r && typeof r === "function") {
                            var l = 0;
                            c = function (p, u, d) {
                                if (p && p.code === "EAGAIN" && l < 10) {
                                    l++;
                                    return t.call(e, n, i, s, o, a, c)
                                }
                                r.apply(this, arguments)
                            }
                        }
                        return t.call(e, n, i, s, o, a, c)
                    }

                    if (Object.setPrototypeOf) Object.setPrototypeOf(read, t);
                    return read
                }(e.read);
                e.readSync = typeof e.readSync !== "function" ? e.readSync : function (t) {
                    return function (n, i, s, o, a) {
                        var r = 0;
                        while (true) {
                            try {
                                return t.call(e, n, i, s, o, a)
                            } catch (e) {
                                if (e.code === "EAGAIN" && r < 10) {
                                    r++;
                                    continue
                                }
                                throw e
                            }
                        }
                    }
                }(e.readSync);

                function patchLchmod(e) {
                    e.lchmod = function (t, n, s) {
                        e.open(t, i.O_WRONLY | i.O_SYMLINK, n, (function (t, i) {
                            if (t) {
                                if (s) s(t);
                                return
                            }
                            e.fchmod(i, n, (function (t) {
                                e.close(i, (function (e) {
                                    if (s) s(t || e)
                                }))
                            }))
                        }))
                    };
                    e.lchmodSync = function (t, n) {
                        var s = e.openSync(t, i.O_WRONLY | i.O_SYMLINK, n);
                        var o = true;
                        var a;
                        try {
                            a = e.fchmodSync(s, n);
                            o = false
                        } finally {
                            if (o) {
                                try {
                                    e.closeSync(s)
                                } catch (e) {
                                }
                            } else {
                                e.closeSync(s)
                            }
                        }
                        return a
                    }
                }

                function patchLutimes(e) {
                    if (i.hasOwnProperty("O_SYMLINK") && e.futimes) {
                        e.lutimes = function (t, n, s, o) {
                            e.open(t, i.O_SYMLINK, (function (t, i) {
                                if (t) {
                                    if (o) o(t);
                                    return
                                }
                                e.futimes(i, n, s, (function (t) {
                                    e.close(i, (function (e) {
                                        if (o) o(t || e)
                                    }))
                                }))
                            }))
                        };
                        e.lutimesSync = function (t, n, s) {
                            var o = e.openSync(t, i.O_SYMLINK);
                            var a;
                            var r = true;
                            try {
                                a = e.futimesSync(o, n, s);
                                r = false
                            } finally {
                                if (r) {
                                    try {
                                        e.closeSync(o)
                                    } catch (e) {
                                    }
                                } else {
                                    e.closeSync(o)
                                }
                            }
                            return a
                        }
                    } else if (e.futimes) {
                        e.lutimes = function (e, t, n, i) {
                            if (i) process.nextTick(i)
                        };
                        e.lutimesSync = function () {
                        }
                    }
                }

                function chmodFix(t) {
                    if (!t) return t;
                    return function (n, i, s) {
                        return t.call(e, n, i, (function (e) {
                            if (chownErOk(e)) e = null;
                            if (s) s.apply(this, arguments)
                        }))
                    }
                }

                function chmodFixSync(t) {
                    if (!t) return t;
                    return function (n, i) {
                        try {
                            return t.call(e, n, i)
                        } catch (e) {
                            if (!chownErOk(e)) throw e
                        }
                    }
                }

                function chownFix(t) {
                    if (!t) return t;
                    return function (n, i, s, o) {
                        return t.call(e, n, i, s, (function (e) {
                            if (chownErOk(e)) e = null;
                            if (o) o.apply(this, arguments)
                        }))
                    }
                }

                function chownFixSync(t) {
                    if (!t) return t;
                    return function (n, i, s) {
                        try {
                            return t.call(e, n, i, s)
                        } catch (e) {
                            if (!chownErOk(e)) throw e
                        }
                    }
                }

                function statFix(t) {
                    if (!t) return t;
                    return function (n, i, s) {
                        if (typeof i === "function") {
                            s = i;
                            i = null
                        }

                        function callback(e, t) {
                            if (t) {
                                if (t.uid < 0) t.uid += 4294967296;
                                if (t.gid < 0) t.gid += 4294967296
                            }
                            if (s) s.apply(this, arguments)
                        }

                        return i ? t.call(e, n, i, callback) : t.call(e, n, callback)
                    }
                }

                function statFixSync(t) {
                    if (!t) return t;
                    return function (n, i) {
                        var s = i ? t.call(e, n, i) : t.call(e, n);
                        if (s) {
                            if (s.uid < 0) s.uid += 4294967296;
                            if (s.gid < 0) s.gid += 4294967296
                        }
                        return s
                    }
                }

                function chownErOk(e) {
                    if (!e) return true;
                    if (e.code === "ENOSYS") return true;
                    var t = !process.getuid || process.getuid() !== 0;
                    if (t) {
                        if (e.code === "EINVAL" || e.code === "EPERM") return true
                    }
                    return false
                }
            }
        }, 1512: (e, t, n) => {
            "use strict";
            var i = typeof Symbol !== "undefined" && Symbol;
            var s = n(8074);
            e.exports = function hasNativeSymbols() {
                if (typeof i !== "function") {
                    return false
                }
                if (typeof Symbol !== "function") {
                    return false
                }
                if (typeof i("foo") !== "symbol") {
                    return false
                }
                if (typeof Symbol("bar") !== "symbol") {
                    return false
                }
                return s()
            }
        }, 8074: e => {
            "use strict";
            e.exports = function hasSymbols() {
                if (typeof Symbol !== "function" || typeof Object.getOwnPropertySymbols !== "function") {
                    return false
                }
                if (typeof Symbol.iterator === "symbol") {
                    return true
                }
                var e = {};
                var t = Symbol("test");
                var n = Object(t);
                if (typeof t === "string") {
                    return false
                }
                if (Object.prototype.toString.call(t) !== "[object Symbol]") {
                    return false
                }
                if (Object.prototype.toString.call(n) !== "[object Symbol]") {
                    return false
                }
                var i = 42;
                e[t] = i;
                for (var s in e) {
                    return false
                }
                if (typeof Object.keys === "function" && Object.keys(e).length !== 0) {
                    return false
                }
                if (typeof Object.getOwnPropertyNames === "function" && Object.getOwnPropertyNames(e).length !== 0) {
                    return false
                }
                var o = Object.getOwnPropertySymbols(e);
                if (o.length !== 1 || o[0] !== t) {
                    return false
                }
                if (!Object.prototype.propertyIsEnumerable.call(e, t)) {
                    return false
                }
                if (typeof Object.getOwnPropertyDescriptor === "function") {
                    var a = Object.getOwnPropertyDescriptor(e, t);
                    if (a.value !== i || a.enumerable !== true) {
                        return false
                    }
                }
                return true
            }
        }, 9431: (e, t, n) => {
            "use strict";
            var i = n(8074);
            e.exports = function hasToStringTagShams() {
                return i() && !!Symbol.toStringTag
            }
        }, 8508: (e, t, n) => {
            "use strict";
            var i = Function.prototype.call;
            var s = Object.prototype.hasOwnProperty;
            var o = n(7756);
            e.exports = o.call(i, s)
        }, 1718: (e, t, n) => {
            const i = n(638);
            const s = n(7854);

            class SerDe {
                constructor() {
                    const e = {
                        __LOG4JS_undefined__: undefined,
                        __LOG4JS_NaN__: Number("abc"),
                        __LOG4JS_Infinity__: 1 / 0,
                        "__LOG4JS_-Infinity__": -1 / 0
                    };
                    this.deMap = e;
                    this.serMap = {};
                    Object.keys(this.deMap).forEach((e => {
                        const t = this.deMap[e];
                        this.serMap[t] = e
                    }))
                }

                canSerialise(e) {
                    if (typeof e === "string") return false;
                    return e in this.serMap
                }

                serialise(e) {
                    if (this.canSerialise(e)) return this.serMap[e];
                    return e
                }

                canDeserialise(e) {
                    return e in this.deMap
                }

                deserialise(e) {
                    if (this.canDeserialise(e)) return this.deMap[e];
                    return e
                }
            }

            const o = new SerDe;

            class LoggingEvent {
                constructor(e, t, n, i, s, o) {
                    this.startTime = new Date;
                    this.categoryName = e;
                    this.data = n;
                    this.level = t;
                    this.context = Object.assign({}, i);
                    this.pid = process.pid;
                    this.error = o;
                    if (typeof s !== "undefined") {
                        if (!s || typeof s !== "object" || Array.isArray(s)) throw new TypeError("Invalid location type passed to LoggingEvent constructor");
                        this.constructor._getLocationKeys().forEach((e => {
                            if (typeof s[e] !== "undefined") this[e] = s[e]
                        }))
                    }
                }

                static _getLocationKeys() {
                    return ["fileName", "lineNumber", "columnNumber", "callStack", "className", "functionName", "functionAlias", "callerName"]
                }

                serialise() {
                    return i.stringify(this, ((e, t) => {
                        if (t instanceof Error) {
                            t = Object.assign({message: t.message, stack: t.stack}, t)
                        }
                        return o.serialise(t)
                    }))
                }

                static deserialise(e) {
                    let t;
                    try {
                        const n = i.parse(e, ((e, t) => {
                            if (t && t.message && t.stack) {
                                const e = new Error(t);
                                Object.keys(t).forEach((n => {
                                    e[n] = t[n]
                                }));
                                t = e
                            }
                            return o.deserialise(t)
                        }));
                        this._getLocationKeys().forEach((e => {
                            if (typeof n[e] !== "undefined") {
                                if (!n.location) n.location = {};
                                n.location[e] = n[e]
                            }
                        }));
                        t = new LoggingEvent(n.categoryName, s.getLevel(n.level.levelStr), n.data, n.context, n.location, n.error);
                        t.startTime = new Date(n.startTime);
                        t.pid = n.pid;
                        if (n.cluster) {
                            t.cluster = n.cluster
                        }
                    } catch (n) {
                        t = new LoggingEvent("log4js", s.ERROR, ["Unable to parse log:", e, "because: ", n])
                    }
                    return t
                }
            }

            e.exports = LoggingEvent
        }, 9396: e => {
            function maxFileSizeUnitTransform(e) {
                if (typeof e === "number" && Number.isInteger(e)) {
                    return e
                }
                const t = {K: 1024, M: 1024 * 1024, G: 1024 * 1024 * 1024};
                const n = Object.keys(t);
                const i = e.slice(-1).toLocaleUpperCase();
                const s = e.slice(0, -1).trim();
                if (n.indexOf(i) < 0 || !Number.isInteger(Number(s))) {
                    throw Error(`maxLogSize: "${e}" is invalid`)
                } else {
                    return s * t[i]
                }
            }

            function adapter(e, t) {
                const n = Object.assign({}, t);
                Object.keys(e).forEach((i => {
                    if (n[i]) {
                        n[i] = e[i](t[i])
                    }
                }));
                return n
            }

            function fileAppenderAdapter(e) {
                const t = {maxLogSize: maxFileSizeUnitTransform};
                return adapter(t, e)
            }

            const t = {dateFile: fileAppenderAdapter, file: fileAppenderAdapter, fileSync: fileAppenderAdapter};
            e.exports.modifyConfig = e => t[e.type] ? t[e.type](e) : e
        }, 7758: (e, t, n) => {
            const i = n(4078)("log4js:categoryFilter");

            function categoryFilter(e, t) {
                if (typeof e === "string") e = [e];
                return n => {
                    i(`Checking ${n.categoryName} against ${e}`);
                    if (e.indexOf(n.categoryName) === -1) {
                        i("Not excluded, sending to appender");
                        t(n)
                    }
                }
            }

            function configure(e, t, n) {
                const i = n(e.appender);
                return categoryFilter(e.exclude, i)
            }

            e.exports.configure = configure
        }, 4827: e => {
            const t = console.log.bind(console);

            function consoleAppender(e, n) {
                return i => {
                    t(e(i, n))
                }
            }

            function configure(e, t) {
                let n = t.colouredLayout;
                if (e.layout) {
                    n = t.layout(e.layout.type, e.layout)
                }
                return consoleAppender(n, e.timezoneOffset)
            }

            e.exports.configure = configure
        }, 8742: (e, t, n) => {
            const i = n(5464);
            const s = n(857);
            const o = s.EOL;

            function openTheStream(e, t, n) {
                const s = new i.DateRollingFileStream(e, t, n);
                s.on("error", (t => {
                    console.error("log4js.dateFileAppender - Writing to file %s, error happened ", e, t)
                }));
                s.on("drain", (() => {
                    process.emit("log4js:pause", false)
                }));
                return s
            }

            function appender(e, t, n, i, s) {
                i.maxSize = i.maxLogSize;
                const a = openTheStream(e, t, i);
                const app = function (e) {
                    if (!a.writable) {
                        return
                    }
                    if (!a.write(n(e, s) + o, "utf8")) {
                        process.emit("log4js:pause", true)
                    }
                };
                app.shutdown = function (e) {
                    a.end("", "utf-8", e)
                };
                return app
            }

            function configure(e, t) {
                let n = t.basicLayout;
                if (e.layout) {
                    n = t.layout(e.layout.type, e.layout)
                }
                if (!e.alwaysIncludePattern) {
                    e.alwaysIncludePattern = false
                }
                e.mode = e.mode || 384;
                return appender(e.filename, e.pattern, n, e, e.timezoneOffset)
            }

            e.exports.configure = configure
        }, 8466: (e, t, n) => {
            const i = n(4078)("log4js:file");
            const s = n(6928);
            const o = n(5464);
            const a = n(857);
            const r = a.EOL;
            let c = false;
            const l = new Set;

            function mainSighupHandler() {
                l.forEach((e => {
                    e.sighupHandler()
                }))
            }

            function fileAppender(e, t, n, p, u, d) {
                if (typeof e !== "string" || e.length === 0) {
                    throw new Error(`Invalid filename: ${e}`)
                } else if (e.endsWith(s.sep)) {
                    throw new Error(`Filename is a directory: ${e}`)
                } else if (e.indexOf(`~${s.sep}`) === 0) {
                    e = e.replace("~", a.homedir())
                }
                e = s.normalize(e);
                p = !p && p !== 0 ? 5 : p;
                i("Creating file appender (", e, ", ", n, ", ", p, ", ", u, ", ", d, ")");

                function openTheStream(e, t, n, i) {
                    const s = new o.RollingFileStream(e, t, n, i);
                    s.on("error", (t => {
                        console.error("log4js.fileAppender - Writing to file %s, error happened ", e, t)
                    }));
                    s.on("drain", (() => {
                        process.emit("log4js:pause", false)
                    }));
                    return s
                }

                let f = openTheStream(e, n, p, u);
                const app = function (e) {
                    if (!f.writable) {
                        return
                    }
                    if (u.removeColor === true) {
                        const t = /\x1b[[0-9;]*m/g;
                        e.data = e.data.map((e => {
                            if (typeof e === "string") return e.replace(t, "");
                            return e
                        }))
                    }
                    if (!f.write(t(e, d) + r, "utf8")) {
                        process.emit("log4js:pause", true)
                    }
                };
                app.reopen = function () {
                    f.end((() => {
                        f = openTheStream(e, n, p, u)
                    }))
                };
                app.sighupHandler = function () {
                    i("SIGHUP handler called.");
                    app.reopen()
                };
                app.shutdown = function (e) {
                    l.delete(app);
                    if (l.size === 0 && c) {
                        process.removeListener("SIGHUP", mainSighupHandler);
                        c = false
                    }
                    f.end("", "utf-8", e)
                };
                l.add(app);
                if (!c) {
                    process.on("SIGHUP", mainSighupHandler);
                    c = true
                }
                return app
            }

            function configure(e, t) {
                let n = t.basicLayout;
                if (e.layout) {
                    n = t.layout(e.layout.type, e.layout)
                }
                e.mode = e.mode || 384;
                return fileAppender(e.filename, n, e.maxLogSize, e.backups, e, e.timezoneOffset)
            }

            e.exports.configure = configure
        }, 9705: (e, t, n) => {
            const i = n(4078)("log4js:fileSync");
            const s = n(6928);
            const o = n(9896);
            const a = n(857);
            const r = a.EOL;

            function touchFile(e, t) {
                const mkdir = e => {
                    try {
                        return o.mkdirSync(e, {recursive: true})
                    } catch (t) {
                        if (t.code === "ENOENT") {
                            mkdir(s.dirname(e));
                            return mkdir(e)
                        }
                        if (t.code !== "EEXIST" && t.code !== "EROFS") {
                            throw t
                        } else {
                            try {
                                if (o.statSync(e).isDirectory()) {
                                    return e
                                }
                                throw t
                            } catch (e) {
                                throw t
                            }
                        }
                    }
                };
                mkdir(s.dirname(e));
                o.appendFileSync(e, "", {mode: t.mode, flag: t.flags})
            }

            class RollingFileSync {
                constructor(e, t, n, s) {
                    i("In RollingFileStream");
                    if (t < 0) {
                        throw new Error(`maxLogSize (${t}) should be > 0`)
                    }
                    this.filename = e;
                    this.size = t;
                    this.backups = n;
                    this.options = s;
                    this.currentSize = 0;

                    function currentFileSize(e) {
                        let t = 0;
                        try {
                            t = o.statSync(e).size
                        } catch (t) {
                            touchFile(e, s)
                        }
                        return t
                    }

                    this.currentSize = currentFileSize(this.filename)
                }

                shouldRoll() {
                    i("should roll with current size %d, and max size %d", this.currentSize, this.size);
                    return this.currentSize >= this.size
                }

                roll(e) {
                    const t = this;
                    const n = new RegExp(`^${s.basename(e)}`);

                    function justTheseFiles(e) {
                        return n.test(e)
                    }

                    function index(t) {
                        return parseInt(t.slice(`${s.basename(e)}.`.length), 10) || 0
                    }

                    function byIndex(e, t) {
                        return index(e) - index(t)
                    }

                    function increaseFileIndex(n) {
                        const a = index(n);
                        i(`Index of ${n} is ${a}`);
                        if (t.backups === 0) {
                            o.truncateSync(e, 0)
                        } else if (a < t.backups) {
                            try {
                                o.unlinkSync(`${e}.${a + 1}`)
                            } catch (e) {
                            }
                            i(`Renaming ${n} -> ${e}.${a + 1}`);
                            o.renameSync(s.join(s.dirname(e), n), `${e}.${a + 1}`)
                        }
                    }

                    function renameTheFiles() {
                        i("Renaming the old files");
                        const t = o.readdirSync(s.dirname(e));
                        t.filter(justTheseFiles).sort(byIndex).reverse().forEach(increaseFileIndex)
                    }

                    i("Rolling, rolling, rolling");
                    renameTheFiles()
                }

                write(e, t) {
                    const n = this;

                    function writeTheChunk() {
                        i("writing the chunk to the file");
                        n.currentSize += e.length;
                        o.appendFileSync(n.filename, e)
                    }

                    i("in write");
                    if (this.shouldRoll()) {
                        this.currentSize = 0;
                        this.roll(this.filename)
                    }
                    writeTheChunk()
                }
            }

            function fileAppender(e, t, n, c, l, p) {
                if (typeof e !== "string" || e.length === 0) {
                    throw new Error(`Invalid filename: ${e}`)
                } else if (e.endsWith(s.sep)) {
                    throw new Error(`Filename is a directory: ${e}`)
                } else if (e.indexOf(`~${s.sep}`) === 0) {
                    e = e.replace("~", a.homedir())
                }
                e = s.normalize(e);
                c = !c && c !== 0 ? 5 : c;
                i("Creating fileSync appender (", e, ", ", n, ", ", c, ", ", l, ", ", p, ")");

                function openTheStream(e, t, n) {
                    let i;
                    if (t) {
                        i = new RollingFileSync(e, t, n, l)
                    } else {
                        i = (e => {
                            touchFile(e, l);
                            return {
                                write(t) {
                                    o.appendFileSync(e, t)
                                }
                            }
                        })(e)
                    }
                    return i
                }

                const u = openTheStream(e, n, c);
                return e => {
                    u.write(t(e, p) + r)
                }
            }

            function configure(e, t) {
                let n = t.basicLayout;
                if (e.layout) {
                    n = t.layout(e.layout.type, e.layout)
                }
                const i = {flags: e.flags || "a", encoding: e.encoding || "utf8", mode: e.mode || 384};
                return fileAppender(e.filename, n, e.maxLogSize, e.backups, i, e.timezoneOffset)
            }

            e.exports.configure = configure
        }, 2534: (e, t, n) => {
            const i = n(6928);
            const s = n(4078)("log4js:appenders");
            const o = n(9131);
            const a = n(5703);
            const r = n(7854);
            const c = n(9370);
            const l = n(9396);
            const p = new Map;
            p.set("console", n(4827));
            p.set("stdout", n(6007));
            p.set("stderr", n(3336));
            p.set("logLevelFilter", n(9586));
            p.set("categoryFilter", n(7758));
            p.set("noLogFilter", n(8207));
            p.set("file", n(8466));
            p.set("dateFile", n(8742));
            p.set("fileSync", n(9705));
            p.set("tcp", n(8405));
            const u = new Map;
            const tryLoading = (e, t) => {
                let n;
                try {
                    const t = `${e}.cjs`;
                    n = require.resolve(t);
                    s("Loading module from ", t)
                } catch (t) {
                    n = e;
                    s("Loading module from ", e)
                }
                try {
                    return require(n)
                } catch (n) {
                    o.throwExceptionIf(t, n.code !== "MODULE_NOT_FOUND", `appender "${e}" could not be loaded (error was: ${n})`);
                    return undefined
                }
            };
            const loadAppenderModule = (e, t) => p.get(e) || tryLoading(`./${e}`, t) || tryLoading(e, t) || require.main && require.main.filename && tryLoading(i.join(i.dirname(require.main.filename), e), t) || tryLoading(i.join(process.cwd(), e), t);
            const d = new Set;
            const getAppender = (e, t) => {
                if (u.has(e)) return u.get(e);
                if (!t.appenders[e]) return false;
                if (d.has(e)) throw new Error(`Dependency loop detected for appender ${e}.`);
                d.add(e);
                s(`Creating appender ${e}`);
                const n = createAppender(e, t);
                d.delete(e);
                u.set(e, n);
                return n
            };
            const createAppender = (e, t) => {
                const i = t.appenders[e];
                const p = i.type.configure ? i.type : loadAppenderModule(i.type, t);
                o.throwExceptionIf(t, o.not(p), `appender "${e}" is not valid (type "${i.type}" could not be found)`);
                if (p.appender) {
                    process.emitWarning(`Appender ${i.type} exports an appender function.`, "DeprecationWarning", "log4js-node-DEP0001");
                    s("[log4js-node-DEP0001]", `DEPRECATION: Appender ${i.type} exports an appender function.`)
                }
                if (p.shutdown) {
                    process.emitWarning(`Appender ${i.type} exports a shutdown function.`, "DeprecationWarning", "log4js-node-DEP0002");
                    s("[log4js-node-DEP0002]", `DEPRECATION: Appender ${i.type} exports a shutdown function.`)
                }
                s(`${e}: clustering.isMaster ? ${a.isMaster()}`);
                s(`${e}: appenderModule is ${n(9023).inspect(p)}`);
                return a.onlyOnMaster((() => {
                    s(`calling appenderModule.configure for ${e} / ${i.type}`);
                    return p.configure(l.modifyConfig(i), c, (e => getAppender(e, t)), r)
                }), (() => {
                }))
            };
            const setup = e => {
                u.clear();
                d.clear();
                if (!e) {
                    return
                }
                const t = [];
                Object.values(e.categories).forEach((e => {
                    t.push(...e.appenders)
                }));
                Object.keys(e.appenders).forEach((n => {
                    if (t.includes(n) || e.appenders[n].type === "tcp-server" || e.appenders[n].type === "multiprocess") {
                        getAppender(n, e)
                    }
                }))
            };
            const init = () => {
                setup()
            };
            init();
            o.addListener((e => {
                o.throwExceptionIf(e, o.not(o.anObject(e.appenders)), 'must have a property "appenders" of type object.');
                const t = Object.keys(e.appenders);
                o.throwExceptionIf(e, o.not(t.length), "must define at least one appender.");
                t.forEach((t => {
                    o.throwExceptionIf(e, o.not(e.appenders[t].type), `appender "${t}" is not valid (must be an object with property "type")`)
                }))
            }));
            o.addListener(setup);
            e.exports = u;
            e.exports.init = init
        }, 9586: e => {
            function logLevelFilter(e, t, n, i) {
                const s = i.getLevel(e);
                const o = i.getLevel(t, i.FATAL);
                return e => {
                    const t = e.level;
                    if (s.isLessThanOrEqualTo(t) && o.isGreaterThanOrEqualTo(t)) {
                        n(e)
                    }
                }
            }

            function configure(e, t, n, i) {
                const s = n(e.appender);
                return logLevelFilter(e.level, e.maxLevel, s, i)
            }

            e.exports.configure = configure
        }, 8207: (e, t, n) => {
            const i = n(4078)("log4js:noLogFilter");

            function removeNullOrEmptyRegexp(e) {
                const t = e.filter((e => e != null && e !== ""));
                return t
            }

            function noLogFilter(e, t) {
                return n => {
                    i(`Checking data: ${n.data} against filters: ${e}`);
                    if (typeof e === "string") {
                        e = [e]
                    }
                    e = removeNullOrEmptyRegexp(e);
                    const s = new RegExp(e.join("|"), "i");
                    if (e.length === 0 || n.data.findIndex((e => s.test(e))) < 0) {
                        i("Not excluded, sending to appender");
                        t(n)
                    }
                }
            }

            function configure(e, t, n) {
                const i = n(e.appender);
                return noLogFilter(e.exclude, i)
            }

            e.exports.configure = configure
        }, 2029: (e, t, n) => {
            const i = n(4078)("log4js:recording");
            const s = [];

            function configure() {
                return function (e) {
                    i(`received logEvent, number of events now ${s.length + 1}`);
                    i("log event was ", e);
                    s.push(e)
                }
            }

            function replay() {
                return s.slice()
            }

            function reset() {
                s.length = 0
            }

            e.exports = {configure: configure, replay: replay, playback: replay, reset: reset, erase: reset}
        }, 3336: e => {
            function stderrAppender(e, t) {
                return n => {
                    process.stderr.write(`${e(n, t)}\n`)
                }
            }

            function configure(e, t) {
                let n = t.colouredLayout;
                if (e.layout) {
                    n = t.layout(e.layout.type, e.layout)
                }
                return stderrAppender(n, e.timezoneOffset)
            }

            e.exports.configure = configure
        }, 6007: (e, t) => {
            function stdoutAppender(e, t) {
                return n => {
                    process.stdout.write(`${e(n, t)}\n`)
                }
            }

            function configure(e, t) {
                let n = t.colouredLayout;
                if (e.layout) {
                    n = t.layout(e.layout.type, e.layout)
                }
                return stdoutAppender(n, e.timezoneOffset)
            }

            t.configure = configure
        }, 8405: (e, t, n) => {
            const i = n(4078)("log4js:tcp");
            const s = n(9278);

            function appender(e, t) {
                let n = false;
                const o = [];
                let a;
                let r = 3;
                let c = "__LOG4JS__";

                function write(e) {
                    i("Writing log event to socket");
                    n = a.write(`${t(e)}${c}`, "utf8")
                }

                function emptyBuffer() {
                    let e;
                    i("emptying buffer");
                    while (e = o.shift()) {
                        write(e)
                    }
                }

                function createSocket() {
                    i(`appender creating socket to ${e.host || "localhost"}:${e.port || 5e3}`);
                    c = `${e.endMsg || "__LOG4JS__"}`;
                    a = s.createConnection(e.port || 5e3, e.host || "localhost");
                    a.on("connect", (() => {
                        i("socket connected");
                        emptyBuffer();
                        n = true
                    }));
                    a.on("drain", (() => {
                        i("drain event received, emptying buffer");
                        n = true;
                        emptyBuffer()
                    }));
                    a.on("timeout", a.end.bind(a));
                    a.on("error", (e => {
                        i("connection error", e);
                        n = false;
                        emptyBuffer()
                    }));
                    a.on("close", createSocket)
                }

                createSocket();

                function log(e) {
                    if (n) {
                        write(e)
                    } else {
                        i("buffering log event because it cannot write at the moment");
                        o.push(e)
                    }
                }

                log.shutdown = function (e) {
                    i("shutdown called");
                    if (o.length && r) {
                        i("buffer has items, waiting 100ms to empty");
                        r -= 1;
                        setTimeout((() => {
                            log.shutdown(e)
                        }), 100)
                    } else {
                        a.removeAllListeners("close");
                        a.end(e)
                    }
                };
                return log
            }

            function configure(e, t) {
                i(`configure with config = ${e}`);
                let layout = function (e) {
                    return e.serialise()
                };
                if (e.layout) {
                    layout = t.layout(e.layout.type, e.layout)
                }
                return appender(e, layout)
            }

            e.exports.configure = configure
        }, 3609: (e, t, n) => {
            const i = n(4078)("log4js:categories");
            const s = n(9131);
            const o = n(7854);
            const a = n(2534);
            const r = new Map;

            function inheritFromParent(e, t, n) {
                if (t.inherit === false) return;
                const i = n.lastIndexOf(".");
                if (i < 0) return;
                const s = n.slice(0, i);
                let o = e.categories[s];
                if (!o) {
                    o = {inherit: true, appenders: []}
                }
                inheritFromParent(e, o, s);
                if (!e.categories[s] && o.appenders && o.appenders.length && o.level) {
                    e.categories[s] = o
                }
                t.appenders = t.appenders || [];
                t.level = t.level || o.level;
                o.appenders.forEach((e => {
                    if (!t.appenders.includes(e)) {
                        t.appenders.push(e)
                    }
                }));
                t.parent = o
            }

            function addCategoryInheritance(e) {
                if (!e.categories) return;
                const t = Object.keys(e.categories);
                t.forEach((t => {
                    const n = e.categories[t];
                    inheritFromParent(e, n, t)
                }))
            }

            s.addPreProcessingListener((e => addCategoryInheritance(e)));
            s.addListener((e => {
                s.throwExceptionIf(e, s.not(s.anObject(e.categories)), 'must have a property "categories" of type object.');
                const t = Object.keys(e.categories);
                s.throwExceptionIf(e, s.not(t.length), "must define at least one category.");
                t.forEach((t => {
                    const n = e.categories[t];
                    s.throwExceptionIf(e, [s.not(n.appenders), s.not(n.level)], `category "${t}" is not valid (must be an object with properties "appenders" and "level")`);
                    s.throwExceptionIf(e, s.not(Array.isArray(n.appenders)), `category "${t}" is not valid (appenders must be an array of appender names)`);
                    s.throwExceptionIf(e, s.not(n.appenders.length), `category "${t}" is not valid (appenders must contain at least one appender name)`);
                    if (Object.prototype.hasOwnProperty.call(n, "enableCallStack")) {
                        s.throwExceptionIf(e, typeof n.enableCallStack !== "boolean", `category "${t}" is not valid (enableCallStack must be boolean type)`)
                    }
                    n.appenders.forEach((n => {
                        s.throwExceptionIf(e, s.not(a.get(n)), `category "${t}" is not valid (appender "${n}" is not defined)`)
                    }));
                    s.throwExceptionIf(e, s.not(o.getLevel(n.level)), `category "${t}" is not valid (level "${n.level}" not recognised;` + ` valid levels are ${o.levels.join(", ")})`)
                }));
                s.throwExceptionIf(e, s.not(e.categories.default), 'must define a "default" category.')
            }));
            const setup = e => {
                r.clear();
                if (!e) {
                    return
                }
                const t = Object.keys(e.categories);
                t.forEach((t => {
                    const n = e.categories[t];
                    const s = [];
                    n.appenders.forEach((e => {
                        s.push(a.get(e));
                        i(`Creating category ${t}`);
                        r.set(t, {
                            appenders: s,
                            level: o.getLevel(n.level),
                            enableCallStack: n.enableCallStack || false
                        })
                    }))
                }))
            };
            const init = () => {
                setup()
            };
            init();
            s.addListener(setup);
            const configForCategory = e => {
                i(`configForCategory: searching for config for ${e}`);
                if (r.has(e)) {
                    i(`configForCategory: ${e} exists in config, returning it`);
                    return r.get(e)
                }
                let t;
                if (e.indexOf(".") > 0) {
                    i(`configForCategory: ${e} has hierarchy, cloning from parents`);
                    t = {...configForCategory(e.slice(0, e.lastIndexOf(".")))}
                } else {
                    if (!r.has("default")) {
                        setup({categories: {default: {appenders: ["out"], level: "OFF"}}})
                    }
                    i("configForCategory: cloning default category");
                    t = {...r.get("default")}
                }
                r.set(e, t);
                return t
            };
            const appendersForCategory = e => configForCategory(e).appenders;
            const getLevelForCategory = e => configForCategory(e).level;
            const setLevelForCategory = (e, t) => {
                configForCategory(e).level = t
            };
            const getEnableCallStackForCategory = e => configForCategory(e).enableCallStack === true;
            const setEnableCallStackForCategory = (e, t) => {
                configForCategory(e).enableCallStack = t
            };
            e.exports = r;
            e.exports = Object.assign(e.exports, {
                appendersForCategory: appendersForCategory,
                getLevelForCategory: getLevelForCategory,
                setLevelForCategory: setLevelForCategory,
                getEnableCallStackForCategory: getEnableCallStackForCategory,
                setEnableCallStackForCategory: setEnableCallStackForCategory,
                init: init
            })
        }, 5703: (e, t, n) => {
            const i = n(4078)("log4js:clustering");
            const s = n(1718);
            const o = n(9131);
            let a = false;
            let r = null;
            try {
                r = n(9907)
            } catch (e) {
                i("cluster module not present");
                a = true
            }
            const c = [];
            let l = false;
            let p = "NODE_APP_INSTANCE";
            const isPM2Master = () => l && process.env[p] === "0";
            const isMaster = () => a || r && r.isMaster || isPM2Master();
            const sendToListeners = e => {
                c.forEach((t => t(e)))
            };
            const receiver = (e, t) => {
                i("cluster message received from worker ", e, ": ", t);
                if (e.topic && e.data) {
                    t = e;
                    e = undefined
                }
                if (t && t.topic && t.topic === "log4js:message") {
                    i("received message: ", t.data);
                    const e = s.deserialise(t.data);
                    sendToListeners(e)
                }
            };
            if (!a) {
                o.addListener((e => {
                    c.length = 0;
                    ({pm2: l, disableClustering: a, pm2InstanceVar: p = "NODE_APP_INSTANCE"} = e);
                    i(`clustering disabled ? ${a}`);
                    i(`cluster.isMaster ? ${r && r.isMaster}`);
                    i(`pm2 enabled ? ${l}`);
                    i(`pm2InstanceVar = ${p}`);
                    i(`process.env[${p}] = ${process.env[p]}`);
                    if (l) {
                        process.removeListener("message", receiver)
                    }
                    if (r && r.removeListener) {
                        r.removeListener("message", receiver)
                    }
                    if (a || e.disableClustering) {
                        i("Not listening for cluster messages, because clustering disabled.")
                    } else if (isPM2Master()) {
                        i("listening for PM2 broadcast messages");
                        process.on("message", receiver)
                    } else if (r && r.isMaster) {
                        i("listening for cluster messages");
                        r.on("message", receiver)
                    } else {
                        i("not listening for messages, because we are not a master process")
                    }
                }))
            }
            e.exports = {
                onlyOnMaster: (e, t) => isMaster() ? e() : t, isMaster: isMaster, send: e => {
                    if (isMaster()) {
                        sendToListeners(e)
                    } else {
                        if (!l) {
                            e.cluster = {workerId: r.worker.id, worker: process.pid}
                        }
                        process.send({topic: "log4js:message", data: e.serialise()})
                    }
                }, onMessage: e => {
                    c.push(e)
                }
            }
        }, 9131: (e, t, n) => {
            const i = n(9023);
            const s = n(4078)("log4js:configuration");
            const o = [];
            const a = [];
            const not = e => !e;
            const anObject = e => e && typeof e === "object" && !Array.isArray(e);
            const validIdentifier = e => /^[A-Za-z][A-Za-z0-9_]*$/g.test(e);
            const anInteger = e => e && typeof e === "number" && Number.isInteger(e);
            const addListener = e => {
                a.push(e);
                s(`Added listener, now ${a.length} listeners`)
            };
            const addPreProcessingListener = e => {
                o.push(e);
                s(`Added pre-processing listener, now ${o.length} listeners`)
            };
            const throwExceptionIf = (e, t, n) => {
                const s = Array.isArray(t) ? t : [t];
                s.forEach((t => {
                    if (t) {
                        throw new Error(`Problem with log4js configuration: (${i.inspect(e, {depth: 5})}) - ${n}`)
                    }
                }))
            };
            const configure = e => {
                s("New configuration to be validated: ", e);
                throwExceptionIf(e, not(anObject(e)), "must be an object.");
                s(`Calling pre-processing listeners (${o.length})`);
                o.forEach((t => t(e)));
                s("Configuration pre-processing finished.");
                s(`Calling configuration listeners (${a.length})`);
                a.forEach((t => t(e)));
                s("Configuration finished.")
            };
            e.exports = {
                configure: configure,
                addListener: addListener,
                addPreProcessingListener: addPreProcessingListener,
                throwExceptionIf: throwExceptionIf,
                anObject: anObject,
                anInteger: anInteger,
                validIdentifier: validIdentifier,
                not: not
            }
        }, 9968: (e, t, n) => {
            const i = n(7854);
            const s = ":remote-addr - -" + ' ":method :url HTTP/:http-version"' + ' :status :content-length ":referrer"' + ' ":user-agent"';

            function getUrl(e) {
                return e.originalUrl || e.url
            }

            function assembleTokens(e, t, n) {
                const arrayUniqueTokens = e => {
                    const t = e.concat();
                    for (let e = 0; e < t.length; ++e) {
                        for (let n = e + 1; n < t.length; ++n) {
                            if (t[e].token == t[n].token) {
                                t.splice(n--, 1)
                            }
                        }
                    }
                    return t
                };
                const i = [];
                i.push({token: ":url", replacement: getUrl(e)});
                i.push({token: ":protocol", replacement: e.protocol});
                i.push({token: ":hostname", replacement: e.hostname});
                i.push({token: ":method", replacement: e.method});
                i.push({token: ":status", replacement: t.__statusCode || t.statusCode});
                i.push({token: ":response-time", replacement: t.responseTime});
                i.push({token: ":date", replacement: (new Date).toUTCString()});
                i.push({token: ":referrer", replacement: e.headers.referer || e.headers.referrer || ""});
                i.push({token: ":http-version", replacement: `${e.httpVersionMajor}.${e.httpVersionMinor}`});
                i.push({
                    token: ":remote-addr",
                    replacement: e.headers["x-forwarded-for"] || e.ip || e._remoteAddress || e.socket && (e.socket.remoteAddress || e.socket.socket && e.socket.socket.remoteAddress)
                });
                i.push({token: ":user-agent", replacement: e.headers["user-agent"]});
                i.push({
                    token: ":content-length",
                    replacement: t.getHeader("content-length") || t.__headers && t.__headers["Content-Length"] || "-"
                });
                i.push({
                    token: /:req\[([^\]]+)]/g, replacement(t, n) {
                        return e.headers[n.toLowerCase()]
                    }
                });
                i.push({
                    token: /:res\[([^\]]+)]/g, replacement(e, n) {
                        return t.getHeader(n.toLowerCase()) || t.__headers && t.__headers[n]
                    }
                });
                return arrayUniqueTokens(n.concat(i))
            }

            function format(e, t) {
                for (let n = 0; n < t.length; n++) {
                    e = e.replace(t[n].token, t[n].replacement)
                }
                return e
            }

            function createNoLogCondition(e) {
                let t = null;
                if (e instanceof RegExp) {
                    t = e
                }
                if (typeof e === "string") {
                    t = new RegExp(e)
                }
                if (Array.isArray(e)) {
                    const n = e.map((e => e.source ? e.source : e));
                    t = new RegExp(n.join("|"))
                }
                return t
            }

            function matchRules(e, t, n) {
                let s = t;
                if (n) {
                    const t = n.find((t => {
                        let n = false;
                        if (t.from && t.to) {
                            n = e >= t.from && e <= t.to
                        } else {
                            n = t.codes.indexOf(e) !== -1
                        }
                        return n
                    }));
                    if (t) {
                        s = i.getLevel(t.level, s)
                    }
                }
                return s
            }

            e.exports = function getLogger(e, t) {
                if (typeof t === "string" || typeof t === "function") {
                    t = {format: t}
                } else {
                    t = t || {}
                }
                const n = e;
                let o = i.getLevel(t.level, i.INFO);
                const a = t.format || s;
                return (e, s, r) => {
                    if (typeof e._logging !== "undefined") return r();
                    if (typeof t.nolog !== "function") {
                        const n = createNoLogCondition(t.nolog);
                        if (n && n.test(e.originalUrl)) return r()
                    }
                    if (n.isLevelEnabled(o) || t.level === "auto") {
                        const r = new Date;
                        const {writeHead: c} = s;
                        e._logging = true;
                        s.writeHead = (e, t) => {
                            s.writeHead = c;
                            s.writeHead(e, t);
                            s.__statusCode = e;
                            s.__headers = t || {}
                        };
                        let l = false;
                        const handler = () => {
                            if (l) {
                                return
                            }
                            l = true;
                            if (typeof t.nolog === "function") {
                                if (t.nolog(e, s) === true) {
                                    e._logging = false;
                                    return
                                }
                            }
                            s.responseTime = new Date - r;
                            if (s.statusCode && t.level === "auto") {
                                o = i.INFO;
                                if (s.statusCode >= 300) o = i.WARN;
                                if (s.statusCode >= 400) o = i.ERROR
                            }
                            o = matchRules(s.statusCode, o, t.statusRules);
                            const c = assembleTokens(e, s, t.tokens || []);
                            if (t.context) n.addContext("res", s);
                            if (typeof a === "function") {
                                const t = a(e, s, (e => format(e, c)));
                                if (t) n.log(o, t)
                            } else {
                                n.log(o, format(a, c))
                            }
                            if (t.context) n.removeContext("res")
                        };
                        s.on("end", handler);
                        s.on("finish", handler);
                        s.on("error", handler);
                        s.on("close", handler)
                    }
                    return r()
                }
            }
        }, 9370: (e, t, n) => {
            const i = n(6028);
            const s = n(857);
            const o = n(9023);
            const a = n(6928);
            const r = n(7016);
            const c = n(4078)("log4js:layouts");
            const l = {
                bold: [1, 22],
                italic: [3, 23],
                underline: [4, 24],
                inverse: [7, 27],
                white: [37, 39],
                grey: [90, 39],
                black: [90, 39],
                blue: [34, 39],
                cyan: [36, 39],
                green: [32, 39],
                magenta: [35, 39],
                red: [91, 39],
                yellow: [33, 39]
            };

            function colorizeStart(e) {
                return e ? `[${l[e][0]}m` : ""
            }

            function colorizeEnd(e) {
                return e ? `[${l[e][1]}m` : ""
            }

            function colorize(e, t) {
                return colorizeStart(t) + e + colorizeEnd(t)
            }

            function timestampLevelAndCategory(e, t) {
                return colorize(o.format("[%s] [%s] %s - ", i.asString(e.startTime), e.level.toString(), e.categoryName), t)
            }

            function basicLayout(e) {
                return timestampLevelAndCategory(e) + o.format(...e.data)
            }

            function colouredLayout(e) {
                return timestampLevelAndCategory(e, e.level.colour) + o.format(...e.data)
            }

            function messagePassThroughLayout(e) {
                return o.format(...e.data)
            }

            function dummyLayout(e) {
                return e.data[0]
            }

            function patternLayout(e, t) {
                const n = "%r %p %c - %m%n";
                const l = /%(-?[0-9]+)?(\.?-?[0-9]+)?([[\]cdhmnprzxXyflosCMAF%])(\{([^}]+)\})?|([^%]+)/;
                e = e || n;

                function categoryName(e, t) {
                    let n = e.categoryName;
                    if (t) {
                        const e = parseInt(t, 10);
                        const i = n.split(".");
                        if (e < i.length) {
                            n = i.slice(i.length - e).join(".")
                        }
                    }
                    return n
                }

                function formatAsDate(e, t) {
                    let n = i.ISO8601_FORMAT;
                    if (t) {
                        n = t;
                        switch (n) {
                            case"ISO8601":
                            case"ISO8601_FORMAT":
                                n = i.ISO8601_FORMAT;
                                break;
                            case"ISO8601_WITH_TZ_OFFSET":
                            case"ISO8601_WITH_TZ_OFFSET_FORMAT":
                                n = i.ISO8601_WITH_TZ_OFFSET_FORMAT;
                                break;
                            case"ABSOLUTE":
                                process.emitWarning("Pattern %d{ABSOLUTE} is deprecated in favor of %d{ABSOLUTETIME}. " + "Please use %d{ABSOLUTETIME} instead.", "DeprecationWarning", "log4js-node-DEP0003");
                                c("[log4js-node-DEP0003]", "DEPRECATION: Pattern %d{ABSOLUTE} is deprecated and replaced by %d{ABSOLUTETIME}.");
                            case"ABSOLUTETIME":
                            case"ABSOLUTETIME_FORMAT":
                                n = i.ABSOLUTETIME_FORMAT;
                                break;
                            case"DATE":
                                process.emitWarning("Pattern %d{DATE} is deprecated due to the confusion it causes when used. " + "Please use %d{DATETIME} instead.", "DeprecationWarning", "log4js-node-DEP0004");
                                c("[log4js-node-DEP0004]", "DEPRECATION: Pattern %d{DATE} is deprecated and replaced by %d{DATETIME}.");
                            case"DATETIME":
                            case"DATETIME_FORMAT":
                                n = i.DATETIME_FORMAT;
                                break
                        }
                    }
                    return i.asString(n, e.startTime)
                }

                function hostname() {
                    return s.hostname().toString()
                }

                function formatMessage(e, t) {
                    let n = e.data;
                    if (t) {
                        const [e, i] = t.split(",");
                        n = n.slice(e, i)
                    }
                    return o.format(...n)
                }

                function endOfLine() {
                    return s.EOL
                }

                function logLevel(e) {
                    return e.level.toString()
                }

                function startTime(e) {
                    return i.asString("hh:mm:ss", e.startTime)
                }

                function startColour(e) {
                    return colorizeStart(e.level.colour)
                }

                function endColour(e) {
                    return colorizeEnd(e.level.colour)
                }

                function percent() {
                    return "%"
                }

                function pid(e) {
                    return e && e.pid ? e.pid.toString() : process.pid.toString()
                }

                function clusterInfo() {
                    return pid()
                }

                function userDefined(e, n) {
                    if (typeof t[n] !== "undefined") {
                        return typeof t[n] === "function" ? t[n](e) : t[n]
                    }
                    return null
                }

                function contextDefined(e, t) {
                    const n = e.context[t];
                    if (typeof n !== "undefined") {
                        return typeof n === "function" ? n(e) : n
                    }
                    return null
                }

                function fileName(e, t) {
                    let n = e.fileName || "";
                    const convertFileURLToPath = function (e) {
                        const t = "file://";
                        if (e.startsWith(t)) {
                            if (typeof r.fileURLToPath === "function") {
                                e = r.fileURLToPath(e)
                            } else {
                                e = a.normalize(e.replace(new RegExp(`^${t}`), ""));
                                if (process.platform === "win32") {
                                    if (e.startsWith("\\")) {
                                        e = e.slice(1)
                                    } else {
                                        e = a.sep + a.sep + e
                                    }
                                }
                            }
                        }
                        return e
                    };
                    n = convertFileURLToPath(n);
                    if (t) {
                        const e = parseInt(t, 10);
                        const i = n.split(a.sep);
                        if (i.length > e) {
                            n = i.slice(-e).join(a.sep)
                        }
                    }
                    return n
                }

                function lineNumber(e) {
                    return e.lineNumber ? `${e.lineNumber}` : ""
                }

                function columnNumber(e) {
                    return e.columnNumber ? `${e.columnNumber}` : ""
                }

                function callStack(e) {
                    return e.callStack || ""
                }

                function className(e) {
                    return e.className || ""
                }

                function functionName(e) {
                    return e.functionName || ""
                }

                function functionAlias(e) {
                    return e.functionAlias || ""
                }

                function callerName(e) {
                    return e.callerName || ""
                }

                const p = {
                    c: categoryName,
                    d: formatAsDate,
                    h: hostname,
                    m: formatMessage,
                    n: endOfLine,
                    p: logLevel,
                    r: startTime,
                    "[": startColour,
                    "]": endColour,
                    y: clusterInfo,
                    z: pid,
                    "%": percent,
                    x: userDefined,
                    X: contextDefined,
                    f: fileName,
                    l: lineNumber,
                    o: columnNumber,
                    s: callStack,
                    C: className,
                    M: functionName,
                    A: functionAlias,
                    F: callerName
                };

                function replaceToken(e, t, n) {
                    return p[e](t, n)
                }

                function truncate(e, t) {
                    let n;
                    if (e) {
                        n = parseInt(e.slice(1), 10);
                        return n > 0 ? t.slice(0, n) : t.slice(n)
                    }
                    return t
                }

                function pad(e, t) {
                    let n;
                    if (e) {
                        if (e.charAt(0) === "-") {
                            n = parseInt(e.slice(1), 10);
                            while (t.length < n) {
                                t += " "
                            }
                        } else {
                            n = parseInt(e, 10);
                            while (t.length < n) {
                                t = ` ${t}`
                            }
                        }
                    }
                    return t
                }

                function truncateAndPad(e, t, n) {
                    let i = e;
                    i = truncate(t, i);
                    i = pad(n, i);
                    return i
                }

                return function (t) {
                    let n = "";
                    let i;
                    let s = e;
                    while ((i = l.exec(s)) !== null) {
                        const e = i[1];
                        const o = i[2];
                        const a = i[3];
                        const r = i[5];
                        const c = i[6];
                        if (c) {
                            n += c.toString()
                        } else {
                            const i = replaceToken(a, t, r);
                            n += truncateAndPad(i, o, e)
                        }
                        s = s.slice(i.index + i[0].length)
                    }
                    return n
                }
            }

            const p = {
                messagePassThrough() {
                    return messagePassThroughLayout
                }, basic() {
                    return basicLayout
                }, colored() {
                    return colouredLayout
                }, coloured() {
                    return colouredLayout
                }, pattern(e) {
                    return patternLayout(e && e.pattern, e && e.tokens)
                }, dummy() {
                    return dummyLayout
                }
            };
            e.exports = {
                basicLayout: basicLayout,
                messagePassThroughLayout: messagePassThroughLayout,
                patternLayout: patternLayout,
                colouredLayout: colouredLayout,
                coloredLayout: colouredLayout,
                dummyLayout: dummyLayout,
                addLayout(e, t) {
                    p[e] = t
                },
                layout(e, t) {
                    return p[e] && p[e](t)
                }
            }
        }, 7854: (e, t, n) => {
            const i = n(9131);
            const s = ["white", "grey", "black", "blue", "cyan", "green", "magenta", "red", "yellow"];

            class Level {
                constructor(e, t, n) {
                    this.level = e;
                    this.levelStr = t;
                    this.colour = n
                }

                toString() {
                    return this.levelStr
                }

                static getLevel(e, t) {
                    if (!e) {
                        return t
                    }
                    if (e instanceof Level) {
                        return e
                    }
                    if (e instanceof Object && e.levelStr) {
                        e = e.levelStr
                    }
                    return Level[e.toString().toUpperCase()] || t
                }

                static addLevels(e) {
                    if (e) {
                        const t = Object.keys(e);
                        t.forEach((t => {
                            const n = t.toUpperCase();
                            Level[n] = new Level(e[t].value, n, e[t].colour);
                            const i = Level.levels.findIndex((e => e.levelStr === n));
                            if (i > -1) {
                                Level.levels[i] = Level[n]
                            } else {
                                Level.levels.push(Level[n])
                            }
                        }));
                        Level.levels.sort(((e, t) => e.level - t.level))
                    }
                }

                isLessThanOrEqualTo(e) {
                    if (typeof e === "string") {
                        e = Level.getLevel(e)
                    }
                    return this.level <= e.level
                }

                isGreaterThanOrEqualTo(e) {
                    if (typeof e === "string") {
                        e = Level.getLevel(e)
                    }
                    return this.level >= e.level
                }

                isEqualTo(e) {
                    if (typeof e === "string") {
                        e = Level.getLevel(e)
                    }
                    return this.level === e.level
                }
            }

            Level.levels = [];
            Level.addLevels({
                ALL: {value: Number.MIN_VALUE, colour: "grey"},
                TRACE: {value: 5e3, colour: "blue"},
                DEBUG: {value: 1e4, colour: "cyan"},
                INFO: {value: 2e4, colour: "green"},
                WARN: {value: 3e4, colour: "yellow"},
                ERROR: {value: 4e4, colour: "red"},
                FATAL: {value: 5e4, colour: "magenta"},
                MARK: {value: 9007199254740992, colour: "grey"},
                OFF: {value: Number.MAX_VALUE, colour: "grey"}
            });
            i.addListener((e => {
                const t = e.levels;
                if (t) {
                    i.throwExceptionIf(e, i.not(i.anObject(t)), "levels must be an object");
                    const n = Object.keys(t);
                    n.forEach((n => {
                        i.throwExceptionIf(e, i.not(i.validIdentifier(n)), `level name "${n}" is not a valid identifier (must start with a letter, only contain A-Z,a-z,0-9,_)`);
                        i.throwExceptionIf(e, i.not(i.anObject(t[n])), `level "${n}" must be an object`);
                        i.throwExceptionIf(e, i.not(t[n].value), `level "${n}" must have a 'value' property`);
                        i.throwExceptionIf(e, i.not(i.anInteger(t[n].value)), `level "${n}".value must have an integer value`);
                        i.throwExceptionIf(e, i.not(t[n].colour), `level "${n}" must have a 'colour' property`);
                        i.throwExceptionIf(e, i.not(s.indexOf(t[n].colour) > -1), `level "${n}".colour must be one of ${s.join(", ")}`)
                    }))
                }
            }));
            i.addListener((e => {
                Level.addLevels(e.levels)
            }));
            e.exports = Level
        }, 364: (e, t, n) => {
            const i = n(4078)("log4js:main");
            const s = n(9896);
            const o = n(3033)({proto: true});
            const a = n(9131);
            const r = n(9370);
            const c = n(7854);
            const l = n(2534);
            const p = n(3609);
            const u = n(9893);
            const d = n(5703);
            const f = n(9968);
            const m = n(2029);
            let h = false;

            function sendLogEventToAppender(e) {
                if (!h) return;
                i("Received log event ", e);
                const t = p.appendersForCategory(e.categoryName);
                t.forEach((t => {
                    t(e)
                }))
            }

            function loadConfigurationFile(e) {
                i(`Loading configuration from ${e}`);
                try {
                    return JSON.parse(s.readFileSync(e, "utf8"))
                } catch (t) {
                    throw new Error(`Problem reading config from file "${e}". Error was ${t.message}`, t)
                }
            }

            function configure(e) {
                if (h) {
                    shutdown()
                }
                let t = e;
                if (typeof t === "string") {
                    t = loadConfigurationFile(e)
                }
                i(`Configuration is ${t}`);
                a.configure(o(t));
                d.onMessage(sendLogEventToAppender);
                h = true;
                return x
            }

            function isConfigured() {
                return h
            }

            function recording() {
                return m
            }

            function shutdown(e = () => {
            }) {
                if (typeof e !== "function") {
                    throw new TypeError("Invalid callback passed to shutdown")
                }
                i("Shutdown called. Disabling all log writing.");
                h = false;
                const t = Array.from(l.values());
                l.init();
                p.init();
                const n = t.reduce(((e, t) => t.shutdown ? e + 1 : e), 0);
                if (n === 0) {
                    i("No appenders with shutdown functions found.");
                    e()
                }
                let s = 0;
                let o;
                i(`Found ${n} appenders with shutdown functions.`);

                function complete(t) {
                    o = o || t;
                    s += 1;
                    i(`Appender shutdowns complete: ${s} / ${n}`);
                    if (s >= n) {
                        i("All shutdown functions completed.");
                        e(o)
                    }
                }

                t.filter((e => e.shutdown)).forEach((e => e.shutdown(complete)))
            }

            function getLogger(e) {
                if (!h) {
                    configure(process.env.LOG4JS_CONFIG || {
                        appenders: {out: {type: "stdout"}},
                        categories: {default: {appenders: ["out"], level: "OFF"}}
                    })
                }
                return new u(e || "default")
            }

            const x = {
                getLogger: getLogger,
                configure: configure,
                isConfigured: isConfigured,
                shutdown: shutdown,
                connectLogger: f,
                levels: c,
                addLayout: r.addLayout,
                recording: recording
            };
            e.exports = x
        }, 9893: (e, t, n) => {
            const i = n(4078)("log4js:logger");
            const s = n(1718);
            const o = n(7854);
            const a = n(5703);
            const r = n(3609);
            const c = n(9131);
            const l = /^(?:\s*)at (?:(.+) \()?(?:([^(]+?):(\d+):(\d+))\)?$/;
            const p = 1;
            const u = 3;

            function defaultParseCallStack(e, t = u + p) {
                try {
                    const n = e.stack.split("\n").slice(t);
                    if (!n.length) {
                        return null
                    }
                    const i = l.exec(n[0]);
                    if (i && i.length === 5) {
                        let e = "";
                        let t = "";
                        let s = "";
                        if (i[1] && i[1] !== "") {
                            [t, s] = i[1].replace(/[[\]]/g, "").split(" as ");
                            s = s || "";
                            if (t.includes(".")) [e, t] = t.split(".")
                        }
                        return {
                            fileName: i[2],
                            lineNumber: parseInt(i[3], 10),
                            columnNumber: parseInt(i[4], 10),
                            callStack: n.join("\n"),
                            className: e,
                            functionName: t,
                            functionAlias: s,
                            callerName: i[1] || ""
                        }
                    } else {
                        console.error("log4js.logger - defaultParseCallStack error")
                    }
                } catch (e) {
                    console.error("log4js.logger - defaultParseCallStack error", e)
                }
                return null
            }

            class Logger {
                constructor(e) {
                    if (!e) {
                        throw new Error("No category provided.")
                    }
                    this.category = e;
                    this.context = {};
                    this.callStackSkipIndex = 0;
                    this.parseCallStack = defaultParseCallStack;
                    i(`Logger created (${this.category}, ${this.level})`)
                }

                get level() {
                    return o.getLevel(r.getLevelForCategory(this.category), o.OFF)
                }

                set level(e) {
                    r.setLevelForCategory(this.category, o.getLevel(e, this.level))
                }

                get useCallStack() {
                    return r.getEnableCallStackForCategory(this.category)
                }

                set useCallStack(e) {
                    r.setEnableCallStackForCategory(this.category, e === true)
                }

                get callStackLinesToSkip() {
                    return this.callStackSkipIndex
                }

                set callStackLinesToSkip(e) {
                    if (typeof e !== "number") {
                        throw new TypeError("Must be a number")
                    }
                    if (e < 0) {
                        throw new RangeError("Must be >= 0")
                    }
                    this.callStackSkipIndex = e
                }

                log(e, ...t) {
                    const n = o.getLevel(e);
                    if (!n) {
                        if (c.validIdentifier(e) && t.length > 0) {
                            this.log(o.WARN, "log4js:logger.log: valid log-level not found as first parameter given:", e);
                            this.log(o.INFO, `[${e}]`, ...t)
                        } else {
                            this.log(o.INFO, e, ...t)
                        }
                    } else if (this.isLevelEnabled(n)) {
                        this._log(n, t)
                    }
                }

                isLevelEnabled(e) {
                    return this.level.isLessThanOrEqualTo(e)
                }

                _log(e, t) {
                    i(`sending log data (${e}) to appenders`);
                    const n = t.find((e => e instanceof Error));
                    let o;
                    if (this.useCallStack) {
                        try {
                            if (n) {
                                o = this.parseCallStack(n, this.callStackSkipIndex + p)
                            }
                        } catch (e) {
                        }
                        o = o || this.parseCallStack(new Error, this.callStackSkipIndex + u + p)
                    }
                    const r = new s(this.category, e, t, this.context, o, n);
                    a.send(r)
                }

                addContext(e, t) {
                    this.context[e] = t
                }

                removeContext(e) {
                    delete this.context[e]
                }

                clearContext() {
                    this.context = {}
                }

                setParseCallStackFunction(e) {
                    if (typeof e === "function") {
                        this.parseCallStack = e
                    } else if (typeof e === "undefined") {
                        this.parseCallStack = defaultParseCallStack
                    } else {
                        throw new TypeError("Invalid type passed to setParseCallStackFunction")
                    }
                }
            }

            function addLevelMethods(e) {
                const t = o.getLevel(e);
                const n = t.toString().toLowerCase();
                const i = n.replace(/_([a-z])/g, (e => e[1].toUpperCase()));
                const s = i[0].toUpperCase() + i.slice(1);
                Logger.prototype[`is${s}Enabled`] = function () {
                    return this.isLevelEnabled(t)
                };
                Logger.prototype[i] = function (...e) {
                    this.log(t, ...e)
                }
            }

            o.levels.forEach(addLevelMethods);
            c.addListener((() => {
                o.levels.forEach(addLevelMethods)
            }));
            e.exports = Logger
        }, 4841: e => {
            "use strict";
            e.exports = Math.abs
        }, 3515: e => {
            "use strict";
            e.exports = Math.floor
        }, 6276: e => {
            "use strict";
            e.exports = Number.isNaN || function isNaN(e) {
                return e !== e
            }
        }, 6379: e => {
            "use strict";
            e.exports = Math.max
        }, 7721: e => {
            "use strict";
            e.exports = Math.min
        }, 3171: e => {
            "use strict";
            e.exports = Math.pow
        }, 4077: e => {
            "use strict";
            e.exports = Math.round
        }, 3628: (e, t, n) => {
            "use strict";
            var i = n(6276);
            e.exports = function sign(e) {
                if (i(e) || e === 0) {
                    return e
                }
                return e < 0 ? -1 : +1
            }
        }, 6533: (e, t, n) => {
            /*!
 * mime-db
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015-2022 Douglas Christopher Wilson
 * MIT Licensed
 */
            e.exports = n(1813)
        }, 6720: (e, t, n) => {
            "use strict";
            /*!
 * mime-types
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */
            var i = n(6533);
            var s = n(6928).extname;
            var o = /^\s*([^;\s]*)(?:;|\s|$)/;
            var a = /^text\//i;
            t.charset = charset;
            t.charsets = {lookup: charset};
            t.contentType = contentType;
            t.extension = extension;
            t.extensions = Object.create(null);
            t.lookup = lookup;
            t.types = Object.create(null);
            populateMaps(t.extensions, t.types);

            function charset(e) {
                if (!e || typeof e !== "string") {
                    return false
                }
                var t = o.exec(e);
                var n = t && i[t[1].toLowerCase()];
                if (n && n.charset) {
                    return n.charset
                }
                if (t && a.test(t[1])) {
                    return "UTF-8"
                }
                return false
            }

            function contentType(e) {
                if (!e || typeof e !== "string") {
                    return false
                }
                var n = e.indexOf("/") === -1 ? t.lookup(e) : e;
                if (!n) {
                    return false
                }
                if (n.indexOf("charset") === -1) {
                    var i = t.charset(n);
                    if (i) n += "; charset=" + i.toLowerCase()
                }
                return n
            }

            function extension(e) {
                if (!e || typeof e !== "string") {
                    return false
                }
                var n = o.exec(e);
                var i = n && t.extensions[n[1].toLowerCase()];
                if (!i || !i.length) {
                    return false
                }
                return i[0]
            }

            function lookup(e) {
                if (!e || typeof e !== "string") {
                    return false
                }
                var n = s("x." + e).toLowerCase().substr(1);
                if (!n) {
                    return false
                }
                return t.types[n] || false
            }

            function populateMaps(e, t) {
                var n = ["nginx", "apache", undefined, "iana"];
                Object.keys(i).forEach((function forEachMimeType(s) {
                    var o = i[s];
                    var a = o.extensions;
                    if (!a || !a.length) {
                        return
                    }
                    e[s] = a;
                    for (var r = 0; r < a.length; r++) {
                        var c = a[r];
                        if (t[c]) {
                            var l = n.indexOf(i[t[c]].source);
                            var p = n.indexOf(o.source);
                            if (t[c] !== "application/octet-stream" && (l > p || l === p && t[c].substr(0, 12) === "application/")) {
                                continue
                            }
                        }
                        t[c] = s
                    }
                }))
            }
        }, 376: e => {
            var t = 1e3;
            var n = t * 60;
            var i = n * 60;
            var s = i * 24;
            var o = s * 7;
            var a = s * 365.25;
            e.exports = function (e, t) {
                t = t || {};
                var n = typeof e;
                if (n === "string" && e.length > 0) {
                    return parse(e)
                } else if (n === "number" && isFinite(e)) {
                    return t.long ? fmtLong(e) : fmtShort(e)
                }
                throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(e))
            };

            function parse(e) {
                e = String(e);
                if (e.length > 100) {
                    return
                }
                var r = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(e);
                if (!r) {
                    return
                }
                var c = parseFloat(r[1]);
                var l = (r[2] || "ms").toLowerCase();
                switch (l) {
                    case"years":
                    case"year":
                    case"yrs":
                    case"yr":
                    case"y":
                        return c * a;
                    case"weeks":
                    case"week":
                    case"w":
                        return c * o;
                    case"days":
                    case"day":
                    case"d":
                        return c * s;
                    case"hours":
                    case"hour":
                    case"hrs":
                    case"hr":
                    case"h":
                        return c * i;
                    case"minutes":
                    case"minute":
                    case"mins":
                    case"min":
                    case"m":
                        return c * n;
                    case"seconds":
                    case"second":
                    case"secs":
                    case"sec":
                    case"s":
                        return c * t;
                    case"milliseconds":
                    case"millisecond":
                    case"msecs":
                    case"msec":
                    case"ms":
                        return c;
                    default:
                        return undefined
                }
            }

            function fmtShort(e) {
                var o = Math.abs(e);
                if (o >= s) {
                    return Math.round(e / s) + "d"
                }
                if (o >= i) {
                    return Math.round(e / i) + "h"
                }
                if (o >= n) {
                    return Math.round(e / n) + "m"
                }
                if (o >= t) {
                    return Math.round(e / t) + "s"
                }
                return e + "ms"
            }

            function fmtLong(e) {
                var o = Math.abs(e);
                if (o >= s) {
                    return plural(e, o, s, "day")
                }
                if (o >= i) {
                    return plural(e, o, i, "hour")
                }
                if (o >= n) {
                    return plural(e, o, n, "minute")
                }
                if (o >= t) {
                    return plural(e, o, t, "second")
                }
                return e + " ms"
            }

            function plural(e, t, n, i) {
                var s = t >= n * 1.5;
                return Math.round(e / n) + " " + i + (s ? "s" : "")
            }
        }, 6801: (e, t, n) => {
            "use strict";
            var i = n(7016).parse;
            var s = {ftp: 21, gopher: 70, http: 80, https: 443, ws: 80, wss: 443};
            var o = String.prototype.endsWith || function (e) {
                return e.length <= this.length && this.indexOf(e, this.length - e.length) !== -1
            };

            function getProxyForUrl(e) {
                var t = typeof e === "string" ? i(e) : e || {};
                var n = t.protocol;
                var o = t.host;
                var a = t.port;
                if (typeof o !== "string" || !o || typeof n !== "string") {
                    return ""
                }
                n = n.split(":", 1)[0];
                o = o.replace(/:\d*$/, "");
                a = parseInt(a) || s[n] || 0;
                if (!shouldProxy(o, a)) {
                    return ""
                }
                var r = getEnv("npm_config_" + n + "_proxy") || getEnv(n + "_proxy") || getEnv("npm_config_proxy") || getEnv("all_proxy");
                if (r && r.indexOf("://") === -1) {
                    r = n + "://" + r
                }
                return r
            }

            function shouldProxy(e, t) {
                var n = (getEnv("npm_config_no_proxy") || getEnv("no_proxy")).toLowerCase();
                if (!n) {
                    return true
                }
                if (n === "*") {
                    return false
                }
                return n.split(/[,\s]/).every((function (n) {
                    if (!n) {
                        return true
                    }
                    var i = n.match(/^(.+):(\d+)$/);
                    var s = i ? i[1] : n;
                    var a = i ? parseInt(i[2]) : 0;
                    if (a && a !== t) {
                        return true
                    }
                    if (!/^[.*]/.test(s)) {
                        return e !== s
                    }
                    if (s.charAt(0) === "*") {
                        s = s.slice(1)
                    }
                    return !o.call(e, s)
                }))
            }

            function getEnv(e) {
                return process.env[e.toLowerCase()] || process.env[e.toUpperCase()] || ""
            }

            t.getProxyForUrl = getProxyForUrl
        }, 3033: e => {
            "use strict";
            e.exports = rfdc;

            function copyBuffer(e) {
                if (e instanceof Buffer) {
                    return Buffer.from(e)
                }
                return new e.constructor(e.buffer.slice(), e.byteOffset, e.length)
            }

            function rfdc(e) {
                e = e || {};
                if (e.circles) return rfdcCircles(e);
                const t = new Map;
                t.set(Date, (e => new Date(e)));
                t.set(Map, ((e, t) => new Map(cloneArray(Array.from(e), t))));
                t.set(Set, ((e, t) => new Set(cloneArray(Array.from(e), t))));
                if (e.constructorHandlers) {
                    for (const n of e.constructorHandlers) {
                        t.set(n[0], n[1])
                    }
                }
                let n = null;
                return e.proto ? cloneProto : clone;

                function cloneArray(e, i) {
                    const s = Object.keys(e);
                    const o = new Array(s.length);
                    for (let a = 0; a < s.length; a++) {
                        const r = s[a];
                        const c = e[r];
                        if (typeof c !== "object" || c === null) {
                            o[r] = c
                        } else if (c.constructor !== Object && (n = t.get(c.constructor))) {
                            o[r] = n(c, i)
                        } else if (ArrayBuffer.isView(c)) {
                            o[r] = copyBuffer(c)
                        } else {
                            o[r] = i(c)
                        }
                    }
                    return o
                }

                function clone(e) {
                    if (typeof e !== "object" || e === null) return e;
                    if (Array.isArray(e)) return cloneArray(e, clone);
                    if (e.constructor !== Object && (n = t.get(e.constructor))) {
                        return n(e, clone)
                    }
                    const i = {};
                    for (const s in e) {
                        if (Object.hasOwnProperty.call(e, s) === false) continue;
                        const o = e[s];
                        if (typeof o !== "object" || o === null) {
                            i[s] = o
                        } else if (o.constructor !== Object && (n = t.get(o.constructor))) {
                            i[s] = n(o, clone)
                        } else if (ArrayBuffer.isView(o)) {
                            i[s] = copyBuffer(o)
                        } else {
                            i[s] = clone(o)
                        }
                    }
                    return i
                }

                function cloneProto(e) {
                    if (typeof e !== "object" || e === null) return e;
                    if (Array.isArray(e)) return cloneArray(e, cloneProto);
                    if (e.constructor !== Object && (n = t.get(e.constructor))) {
                        return n(e, cloneProto)
                    }
                    const i = {};
                    for (const s in e) {
                        const o = e[s];
                        if (typeof o !== "object" || o === null) {
                            i[s] = o
                        } else if (o.constructor !== Object && (n = t.get(o.constructor))) {
                            i[s] = n(o, cloneProto)
                        } else if (ArrayBuffer.isView(o)) {
                            i[s] = copyBuffer(o)
                        } else {
                            i[s] = cloneProto(o)
                        }
                    }
                    return i
                }
            }

            function rfdcCircles(e) {
                const t = [];
                const n = [];
                const i = new Map;
                i.set(Date, (e => new Date(e)));
                i.set(Map, ((e, t) => new Map(cloneArray(Array.from(e), t))));
                i.set(Set, ((e, t) => new Set(cloneArray(Array.from(e), t))));
                if (e.constructorHandlers) {
                    for (const t of e.constructorHandlers) {
                        i.set(t[0], t[1])
                    }
                }
                let s = null;
                return e.proto ? cloneProto : clone;

                function cloneArray(e, o) {
                    const a = Object.keys(e);
                    const r = new Array(a.length);
                    for (let c = 0; c < a.length; c++) {
                        const l = a[c];
                        const p = e[l];
                        if (typeof p !== "object" || p === null) {
                            r[l] = p
                        } else if (p.constructor !== Object && (s = i.get(p.constructor))) {
                            r[l] = s(p, o)
                        } else if (ArrayBuffer.isView(p)) {
                            r[l] = copyBuffer(p)
                        } else {
                            const e = t.indexOf(p);
                            if (e !== -1) {
                                r[l] = n[e]
                            } else {
                                r[l] = o(p)
                            }
                        }
                    }
                    return r
                }

                function clone(e) {
                    if (typeof e !== "object" || e === null) return e;
                    if (Array.isArray(e)) return cloneArray(e, clone);
                    if (e.constructor !== Object && (s = i.get(e.constructor))) {
                        return s(e, clone)
                    }
                    const o = {};
                    t.push(e);
                    n.push(o);
                    for (const a in e) {
                        if (Object.hasOwnProperty.call(e, a) === false) continue;
                        const r = e[a];
                        if (typeof r !== "object" || r === null) {
                            o[a] = r
                        } else if (r.constructor !== Object && (s = i.get(r.constructor))) {
                            o[a] = s(r, clone)
                        } else if (ArrayBuffer.isView(r)) {
                            o[a] = copyBuffer(r)
                        } else {
                            const e = t.indexOf(r);
                            if (e !== -1) {
                                o[a] = n[e]
                            } else {
                                o[a] = clone(r)
                            }
                        }
                    }
                    t.pop();
                    n.pop();
                    return o
                }

                function cloneProto(e) {
                    if (typeof e !== "object" || e === null) return e;
                    if (Array.isArray(e)) return cloneArray(e, cloneProto);
                    if (e.constructor !== Object && (s = i.get(e.constructor))) {
                        return s(e, cloneProto)
                    }
                    const o = {};
                    t.push(e);
                    n.push(o);
                    for (const a in e) {
                        const r = e[a];
                        if (typeof r !== "object" || r === null) {
                            o[a] = r
                        } else if (r.constructor !== Object && (s = i.get(r.constructor))) {
                            o[a] = s(r, cloneProto)
                        } else if (ArrayBuffer.isView(r)) {
                            o[a] = copyBuffer(r)
                        } else {
                            const e = t.indexOf(r);
                            if (e !== -1) {
                                o[a] = n[e]
                            } else {
                                o[a] = cloneProto(r)
                            }
                        }
                    }
                    t.pop();
                    n.pop();
                    return o
                }
            }
        }, 2335: (e, t, n) => {
            const i = n(632);

            class DateRollingFileStream extends i {
                constructor(e, t, n) {
                    if (t && typeof t === "object") {
                        n = t;
                        t = null
                    }
                    if (!n) {
                        n = {}
                    }
                    if (!t) {
                        t = "yyyy-MM-dd"
                    }
                    n.pattern = t;
                    if (!n.numBackups && n.numBackups !== 0) {
                        if (!n.daysToKeep && n.daysToKeep !== 0) {
                            n.daysToKeep = 1
                        } else {
                            process.emitWarning("options.daysToKeep is deprecated due to the confusion it causes when used " + "together with file size rolling. Please use options.numBackups instead.", "DeprecationWarning", "streamroller-DEP0001")
                        }
                        n.numBackups = n.daysToKeep
                    } else {
                        n.daysToKeep = n.numBackups
                    }
                    super(e, n);
                    this.mode = this.options.mode
                }

                get theStream() {
                    return this.currentFileStream
                }
            }

            e.exports = DateRollingFileStream
        }, 4331: (e, t, n) => {
            const i = n(632);

            class RollingFileStream extends i {
                constructor(e, t, n, i) {
                    if (!i) {
                        i = {}
                    }
                    if (t) {
                        i.maxSize = t
                    }
                    if (!i.numBackups && i.numBackups !== 0) {
                        if (!n && n !== 0) {
                            n = 1
                        }
                        i.numBackups = n
                    }
                    super(e, i);
                    this.backups = i.numBackups;
                    this.size = this.options.maxSize
                }

                get theStream() {
                    return this.currentFileStream
                }
            }

            e.exports = RollingFileStream
        }, 632: (e, t, n) => {
            const i = n(4078)("streamroller:RollingFileWriteStream");
            const s = n(5700);
            const o = n(6928);
            const a = n(857);
            const r = n(2652);
            const c = n(6028);
            const {Writable: l} = n(2203);
            const p = n(2793);
            const u = n(5292);
            const d = n(2946);
            const deleteFiles = e => {
                i(`deleteFiles: files to delete: ${e}`);
                return Promise.all(e.map((e => s.unlink(e).catch((t => {
                    i(`deleteFiles: error when unlinking ${e}, ignoring. Error was ${t}`)
                })))))
            };

            class RollingFileWriteStream extends l {
                constructor(e, t) {
                    i(`constructor: creating RollingFileWriteStream. path=${e}`);
                    if (typeof e !== "string" || e.length === 0) {
                        throw new Error(`Invalid filename: ${e}`)
                    } else if (e.endsWith(o.sep)) {
                        throw new Error(`Filename is a directory: ${e}`)
                    } else if (e.indexOf(`~${o.sep}`) === 0) {
                        e = e.replace("~", a.homedir())
                    }
                    super(t);
                    this.options = this._parseOption(t);
                    this.fileObject = o.parse(e);
                    if (this.fileObject.dir === "") {
                        this.fileObject = o.parse(o.join(process.cwd(), e))
                    }
                    this.fileFormatter = p({
                        file: this.fileObject,
                        alwaysIncludeDate: this.options.alwaysIncludePattern,
                        needsIndex: this.options.maxSize < Number.MAX_SAFE_INTEGER,
                        compress: this.options.compress,
                        keepFileExt: this.options.keepFileExt,
                        fileNameSep: this.options.fileNameSep
                    });
                    this.fileNameParser = u({
                        file: this.fileObject,
                        keepFileExt: this.options.keepFileExt,
                        pattern: this.options.pattern,
                        fileNameSep: this.options.fileNameSep
                    });
                    this.state = {currentSize: 0};
                    if (this.options.pattern) {
                        this.state.currentDate = c(this.options.pattern, r())
                    }
                    this.filename = this.fileFormatter({index: 0, date: this.state.currentDate});
                    if (["a", "a+", "as", "as+"].includes(this.options.flags)) {
                        this._setExistingSizeAndDate()
                    }
                    i(`constructor: create new file ${this.filename}, state=${JSON.stringify(this.state)}`);
                    this._renewWriteStream()
                }

                _setExistingSizeAndDate() {
                    try {
                        const e = s.statSync(this.filename);
                        this.state.currentSize = e.size;
                        if (this.options.pattern) {
                            this.state.currentDate = c(this.options.pattern, e.mtime)
                        }
                    } catch (e) {

                    }
                }

                _parseOption(e) {
                    const t = {
                        maxSize: 0,
                        numToKeep: Number.MAX_SAFE_INTEGER,
                        encoding: "utf8",
                        mode: parseInt("0600", 8),
                        flags: "a",
                        compress: false,
                        keepFileExt: false,
                        alwaysIncludePattern: false
                    };
                    const n = Object.assign({}, t, e);
                    if (!n.maxSize) {
                        delete n.maxSize
                    } else if (n.maxSize <= 0) {
                        throw new Error(`options.maxSize (${n.maxSize}) should be > 0`)
                    }
                    if (n.numBackups || n.numBackups === 0) {
                        if (n.numBackups < 0) {
                            throw new Error(`options.numBackups (${n.numBackups}) should be >= 0`)
                        } else if (n.numBackups >= Number.MAX_SAFE_INTEGER) {
                            throw new Error(`options.numBackups (${n.numBackups}) should be < Number.MAX_SAFE_INTEGER`)
                        } else {
                            n.numToKeep = n.numBackups + 1
                        }
                    } else if (n.numToKeep <= 0) {
                        throw new Error(`options.numToKeep (${n.numToKeep}) should be > 0`)
                    }
                    i(`_parseOption: creating stream with option=${JSON.stringify(n)}`);
                    return n
                }

                _final(e) {
                    this.currentFileStream.end("", this.options.encoding, e)
                }

                _write(e, t, n) {
                    this._shouldRoll().then((() => {
                        i(`_write: writing chunk. ` + `file=${this.currentFileStream.path} ` + `state=${JSON.stringify(this.state)} ` + `chunk=${e}`);
                        this.currentFileStream.write(e, t, (t => {
                            this.state.currentSize += e.length;
                            n(t)
                        }))
                    }))
                }

                async _shouldRoll() {
                    if (this._dateChanged() || this._tooBig()) {
                        i(`_shouldRoll: rolling because dateChanged? ${this._dateChanged()} or tooBig? ${this._tooBig()}`);
                        await this._roll()
                    }
                }

                _dateChanged() {
                    return this.state.currentDate && this.state.currentDate !== c(this.options.pattern, r())
                }

                _tooBig() {
                    return this.state.currentSize >= this.options.maxSize
                }

                _roll() {
                    i(`_roll: closing the current stream`);
                    return new Promise(((e, t) => {
                        this.currentFileStream.end("", this.options.encoding, (() => {
                            this._moveOldFiles().then(e).catch(t)
                        }))
                    }))
                }

                async _moveOldFiles() {
                    const e = await this._getExistingFiles();
                    const t = this.state.currentDate ? e.filter((e => e.date === this.state.currentDate)) : e;
                    for (let e = t.length; e >= 0; e--) {
                        i(`_moveOldFiles: i = ${e}`);
                        const t = this.fileFormatter({date: this.state.currentDate, index: e});
                        const n = this.fileFormatter({date: this.state.currentDate, index: e + 1});
                        const s = {compress: this.options.compress && e === 0, mode: this.options.mode};
                        await d(t, n, s)
                    }
                    this.state.currentSize = 0;
                    this.state.currentDate = this.state.currentDate ? c(this.options.pattern, r()) : null;
                    i(`_moveOldFiles: finished rolling files. state=${JSON.stringify(this.state)}`);
                    this._renewWriteStream();
                    await new Promise(((e, t) => {
                        this.currentFileStream.write("", "utf8", (() => {
                            this._clean().then(e).catch(t)
                        }))
                    }))
                }

                async _getExistingFiles() {
                    const e = await s.readdir(this.fileObject.dir).catch((() => []));
                    i(`_getExistingFiles: files=${e}`);
                    const t = e.map((e => this.fileNameParser(e))).filter((e => e));
                    const getKey = e => (e.timestamp ? e.timestamp : r().getTime()) - e.index;
                    t.sort(((e, t) => getKey(e) - getKey(t)));
                    return t
                }

                _renewWriteStream() {
                    const e = this.fileFormatter({date: this.state.currentDate, index: 0});
                    const mkdir = e => {
                        try {
                            return s.mkdirSync(e, {recursive: true})
                        } catch (t) {
                            if (t.code === "ENOENT") {
                                mkdir(o.dirname(e));
                                return mkdir(e)
                            }
                            if (t.code !== "EEXIST" && t.code !== "EROFS") {
                                throw t
                            } else {
                                try {
                                    if (s.statSync(e).isDirectory()) {
                                        return e
                                    }
                                    throw t
                                } catch (e) {
                                    throw t
                                }
                            }
                        }
                    };
                    mkdir(this.fileObject.dir);
                    const t = {flags: this.options.flags, encoding: this.options.encoding, mode: this.options.mode};
                    const renameKey = function (e, t, n) {
                        e[n] = e[t];
                        delete e[t];
                        return e
                    };
                    s.appendFileSync(e, "", renameKey({...t}, "flags", "flag"));
                    this.currentFileStream = s.createWriteStream(e, t);
                    this.currentFileStream.on("error", (e => {
                        this.emit("error", e)
                    }))
                }

                async _clean() {
                    const e = await this._getExistingFiles();
                    i(`_clean: numToKeep = ${this.options.numToKeep}, existingFiles = ${e.length}`);
                    i("_clean: existing files are: ", e);
                    if (this._tooManyFiles(e.length)) {
                        const t = e.slice(0, e.length - this.options.numToKeep).map((e => o.format({
                            dir: this.fileObject.dir,
                            base: e.filename
                        })));
                        await deleteFiles(t)
                    }
                }

                _tooManyFiles(e) {
                    return this.options.numToKeep > 0 && e > this.options.numToKeep
                }
            }

            e.exports = RollingFileWriteStream
        }, 2793: (e, t, n) => {
            const i = n(4078)("streamroller:fileNameFormatter");
            const s = n(6928);
            const o = ".gz";
            const a = ".";
            e.exports = ({
                             file: e,
                             keepFileExt: t,
                             needsIndex: n,
                             alwaysIncludeDate: r,
                             compress: c,
                             fileNameSep: l
                         }) => {
                let p = l || a;
                const u = s.join(e.dir, e.name);
                const ext = t => t + e.ext;
                const index = (e, t, i) => (n || !i) && t ? e + p + t : e;
                const date = (e, t, n) => (t > 0 || r) && n ? e + p + n : e;
                const gzip = (e, t) => t && c ? e + o : e;
                const d = t ? [date, index, ext, gzip] : [ext, date, index, gzip];
                return ({date: e, index: t}) => {
                    i(`_formatFileName: date=${e}, index=${t}`);
                    return d.reduce(((n, i) => i(n, t, e)), u)
                }
            }
        }, 5292: (e, t, n) => {
            const i = n(4078)("streamroller:fileNameParser");
            const s = ".gz";
            const o = n(6028);
            const a = ".";
            e.exports = ({file: e, keepFileExt: t, pattern: n, fileNameSep: r}) => {
                let c = r || a;
                const zip = (e, t) => {
                    if (e.endsWith(s)) {
                        i("it is gzipped");
                        t.isCompressed = true;
                        return e.slice(0, -1 * s.length)
                    }
                    return e
                };
                const l = "__NOT_MATCHING__";
                const extAtEnd = t => {
                    if (t.startsWith(e.name) && t.endsWith(e.ext)) {
                        i("it starts and ends with the right things");
                        return t.slice(e.name.length + 1, -1 * e.ext.length)
                    }
                    return l
                };
                const extInMiddle = t => {
                    if (t.startsWith(e.base)) {
                        i("it starts with the right things");
                        return t.slice(e.base.length + 1)
                    }
                    return l
                };
                const dateAndIndex = (e, t) => {
                    const s = e.split(c);
                    let a = s[s.length - 1];
                    i("items: ", s, ", indexStr: ", a);
                    let r = e;
                    if (a !== undefined && a.match(/^\d+$/)) {
                        r = e.slice(0, -1 * (a.length + 1));
                        i(`dateStr is ${r}`);
                        if (n && !r) {
                            r = a;
                            a = "0"
                        }
                    } else {
                        a = "0"
                    }
                    try {
                        const i = o.parse(n, r, new Date(0, 0));
                        if (o.asString(n, i) !== r) return e;
                        t.index = parseInt(a, 10);
                        t.date = r;
                        t.timestamp = i.getTime();
                        return ""
                    } catch (t) {
                        i(`Problem parsing ${r} as ${n}, error was: `, t);
                        return e
                    }
                };
                const index = (e, t) => {
                    if (e.match(/^\d+$/)) {
                        i("it has an index");
                        t.index = parseInt(e, 10);
                        return ""
                    }
                    return e
                };
                let p = [zip, t ? extAtEnd : extInMiddle, n ? dateAndIndex : index];
                return e => {
                    let t = {filename: e, index: 0, isCompressed: false};
                    let n = p.reduce(((e, n) => n(e, t)), e);
                    return n ? null : t
                }
            }
        }, 5464: (e, t, n) => {
            e.exports = {RollingFileWriteStream: n(632), RollingFileStream: n(4331), DateRollingFileStream: n(2335)}
        }, 2946: (e, t, n) => {
            const i = n(4078)("streamroller:moveAndMaybeCompressFile");
            const s = n(5700);
            const o = n(3106);
            const _parseOption = function (e) {
                const t = {mode: parseInt("0600", 8), compress: false};
                const n = Object.assign({}, t, e);
                i(`_parseOption: moveAndMaybeCompressFile called with option=${JSON.stringify(n)}`);
                return n
            };
            const moveAndMaybeCompressFile = async (e, t, n) => {
                n = _parseOption(n);
                if (e === t) {
                    i(`moveAndMaybeCompressFile: source and target are the same, not doing anything`);
                    return
                }
                if (await s.pathExists(e)) {
                    i(`moveAndMaybeCompressFile: moving file from ${e} to ${t} ${n.compress ? "with" : "without"} compress`);
                    if (n.compress) {
                        await new Promise(((a, r) => {
                            let c = false;
                            const l = s.createWriteStream(t, {mode: n.mode, flags: "wx"}).on("open", (() => {
                                c = true;
                                const t = s.createReadStream(e).on("open", (() => {
                                    t.pipe(o.createGzip()).pipe(l)
                                })).on("error", (t => {
                                    i(`moveAndMaybeCompressFile: error reading ${e}`, t);
                                    l.destroy(t)
                                }))
                            })).on("finish", (() => {
                                i(`moveAndMaybeCompressFile: finished compressing ${t}, deleting ${e}`);
                                s.unlink(e).then(a).catch((t => {
                                    i(`moveAndMaybeCompressFile: error deleting ${e}, truncating instead`, t);
                                    s.truncate(e).then(a).catch((t => {
                                        i(`moveAndMaybeCompressFile: error truncating ${e}`, t);
                                        r(t)
                                    }))
                                }))
                            })).on("error", (e => {
                                if (!c) {
                                    i(`moveAndMaybeCompressFile: error creating ${t}`, e);
                                    r(e)
                                } else {
                                    i(`moveAndMaybeCompressFile: error writing ${t}, deleting`, e);
                                    s.unlink(t).then((() => {
                                        r(e)
                                    })).catch((e => {
                                        i(`moveAndMaybeCompressFile: error deleting ${t}`, e);
                                        r(e)
                                    }))
                                }
                            }))
                        })).catch((() => {
                        }))
                    } else {
                        i(`moveAndMaybeCompressFile: renaming ${e} to ${t}`);
                        try {
                            await s.move(e, t, {overwrite: true})
                        } catch (n) {
                            i(`moveAndMaybeCompressFile: error renaming ${e} to ${t}`, n);
                            if (n.code !== "ENOENT") {
                                i(`moveAndMaybeCompressFile: trying copy+truncate instead`);
                                try {
                                    await s.copy(e, t, {overwrite: true});
                                    await s.truncate(e)
                                } catch (e) {
                                    i(`moveAndMaybeCompressFile: error copy+truncate`, e)
                                }
                            }
                        }
                    }
                }
            };
            e.exports = moveAndMaybeCompressFile
        }, 2652: e => {
            e.exports = () => new Date
        }, 675: (e, t, n) => {
            "use strict";
            const i = n(4896);
            const s = n(6928);
            const o = n(2381).mkdirsSync;
            const a = n(1178).utimesMillisSync;
            const r = n(7291);

            function copySync(e, t, n) {
                if (typeof n === "function") {
                    n = {filter: n}
                }
                n = n || {};
                n.clobber = "clobber" in n ? !!n.clobber : true;
                n.overwrite = "overwrite" in n ? !!n.overwrite : n.clobber;
                if (n.preserveTimestamps && process.arch === "ia32") {
                    console.warn(`fs-extra: Using the preserveTimestamps option in 32-bit node is not recommended;\n\n    see https://github.com/jprichardson/node-fs-extra/issues/269`)
                }
                const {srcStat: i, destStat: s} = r.checkPathsSync(e, t, "copy");
                r.checkParentPathsSync(e, i, t, "copy");
                return handleFilterAndCopy(s, e, t, n)
            }

            function handleFilterAndCopy(e, t, n, a) {
                if (a.filter && !a.filter(t, n)) return;
                const r = s.dirname(n);
                if (!i.existsSync(r)) o(r);
                return startCopy(e, t, n, a)
            }

            function startCopy(e, t, n, i) {
                if (i.filter && !i.filter(t, n)) return;
                return getStats(e, t, n, i)
            }

            function getStats(e, t, n, s) {
                const o = s.dereference ? i.statSync : i.lstatSync;
                const a = o(t);
                if (a.isDirectory()) return onDir(a, e, t, n, s); else if (a.isFile() || a.isCharacterDevice() || a.isBlockDevice()) return onFile(a, e, t, n, s); else if (a.isSymbolicLink()) return onLink(e, t, n, s)
            }

            function onFile(e, t, n, i, s) {
                if (!t) return copyFile(e, n, i, s);
                return mayCopyFile(e, n, i, s)
            }

            function mayCopyFile(e, t, n, s) {
                if (s.overwrite) {
                    i.unlinkSync(n);
                    return copyFile(e, t, n, s)
                } else if (s.errorOnExist) {
                    throw new Error(`'${n}' already exists`)
                }
            }

            function copyFile(e, t, n, s) {
                if (typeof i.copyFileSync === "function") {
                    i.copyFileSync(t, n);
                    i.chmodSync(n, e.mode);
                    if (s.preserveTimestamps) {
                        return a(n, e.atime, e.mtime)
                    }
                    return
                }
                return copyFileFallback(e, t, n, s)
            }

            function copyFileFallback(e, t, s, o) {
                const a = 64 * 1024;
                const r = n(647)(a);
                const c = i.openSync(t, "r");
                const l = i.openSync(s, "w", e.mode);
                let p = 0;
                while (p < e.size) {
                    const e = i.readSync(c, r, 0, a, p);
                    i.writeSync(l, r, 0, e);
                    p += e
                }
                if (o.preserveTimestamps) i.futimesSync(l, e.atime, e.mtime);
                i.closeSync(c);
                i.closeSync(l)
            }

            function onDir(e, t, n, i, s) {
                if (!t) return mkDirAndCopy(e, n, i, s);
                if (t && !t.isDirectory()) {
                    throw new Error(`Cannot overwrite non-directory '${i}' with directory '${n}'.`)
                }
                return copyDir(n, i, s)
            }

            function mkDirAndCopy(e, t, n, s) {
                i.mkdirSync(n);
                copyDir(t, n, s);
                return i.chmodSync(n, e.mode)
            }

            function copyDir(e, t, n) {
                i.readdirSync(e).forEach((i => copyDirItem(i, e, t, n)))
            }

            function copyDirItem(e, t, n, i) {
                const o = s.join(t, e);
                const a = s.join(n, e);
                const {destStat: c} = r.checkPathsSync(o, a, "copy");
                return startCopy(c, o, a, i)
            }

            function onLink(e, t, n, o) {
                let a = i.readlinkSync(t);
                if (o.dereference) {
                    a = s.resolve(process.cwd(), a)
                }
                if (!e) {
                    return i.symlinkSync(a, n)
                } else {
                    let e;
                    try {
                        e = i.readlinkSync(n)
                    } catch (e) {
                        if (e.code === "EINVAL" || e.code === "UNKNOWN") return i.symlinkSync(a, n);
                        throw e
                    }
                    if (o.dereference) {
                        e = s.resolve(process.cwd(), e)
                    }
                    if (r.isSrcSubdir(a, e)) {
                        throw new Error(`Cannot copy '${a}' to a subdirectory of itself, '${e}'.`)
                    }
                    if (i.statSync(n).isDirectory() && r.isSrcSubdir(e, a)) {
                        throw new Error(`Cannot overwrite '${e}' with '${a}'.`)
                    }
                    return copyLink(a, n)
                }
            }

            function copyLink(e, t) {
                i.unlinkSync(t);
                return i.symlinkSync(e, t)
            }

            e.exports = copySync
        }, 1344: (e, t, n) => {
            "use strict";
            e.exports = {copySync: n(675)}
        }, 7243: (e, t, n) => {
            "use strict";
            const i = n(4896);
            const s = n(6928);
            const o = n(2381).mkdirs;
            const a = n(4741).pathExists;
            const r = n(1178).utimesMillis;
            const c = n(7291);

            function copy(e, t, n, i) {
                if (typeof n === "function" && !i) {
                    i = n;
                    n = {}
                } else if (typeof n === "function") {
                    n = {filter: n}
                }
                i = i || function () {
                };
                n = n || {};
                n.clobber = "clobber" in n ? !!n.clobber : true;
                n.overwrite = "overwrite" in n ? !!n.overwrite : n.clobber;
                if (n.preserveTimestamps && process.arch === "ia32") {
                    console.warn(`fs-extra: Using the preserveTimestamps option in 32-bit node is not recommended;\n\n    see https://github.com/jprichardson/node-fs-extra/issues/269`)
                }
                c.checkPaths(e, t, "copy", ((s, o) => {
                    if (s) return i(s);
                    const {srcStat: a, destStat: r} = o;
                    c.checkParentPaths(e, a, t, "copy", (s => {
                        if (s) return i(s);
                        if (n.filter) return handleFilter(checkParentDir, r, e, t, n, i);
                        return checkParentDir(r, e, t, n, i)
                    }))
                }))
            }

            function checkParentDir(e, t, n, i, r) {
                const c = s.dirname(n);
                a(c, ((s, a) => {
                    if (s) return r(s);
                    if (a) return startCopy(e, t, n, i, r);
                    o(c, (s => {
                        if (s) return r(s);
                        return startCopy(e, t, n, i, r)
                    }))
                }))
            }

            function handleFilter(e, t, n, i, s, o) {
                Promise.resolve(s.filter(n, i)).then((a => {
                    if (a) return e(t, n, i, s, o);
                    return o()
                }), (e => o(e)))
            }

            function startCopy(e, t, n, i, s) {
                if (i.filter) return handleFilter(getStats, e, t, n, i, s);
                return getStats(e, t, n, i, s)
            }

            function getStats(e, t, n, s, o) {
                const a = s.dereference ? i.stat : i.lstat;
                a(t, ((i, a) => {
                    if (i) return o(i);
                    if (a.isDirectory()) return onDir(a, e, t, n, s, o); else if (a.isFile() || a.isCharacterDevice() || a.isBlockDevice()) return onFile(a, e, t, n, s, o); else if (a.isSymbolicLink()) return onLink(e, t, n, s, o)
                }))
            }

            function onFile(e, t, n, i, s, o) {
                if (!t) return copyFile(e, n, i, s, o);
                return mayCopyFile(e, n, i, s, o)
            }

            function mayCopyFile(e, t, n, s, o) {
                if (s.overwrite) {
                    i.unlink(n, (i => {
                        if (i) return o(i);
                        return copyFile(e, t, n, s, o)
                    }))
                } else if (s.errorOnExist) {
                    return o(new Error(`'${n}' already exists`))
                } else return o()
            }

            function copyFile(e, t, n, s, o) {
                if (typeof i.copyFile === "function") {
                    return i.copyFile(t, n, (t => {
                        if (t) return o(t);
                        return setDestModeAndTimestamps(e, n, s, o)
                    }))
                }
                return copyFileFallback(e, t, n, s, o)
            }

            function copyFileFallback(e, t, n, s, o) {
                const a = i.createReadStream(t);
                a.on("error", (e => o(e))).once("open", (() => {
                    const t = i.createWriteStream(n, {mode: e.mode});
                    t.on("error", (e => o(e))).on("open", (() => a.pipe(t))).once("close", (() => setDestModeAndTimestamps(e, n, s, o)))
                }))
            }

            function setDestModeAndTimestamps(e, t, n, s) {
                i.chmod(t, e.mode, (i => {
                    if (i) return s(i);
                    if (n.preserveTimestamps) {
                        return r(t, e.atime, e.mtime, s)
                    }
                    return s()
                }))
            }

            function onDir(e, t, n, i, s, o) {
                if (!t) return mkDirAndCopy(e, n, i, s, o);
                if (t && !t.isDirectory()) {
                    return o(new Error(`Cannot overwrite non-directory '${i}' with directory '${n}'.`))
                }
                return copyDir(n, i, s, o)
            }

            function mkDirAndCopy(e, t, n, s, o) {
                i.mkdir(n, (a => {
                    if (a) return o(a);
                    copyDir(t, n, s, (t => {
                        if (t) return o(t);
                        return i.chmod(n, e.mode, o)
                    }))
                }))
            }

            function copyDir(e, t, n, s) {
                i.readdir(e, ((i, o) => {
                    if (i) return s(i);
                    return copyDirItems(o, e, t, n, s)
                }))
            }

            function copyDirItems(e, t, n, i, s) {
                const o = e.pop();
                if (!o) return s();
                return copyDirItem(e, o, t, n, i, s)
            }

            function copyDirItem(e, t, n, i, o, a) {
                const r = s.join(n, t);
                const l = s.join(i, t);
                c.checkPaths(r, l, "copy", ((t, s) => {
                    if (t) return a(t);
                    const {destStat: c} = s;
                    startCopy(c, r, l, o, (t => {
                        if (t) return a(t);
                        return copyDirItems(e, n, i, o, a)
                    }))
                }))
            }

            function onLink(e, t, n, o, a) {
                i.readlink(t, ((t, r) => {
                    if (t) return a(t);
                    if (o.dereference) {
                        r = s.resolve(process.cwd(), r)
                    }
                    if (!e) {
                        return i.symlink(r, n, a)
                    } else {
                        i.readlink(n, ((t, l) => {
                            if (t) {
                                if (t.code === "EINVAL" || t.code === "UNKNOWN") return i.symlink(r, n, a);
                                return a(t)
                            }
                            if (o.dereference) {
                                l = s.resolve(process.cwd(), l)
                            }
                            if (c.isSrcSubdir(r, l)) {
                                return a(new Error(`Cannot copy '${r}' to a subdirectory of itself, '${l}'.`))
                            }
                            if (e.isDirectory() && c.isSrcSubdir(l, r)) {
                                return a(new Error(`Cannot overwrite '${l}' with '${r}'.`))
                            }
                            return copyLink(r, n, a)
                        }))
                    }
                }))
            }

            function copyLink(e, t, n) {
                i.unlink(t, (s => {
                    if (s) return n(s);
                    return i.symlink(e, t, n)
                }))
            }

            e.exports = copy
        }, 7496: (e, t, n) => {
            "use strict";
            const i = n(5745).S;
            e.exports = {copy: i(n(7243))}
        }, 2838: (e, t, n) => {
            "use strict";
            const i = n(5745).S;
            const s = n(4896);
            const o = n(6928);
            const a = n(2381);
            const r = n(7137);
            const c = i((function emptyDir(e, t) {
                t = t || function () {
                };
                s.readdir(e, ((n, i) => {
                    if (n) return a.mkdirs(e, t);
                    i = i.map((t => o.join(e, t)));
                    deleteItem();

                    function deleteItem() {
                        const e = i.pop();
                        if (!e) return t();
                        r.remove(e, (e => {
                            if (e) return t(e);
                            deleteItem()
                        }))
                    }
                }))
            }));

            function emptyDirSync(e) {
                let t;
                try {
                    t = s.readdirSync(e)
                } catch (t) {
                    return a.mkdirsSync(e)
                }
                t.forEach((t => {
                    t = o.join(e, t);
                    r.removeSync(t)
                }))
            }

            e.exports = {emptyDirSync: emptyDirSync, emptydirSync: emptyDirSync, emptyDir: c, emptydir: c}
        }, 4205: (e, t, n) => {
            "use strict";
            const i = n(5745).S;
            const s = n(6928);
            const o = n(4896);
            const a = n(2381);
            const r = n(4741).pathExists;

            function createFile(e, t) {
                function makeFile() {
                    o.writeFile(e, "", (e => {
                        if (e) return t(e);
                        t()
                    }))
                }

                o.stat(e, ((n, i) => {
                    if (!n && i.isFile()) return t();
                    const o = s.dirname(e);
                    r(o, ((e, n) => {
                        if (e) return t(e);
                        if (n) return makeFile();
                        a.mkdirs(o, (e => {
                            if (e) return t(e);
                            makeFile()
                        }))
                    }))
                }))
            }

            function createFileSync(e) {
                let t;
                try {
                    t = o.statSync(e)
                } catch (e) {
                }
                if (t && t.isFile()) return;
                const n = s.dirname(e);
                if (!o.existsSync(n)) {
                    a.mkdirsSync(n)
                }
                o.writeFileSync(e, "")
            }

            e.exports = {createFile: i(createFile), createFileSync: createFileSync}
        }, 831: (e, t, n) => {
            "use strict";
            const i = n(4205);
            const s = n(2427);
            const o = n(572);
            e.exports = {
                createFile: i.createFile,
                createFileSync: i.createFileSync,
                ensureFile: i.createFile,
                ensureFileSync: i.createFileSync,
                createLink: s.createLink,
                createLinkSync: s.createLinkSync,
                ensureLink: s.createLink,
                ensureLinkSync: s.createLinkSync,
                createSymlink: o.createSymlink,
                createSymlinkSync: o.createSymlinkSync,
                ensureSymlink: o.createSymlink,
                ensureSymlinkSync: o.createSymlinkSync
            }
        }, 2427: (e, t, n) => {
            "use strict";
            const i = n(5745).S;
            const s = n(6928);
            const o = n(4896);
            const a = n(2381);
            const r = n(4741).pathExists;

            function createLink(e, t, n) {
                function makeLink(e, t) {
                    o.link(e, t, (e => {
                        if (e) return n(e);
                        n(null)
                    }))
                }

                r(t, ((i, c) => {
                    if (i) return n(i);
                    if (c) return n(null);
                    o.lstat(e, (i => {
                        if (i) {
                            i.message = i.message.replace("lstat", "ensureLink");
                            return n(i)
                        }
                        const o = s.dirname(t);
                        r(o, ((i, s) => {
                            if (i) return n(i);
                            if (s) return makeLink(e, t);
                            a.mkdirs(o, (i => {
                                if (i) return n(i);
                                makeLink(e, t)
                            }))
                        }))
                    }))
                }))
            }

            function createLinkSync(e, t) {
                const n = o.existsSync(t);
                if (n) return undefined;
                try {
                    o.lstatSync(e)
                } catch (e) {
                    e.message = e.message.replace("lstat", "ensureLink");
                    throw e
                }
                const i = s.dirname(t);
                const r = o.existsSync(i);
                if (r) return o.linkSync(e, t);
                a.mkdirsSync(i);
                return o.linkSync(e, t)
            }

            e.exports = {createLink: i(createLink), createLinkSync: createLinkSync}
        }, 6541: (e, t, n) => {
            "use strict";
            const i = n(6928);
            const s = n(4896);
            const o = n(4741).pathExists;

            function symlinkPaths(e, t, n) {
                if (i.isAbsolute(e)) {
                    return s.lstat(e, (t => {
                        if (t) {
                            t.message = t.message.replace("lstat", "ensureSymlink");
                            return n(t)
                        }
                        return n(null, {toCwd: e, toDst: e})
                    }))
                } else {
                    const a = i.dirname(t);
                    const r = i.join(a, e);
                    return o(r, ((t, o) => {
                        if (t) return n(t);
                        if (o) {
                            return n(null, {toCwd: r, toDst: e})
                        } else {
                            return s.lstat(e, (t => {
                                if (t) {
                                    t.message = t.message.replace("lstat", "ensureSymlink");
                                    return n(t)
                                }
                                return n(null, {toCwd: e, toDst: i.relative(a, e)})
                            }))
                        }
                    }))
                }
            }

            function symlinkPathsSync(e, t) {
                let n;
                if (i.isAbsolute(e)) {
                    n = s.existsSync(e);
                    if (!n) throw new Error("absolute srcpath does not exist");
                    return {toCwd: e, toDst: e}
                } else {
                    const o = i.dirname(t);
                    const a = i.join(o, e);
                    n = s.existsSync(a);
                    if (n) {
                        return {toCwd: a, toDst: e}
                    } else {
                        n = s.existsSync(e);
                        if (!n) throw new Error("relative srcpath does not exist");
                        return {toCwd: e, toDst: i.relative(o, e)}
                    }
                }
            }

            e.exports = {symlinkPaths: symlinkPaths, symlinkPathsSync: symlinkPathsSync}
        }, 8369: (e, t, n) => {
            "use strict";
            const i = n(4896);

            function symlinkType(e, t, n) {
                n = typeof t === "function" ? t : n;
                t = typeof t === "function" ? false : t;
                if (t) return n(null, t);
                i.lstat(e, ((e, i) => {
                    if (e) return n(null, "file");
                    t = i && i.isDirectory() ? "dir" : "file";
                    n(null, t)
                }))
            }

            function symlinkTypeSync(e, t) {
                let n;
                if (t) return t;
                try {
                    n = i.lstatSync(e)
                } catch (e) {
                    return "file"
                }
                return n && n.isDirectory() ? "dir" : "file"
            }

            e.exports = {symlinkType: symlinkType, symlinkTypeSync: symlinkTypeSync}
        }, 572: (e, t, n) => {
            "use strict";
            const i = n(5745).S;
            const s = n(6928);
            const o = n(4896);
            const a = n(2381);
            const r = a.mkdirs;
            const c = a.mkdirsSync;
            const l = n(6541);
            const p = l.symlinkPaths;
            const u = l.symlinkPathsSync;
            const d = n(8369);
            const f = d.symlinkType;
            const m = d.symlinkTypeSync;
            const h = n(4741).pathExists;

            function createSymlink(e, t, n, i) {
                i = typeof n === "function" ? n : i;
                n = typeof n === "function" ? false : n;
                h(t, ((a, c) => {
                    if (a) return i(a);
                    if (c) return i(null);
                    p(e, t, ((a, c) => {
                        if (a) return i(a);
                        e = c.toDst;
                        f(c.toCwd, n, ((n, a) => {
                            if (n) return i(n);
                            const c = s.dirname(t);
                            h(c, ((n, s) => {
                                if (n) return i(n);
                                if (s) return o.symlink(e, t, a, i);
                                r(c, (n => {
                                    if (n) return i(n);
                                    o.symlink(e, t, a, i)
                                }))
                            }))
                        }))
                    }))
                }))
            }

            function createSymlinkSync(e, t, n) {
                const i = o.existsSync(t);
                if (i) return undefined;
                const a = u(e, t);
                e = a.toDst;
                n = m(a.toCwd, n);
                const r = s.dirname(t);
                const l = o.existsSync(r);
                if (l) return o.symlinkSync(e, t, n);
                c(r);
                return o.symlinkSync(e, t, n)
            }

            e.exports = {createSymlink: i(createSymlink), createSymlinkSync: createSymlinkSync}
        }, 758: (e, t, n) => {
            "use strict";
            const i = n(5745).S;
            const s = n(4896);
            const o = ["access", "appendFile", "chmod", "chown", "close", "copyFile", "fchmod", "fchown", "fdatasync", "fstat", "fsync", "ftruncate", "futimes", "lchown", "lchmod", "link", "lstat", "mkdir", "mkdtemp", "open", "readFile", "readdir", "readlink", "realpath", "rename", "rmdir", "stat", "symlink", "truncate", "unlink", "utimes", "writeFile"].filter((e => typeof s[e] === "function"));
            Object.keys(s).forEach((e => {
                if (e === "promises") {
                    return
                }
                t[e] = s[e]
            }));
            o.forEach((e => {
                t[e] = i(s[e])
            }));
            t.exists = function (e, t) {
                if (typeof t === "function") {
                    return s.exists(e, t)
                }
                return new Promise((t => s.exists(e, t)))
            };
            t.read = function (e, t, n, i, o, a) {
                if (typeof a === "function") {
                    return s.read(e, t, n, i, o, a)
                }
                return new Promise(((a, r) => {
                    s.read(e, t, n, i, o, ((e, t, n) => {
                        if (e) return r(e);
                        a({bytesRead: t, buffer: n})
                    }))
                }))
            };
            t.write = function (e, t, ...n) {
                if (typeof n[n.length - 1] === "function") {
                    return s.write(e, t, ...n)
                }
                return new Promise(((i, o) => {
                    s.write(e, t, ...n, ((e, t, n) => {
                        if (e) return o(e);
                        i({bytesWritten: t, buffer: n})
                    }))
                }))
            };
            if (typeof s.realpath.native === "function") {
                t.realpath.native = i(s.realpath.native)
            }
        }, 5700: (e, t, n) => {
            "use strict";
            e.exports = Object.assign({}, n(758), n(1344), n(7496), n(2838), n(831), n(2003), n(2381), n(6224), n(6824), n(8824), n(4741), n(7137));
            const i = n(9896);
            if (Object.getOwnPropertyDescriptor(i, "promises")) {
                Object.defineProperty(e.exports, "promises", {
                    get() {
                        return i.promises
                    }
                })
            }
        }, 2003: (e, t, n) => {
            "use strict";
            const i = n(5745).S;
            const s = n(627);
            s.outputJson = i(n(5421));
            s.outputJsonSync = n(7093);
            s.outputJSON = s.outputJson;
            s.outputJSONSync = s.outputJsonSync;
            s.writeJSON = s.writeJson;
            s.writeJSONSync = s.writeJsonSync;
            s.readJSON = s.readJson;
            s.readJSONSync = s.readJsonSync;
            e.exports = s
        }, 627: (e, t, n) => {
            "use strict";
            const i = n(5745).S;
            const s = n(9812);
            e.exports = {
                readJson: i(s.readFile),
                readJsonSync: s.readFileSync,
                writeJson: i(s.writeFile),
                writeJsonSync: s.writeFileSync
            }
        }, 7093: (e, t, n) => {
            "use strict";
            const i = n(4896);
            const s = n(6928);
            const o = n(2381);
            const a = n(627);

            function outputJsonSync(e, t, n) {
                const r = s.dirname(e);
                if (!i.existsSync(r)) {
                    o.mkdirsSync(r)
                }
                a.writeJsonSync(e, t, n)
            }

            e.exports = outputJsonSync
        }, 5421: (e, t, n) => {
            "use strict";
            const i = n(6928);
            const s = n(2381);
            const o = n(4741).pathExists;
            const a = n(627);

            function outputJson(e, t, n, r) {
                if (typeof n === "function") {
                    r = n;
                    n = {}
                }
                const c = i.dirname(e);
                o(c, ((i, o) => {
                    if (i) return r(i);
                    if (o) return a.writeJson(e, t, n, r);
                    s.mkdirs(c, (i => {
                        if (i) return r(i);
                        a.writeJson(e, t, n, r)
                    }))
                }))
            }

            e.exports = outputJson
        }, 2381: (e, t, n) => {
            "use strict";
            const i = n(5745).S;
            const s = i(n(6677));
            const o = n(8909);
            e.exports = {mkdirs: s, mkdirsSync: o, mkdirp: s, mkdirpSync: o, ensureDir: s, ensureDirSync: o}
        }, 8909: (e, t, n) => {
            "use strict";
            const i = n(4896);
            const s = n(6928);
            const o = n(2770).invalidWin32Path;
            const a = parseInt("0777", 8);

            function mkdirsSync(e, t, n) {
                if (!t || typeof t !== "object") {
                    t = {mode: t}
                }
                let r = t.mode;
                const c = t.fs || i;
                if (process.platform === "win32" && o(e)) {
                    const t = new Error(e + " contains invalid WIN32 path characters.");
                    t.code = "EINVAL";
                    throw t
                }
                if (r === undefined) {
                    r = a & ~process.umask()
                }
                if (!n) n = null;
                e = s.resolve(e);
                try {
                    c.mkdirSync(e, r);
                    n = n || e
                } catch (i) {
                    if (i.code === "ENOENT") {
                        if (s.dirname(e) === e) throw i;
                        n = mkdirsSync(s.dirname(e), t, n);
                        mkdirsSync(e, t, n)
                    } else {
                        let t;
                        try {
                            t = c.statSync(e)
                        } catch (e) {
                            throw i
                        }
                        if (!t.isDirectory()) throw i
                    }
                }
                return n
            }

            e.exports = mkdirsSync
        }, 6677: (e, t, n) => {
            "use strict";
            const i = n(4896);
            const s = n(6928);
            const o = n(2770).invalidWin32Path;
            const a = parseInt("0777", 8);

            function mkdirs(e, t, n, r) {
                if (typeof t === "function") {
                    n = t;
                    t = {}
                } else if (!t || typeof t !== "object") {
                    t = {mode: t}
                }
                if (process.platform === "win32" && o(e)) {
                    const t = new Error(e + " contains invalid WIN32 path characters.");
                    t.code = "EINVAL";
                    return n(t)
                }
                let c = t.mode;
                const l = t.fs || i;
                if (c === undefined) {
                    c = a & ~process.umask()
                }
                if (!r) r = null;
                n = n || function () {
                };
                e = s.resolve(e);
                l.mkdir(e, c, (i => {
                    if (!i) {
                        r = r || e;
                        return n(null, r)
                    }
                    switch (i.code) {
                        case"ENOENT":
                            if (s.dirname(e) === e) return n(i);
                            mkdirs(s.dirname(e), t, ((i, s) => {
                                if (i) n(i, s); else mkdirs(e, t, n, s)
                            }));
                            break;
                        default:
                            l.stat(e, ((e, t) => {
                                if (e || !t.isDirectory()) n(i, r); else n(null, r)
                            }));
                            break
                    }
                }))
            }

            e.exports = mkdirs
        }, 2770: (e, t, n) => {
            "use strict";
            const i = n(6928);

            function getRootPath(e) {
                e = i.normalize(i.resolve(e)).split(i.sep);
                if (e.length > 0) return e[0];
                return null
            }

            const s = /[<>:"|?*]/;

            function invalidWin32Path(e) {
                const t = getRootPath(e);
                e = e.replace(t, "");
                return s.test(e)
            }

            e.exports = {getRootPath: getRootPath, invalidWin32Path: invalidWin32Path}
        }, 6224: (e, t, n) => {
            "use strict";
            e.exports = {moveSync: n(5691)}
        }, 5691: (e, t, n) => {
            "use strict";
            const i = n(4896);
            const s = n(6928);
            const o = n(1344).copySync;
            const a = n(7137).removeSync;
            const r = n(2381).mkdirpSync;
            const c = n(7291);

            function moveSync(e, t, n) {
                n = n || {};
                const i = n.overwrite || n.clobber || false;
                const {srcStat: o} = c.checkPathsSync(e, t, "move");
                c.checkParentPathsSync(e, o, t, "move");
                r(s.dirname(t));
                return doRename(e, t, i)
            }

            function doRename(e, t, n) {
                if (n) {
                    a(t);
                    return rename(e, t, n)
                }
                if (i.existsSync(t)) throw new Error("dest already exists.");
                return rename(e, t, n)
            }

            function rename(e, t, n) {
                try {
                    i.renameSync(e, t)
                } catch (i) {
                    if (i.code !== "EXDEV") throw i;
                    return moveAcrossDevice(e, t, n)
                }
            }

            function moveAcrossDevice(e, t, n) {
                const i = {overwrite: n, errorOnExist: true};
                o(e, t, i);
                return a(e)
            }

            e.exports = moveSync
        }, 6824: (e, t, n) => {
            "use strict";
            const i = n(5745).S;
            e.exports = {move: i(n(2915))}
        }, 2915: (e, t, n) => {
            "use strict";
            const i = n(4896);
            const s = n(6928);
            const o = n(7496).copy;
            const a = n(7137).remove;
            const r = n(2381).mkdirp;
            const c = n(4741).pathExists;
            const l = n(7291);

            function move(e, t, n, i) {
                if (typeof n === "function") {
                    i = n;
                    n = {}
                }
                const o = n.overwrite || n.clobber || false;
                l.checkPaths(e, t, "move", ((n, a) => {
                    if (n) return i(n);
                    const {srcStat: c} = a;
                    l.checkParentPaths(e, c, t, "move", (n => {
                        if (n) return i(n);
                        r(s.dirname(t), (n => {
                            if (n) return i(n);
                            return doRename(e, t, o, i)
                        }))
                    }))
                }))
            }

            function doRename(e, t, n, i) {
                if (n) {
                    return a(t, (s => {
                        if (s) return i(s);
                        return rename(e, t, n, i)
                    }))
                }
                c(t, ((s, o) => {
                    if (s) return i(s);
                    if (o) return i(new Error("dest already exists."));
                    return rename(e, t, n, i)
                }))
            }

            function rename(e, t, n, s) {
                i.rename(e, t, (i => {
                    if (!i) return s();
                    if (i.code !== "EXDEV") return s(i);
                    return moveAcrossDevice(e, t, n, s)
                }))
            }

            function moveAcrossDevice(e, t, n, i) {
                const s = {overwrite: n, errorOnExist: true};
                o(e, t, s, (t => {
                    if (t) return i(t);
                    return a(e, i)
                }))
            }

            e.exports = move
        }, 8824: (e, t, n) => {
            "use strict";
            const i = n(5745).S;
            const s = n(4896);
            const o = n(6928);
            const a = n(2381);
            const r = n(4741).pathExists;

            function outputFile(e, t, n, i) {
                if (typeof n === "function") {
                    i = n;
                    n = "utf8"
                }
                const c = o.dirname(e);
                r(c, ((o, r) => {
                    if (o) return i(o);
                    if (r) return s.writeFile(e, t, n, i);
                    a.mkdirs(c, (o => {
                        if (o) return i(o);
                        s.writeFile(e, t, n, i)
                    }))
                }))
            }

            function outputFileSync(e, ...t) {
                const n = o.dirname(e);
                if (s.existsSync(n)) {
                    return s.writeFileSync(e, ...t)
                }
                a.mkdirsSync(n);
                s.writeFileSync(e, ...t)
            }

            e.exports = {outputFile: i(outputFile), outputFileSync: outputFileSync}
        }, 4741: (e, t, n) => {
            "use strict";
            const i = n(5745).z;
            const s = n(758);

            function pathExists(e) {
                return s.access(e).then((() => true)).catch((() => false))
            }

            e.exports = {pathExists: i(pathExists), pathExistsSync: s.existsSync}
        }, 7137: (e, t, n) => {
            "use strict";
            const i = n(5745).S;
            const s = n(5180);
            e.exports = {remove: i(s), removeSync: s.sync}
        }, 5180: (e, t, n) => {
            "use strict";
            const i = n(4896);
            const s = n(6928);
            const o = n(2613);
            const a = process.platform === "win32";

            function defaults(e) {
                const t = ["unlink", "chmod", "stat", "lstat", "rmdir", "readdir"];
                t.forEach((t => {
                    e[t] = e[t] || i[t];
                    t = t + "Sync";
                    e[t] = e[t] || i[t]
                }));
                e.maxBusyTries = e.maxBusyTries || 3
            }

            function rimraf(e, t, n) {
                let i = 0;
                if (typeof t === "function") {
                    n = t;
                    t = {}
                }
                o(e, "rimraf: missing path");
                o.strictEqual(typeof e, "string", "rimraf: path should be a string");
                o.strictEqual(typeof n, "function", "rimraf: callback function required");
                o(t, "rimraf: invalid options argument provided");
                o.strictEqual(typeof t, "object", "rimraf: options should be object");
                defaults(t);
                rimraf_(e, t, (function CB(s) {
                    if (s) {
                        if ((s.code === "EBUSY" || s.code === "ENOTEMPTY" || s.code === "EPERM") && i < t.maxBusyTries) {
                            i++;
                            const n = i * 100;
                            return setTimeout((() => rimraf_(e, t, CB)), n)
                        }
                        if (s.code === "ENOENT") s = null
                    }
                    n(s)
                }))
            }

            function rimraf_(e, t, n) {
                o(e);
                o(t);
                o(typeof n === "function");
                t.lstat(e, ((i, s) => {
                    if (i && i.code === "ENOENT") {
                        return n(null)
                    }
                    if (i && i.code === "EPERM" && a) {
                        return fixWinEPERM(e, t, i, n)
                    }
                    if (s && s.isDirectory()) {
                        return rmdir(e, t, i, n)
                    }
                    t.unlink(e, (i => {
                        if (i) {
                            if (i.code === "ENOENT") {
                                return n(null)
                            }
                            if (i.code === "EPERM") {
                                return a ? fixWinEPERM(e, t, i, n) : rmdir(e, t, i, n)
                            }
                            if (i.code === "EISDIR") {
                                return rmdir(e, t, i, n)
                            }
                        }
                        return n(i)
                    }))
                }))
            }

            function fixWinEPERM(e, t, n, i) {
                o(e);
                o(t);
                o(typeof i === "function");
                if (n) {
                    o(n instanceof Error)
                }
                t.chmod(e, 438, (s => {
                    if (s) {
                        i(s.code === "ENOENT" ? null : n)
                    } else {
                        t.stat(e, ((s, o) => {
                            if (s) {
                                i(s.code === "ENOENT" ? null : n)
                            } else if (o.isDirectory()) {
                                rmdir(e, t, n, i)
                            } else {
                                t.unlink(e, i)
                            }
                        }))
                    }
                }))
            }

            function fixWinEPERMSync(e, t, n) {
                let i;
                o(e);
                o(t);
                if (n) {
                    o(n instanceof Error)
                }
                try {
                    t.chmodSync(e, 438)
                } catch (e) {
                    if (e.code === "ENOENT") {
                        return
                    } else {
                        throw n
                    }
                }
                try {
                    i = t.statSync(e)
                } catch (e) {
                    if (e.code === "ENOENT") {
                        return
                    } else {
                        throw n
                    }
                }
                if (i.isDirectory()) {
                    rmdirSync(e, t, n)
                } else {
                    t.unlinkSync(e)
                }
            }

            function rmdir(e, t, n, i) {
                o(e);
                o(t);
                if (n) {
                    o(n instanceof Error)
                }
                o(typeof i === "function");
                t.rmdir(e, (s => {
                    if (s && (s.code === "ENOTEMPTY" || s.code === "EEXIST" || s.code === "EPERM")) {
                        rmkids(e, t, i)
                    } else if (s && s.code === "ENOTDIR") {
                        i(n)
                    } else {
                        i(s)
                    }
                }))
            }

            function rmkids(e, t, n) {
                o(e);
                o(t);
                o(typeof n === "function");
                t.readdir(e, ((i, o) => {
                    if (i) return n(i);
                    let a = o.length;
                    let r;
                    if (a === 0) return t.rmdir(e, n);
                    o.forEach((i => {
                        rimraf(s.join(e, i), t, (i => {
                            if (r) {
                                return
                            }
                            if (i) return n(r = i);
                            if (--a === 0) {
                                t.rmdir(e, n)
                            }
                        }))
                    }))
                }))
            }

            function rimrafSync(e, t) {
                let n;
                t = t || {};
                defaults(t);
                o(e, "rimraf: missing path");
                o.strictEqual(typeof e, "string", "rimraf: path should be a string");
                o(t, "rimraf: missing options");
                o.strictEqual(typeof t, "object", "rimraf: options should be object");
                try {
                    n = t.lstatSync(e)
                } catch (n) {
                    if (n.code === "ENOENT") {
                        return
                    }
                    if (n.code === "EPERM" && a) {
                        fixWinEPERMSync(e, t, n)
                    }
                }
                try {
                    if (n && n.isDirectory()) {
                        rmdirSync(e, t, null)
                    } else {
                        t.unlinkSync(e)
                    }
                } catch (n) {
                    if (n.code === "ENOENT") {
                        return
                    } else if (n.code === "EPERM") {
                        return a ? fixWinEPERMSync(e, t, n) : rmdirSync(e, t, n)
                    } else if (n.code !== "EISDIR") {
                        throw n
                    }
                    rmdirSync(e, t, n)
                }
            }

            function rmdirSync(e, t, n) {
                o(e);
                o(t);
                if (n) {
                    o(n instanceof Error)
                }
                try {
                    t.rmdirSync(e)
                } catch (i) {
                    if (i.code === "ENOTDIR") {
                        throw n
                    } else if (i.code === "ENOTEMPTY" || i.code === "EEXIST" || i.code === "EPERM") {
                        rmkidsSync(e, t)
                    } else if (i.code !== "ENOENT") {
                        throw i
                    }
                }
            }

            function rmkidsSync(e, t) {
                o(e);
                o(t);
                t.readdirSync(e).forEach((n => rimrafSync(s.join(e, n), t)));
                if (a) {
                    const n = Date.now();
                    do {
                        try {
                            const n = t.rmdirSync(e, t);
                            return n
                        } catch (e) {
                        }
                    } while (Date.now() - n < 500)
                } else {
                    const n = t.rmdirSync(e, t);
                    return n
                }
            }

            e.exports = rimraf;
            rimraf.sync = rimrafSync
        }, 647: e => {
            "use strict";
            e.exports = function (e) {
                if (typeof Buffer.allocUnsafe === "function") {
                    try {
                        return Buffer.allocUnsafe(e)
                    } catch (t) {
                        return new Buffer(e)
                    }
                }
                return new Buffer(e)
            }
        }, 7291: (e, t, n) => {
            "use strict";
            const i = n(4896);
            const s = n(6928);
            const o = 10;
            const a = 5;
            const r = 0;
            const c = process.versions.node.split(".");
            const l = Number.parseInt(c[0], 10);
            const p = Number.parseInt(c[1], 10);
            const u = Number.parseInt(c[2], 10);

            function nodeSupportsBigInt() {
                if (l > o) {
                    return true
                } else if (l === o) {
                    if (p > a) {
                        return true
                    } else if (p === a) {
                        if (u >= r) {
                            return true
                        }
                    }
                }
                return false
            }

            function getStats(e, t, n) {
                if (nodeSupportsBigInt()) {
                    i.stat(e, {bigint: true}, ((e, s) => {
                        if (e) return n(e);
                        i.stat(t, {bigint: true}, ((e, t) => {
                            if (e) {
                                if (e.code === "ENOENT") return n(null, {srcStat: s, destStat: null});
                                return n(e)
                            }
                            return n(null, {srcStat: s, destStat: t})
                        }))
                    }))
                } else {
                    i.stat(e, ((e, s) => {
                        if (e) return n(e);
                        i.stat(t, ((e, t) => {
                            if (e) {
                                if (e.code === "ENOENT") return n(null, {srcStat: s, destStat: null});
                                return n(e)
                            }
                            return n(null, {srcStat: s, destStat: t})
                        }))
                    }))
                }
            }

            function getStatsSync(e, t) {
                let n, s;
                if (nodeSupportsBigInt()) {
                    n = i.statSync(e, {bigint: true})
                } else {
                    n = i.statSync(e)
                }
                try {
                    if (nodeSupportsBigInt()) {
                        s = i.statSync(t, {bigint: true})
                    } else {
                        s = i.statSync(t)
                    }
                } catch (e) {
                    if (e.code === "ENOENT") return {srcStat: n, destStat: null};
                    throw e
                }
                return {srcStat: n, destStat: s}
            }

            function checkPaths(e, t, n, i) {
                getStats(e, t, ((s, o) => {
                    if (s) return i(s);
                    const {srcStat: a, destStat: r} = o;
                    if (r && r.ino && r.dev && r.ino === a.ino && r.dev === a.dev) {
                        return i(new Error("Source and destination must not be the same."))
                    }
                    if (a.isDirectory() && isSrcSubdir(e, t)) {
                        return i(new Error(errMsg(e, t, n)))
                    }
                    return i(null, {srcStat: a, destStat: r})
                }))
            }

            function checkPathsSync(e, t, n) {
                const {srcStat: i, destStat: s} = getStatsSync(e, t);
                if (s && s.ino && s.dev && s.ino === i.ino && s.dev === i.dev) {
                    throw new Error("Source and destination must not be the same.")
                }
                if (i.isDirectory() && isSrcSubdir(e, t)) {
                    throw new Error(errMsg(e, t, n))
                }
                return {srcStat: i, destStat: s}
            }

            function checkParentPaths(e, t, n, o, a) {
                const r = s.resolve(s.dirname(e));
                const c = s.resolve(s.dirname(n));
                if (c === r || c === s.parse(c).root) return a();
                if (nodeSupportsBigInt()) {
                    i.stat(c, {bigint: true}, ((i, s) => {
                        if (i) {
                            if (i.code === "ENOENT") return a();
                            return a(i)
                        }
                        if (s.ino && s.dev && s.ino === t.ino && s.dev === t.dev) {
                            return a(new Error(errMsg(e, n, o)))
                        }
                        return checkParentPaths(e, t, c, o, a)
                    }))
                } else {
                    i.stat(c, ((i, s) => {
                        if (i) {
                            if (i.code === "ENOENT") return a();
                            return a(i)
                        }
                        if (s.ino && s.dev && s.ino === t.ino && s.dev === t.dev) {
                            return a(new Error(errMsg(e, n, o)))
                        }
                        return checkParentPaths(e, t, c, o, a)
                    }))
                }
            }

            function checkParentPathsSync(e, t, n, o) {
                const a = s.resolve(s.dirname(e));
                const r = s.resolve(s.dirname(n));
                if (r === a || r === s.parse(r).root) return;
                let c;
                try {
                    if (nodeSupportsBigInt()) {
                        c = i.statSync(r, {bigint: true})
                    } else {
                        c = i.statSync(r)
                    }
                } catch (e) {
                    if (e.code === "ENOENT") return;
                    throw e
                }
                if (c.ino && c.dev && c.ino === t.ino && c.dev === t.dev) {
                    throw new Error(errMsg(e, n, o))
                }
                return checkParentPathsSync(e, t, r, o)
            }

            function isSrcSubdir(e, t) {
                const n = s.resolve(e).split(s.sep).filter((e => e));
                const i = s.resolve(t).split(s.sep).filter((e => e));
                return n.reduce(((e, t, n) => e && i[n] === t), true)
            }

            function errMsg(e, t, n) {
                return `Cannot ${n} '${e}' to a subdirectory of itself, '${t}'.`
            }

            e.exports = {
                checkPaths: checkPaths,
                checkPathsSync: checkPathsSync,
                checkParentPaths: checkParentPaths,
                checkParentPathsSync: checkParentPathsSync,
                isSrcSubdir: isSrcSubdir
            }
        }, 1178: (e, t, n) => {
            "use strict";
            const i = n(4896);
            const s = n(857);
            const o = n(6928);

            function hasMillisResSync() {
                let e = o.join("millis-test-sync" + Date.now().toString() + Math.random().toString().slice(2));
                e = o.join(s.tmpdir(), e);
                const t = new Date(1435410243862);
                i.writeFileSync(e, "https://github.com/jprichardson/node-fs-extra/pull/141");
                const n = i.openSync(e, "r+");
                i.futimesSync(n, t, t);
                i.closeSync(n);
                return i.statSync(e).mtime > 1435410243e3
            }

            function hasMillisRes(e) {
                let t = o.join("millis-test" + Date.now().toString() + Math.random().toString().slice(2));
                t = o.join(s.tmpdir(), t);
                const n = new Date(1435410243862);
                i.writeFile(t, "https://github.com/jprichardson/node-fs-extra/pull/141", (s => {
                    if (s) return e(s);
                    i.open(t, "r+", ((s, o) => {
                        if (s) return e(s);
                        i.futimes(o, n, n, (n => {
                            if (n) return e(n);
                            i.close(o, (n => {
                                if (n) return e(n);
                                i.stat(t, ((t, n) => {
                                    if (t) return e(t);
                                    e(null, n.mtime > 1435410243e3)
                                }))
                            }))
                        }))
                    }))
                }))
            }

            function timeRemoveMillis(e) {
                if (typeof e === "number") {
                    return Math.floor(e / 1e3) * 1e3
                } else if (e instanceof Date) {
                    return new Date(Math.floor(e.getTime() / 1e3) * 1e3)
                } else {
                    throw new Error("fs-extra: timeRemoveMillis() unknown parameter type")
                }
            }

            function utimesMillis(e, t, n, s) {
                i.open(e, "r+", ((e, o) => {
                    if (e) return s(e);
                    i.futimes(o, t, n, (e => {
                        i.close(o, (t => {
                            if (s) s(e || t)
                        }))
                    }))
                }))
            }

            function utimesMillisSync(e, t, n) {
                const s = i.openSync(e, "r+");
                i.futimesSync(s, t, n);
                return i.closeSync(s)
            }

            e.exports = {
                hasMillisRes: hasMillisRes,
                hasMillisResSync: hasMillisResSync,
                timeRemoveMillis: timeRemoveMillis,
                utimesMillis: utimesMillis,
                utimesMillisSync: utimesMillisSync
            }
        }, 9812: (e, t, n) => {
            var i;
            try {
                i = n(4896)
            } catch (e) {
                i = n(9896)
            }

            function readFile(e, t, n) {
                if (n == null) {
                    n = t;
                    t = {}
                }
                if (typeof t === "string") {
                    t = {encoding: t}
                }
                t = t || {};
                var s = t.fs || i;
                var o = true;
                if ("throws" in t) {
                    o = t.throws
                }
                s.readFile(e, t, (function (i, s) {
                    if (i) return n(i);
                    s = stripBom(s);
                    var a;
                    try {
                        a = JSON.parse(s, t ? t.reviver : null)
                    } catch (t) {
                        if (o) {
                            t.message = e + ": " + t.message;
                            return n(t)
                        } else {
                            return n(null, null)
                        }
                    }
                    n(null, a)
                }))
            }

            function readFileSync(e, t) {
                t = t || {};
                if (typeof t === "string") {
                    t = {encoding: t}
                }
                var n = t.fs || i;
                var s = true;
                if ("throws" in t) {
                    s = t.throws
                }
                try {
                    var o = n.readFileSync(e, t);
                    o = stripBom(o);
                    return JSON.parse(o, t.reviver)
                } catch (t) {
                    if (s) {
                        t.message = e + ": " + t.message;
                        throw t
                    } else {
                        return null
                    }
                }
            }

            function stringify(e, t) {
                var n;
                var i = "\n";
                if (typeof t === "object" && t !== null) {
                    if (t.spaces) {
                        n = t.spaces
                    }
                    if (t.EOL) {
                        i = t.EOL
                    }
                }
                var s = JSON.stringify(e, t ? t.replacer : null, n);
                return s.replace(/\n/g, i) + i
            }

            function writeFile(e, t, n, s) {
                if (s == null) {
                    s = n;
                    n = {}
                }
                n = n || {};
                var o = n.fs || i;
                var a = "";
                try {
                    a = stringify(t, n)
                } catch (e) {
                    if (s) s(e, null);
                    return
                }
                o.writeFile(e, a, n, s)
            }

            function writeFileSync(e, t, n) {
                n = n || {};
                var s = n.fs || i;
                var o = stringify(t, n);
                return s.writeFileSync(e, o, n)
            }

            function stripBom(e) {
                if (Buffer.isBuffer(e)) e = e.toString("utf8");
                e = e.replace(/^\uFEFF/, "");
                return e
            }

            var s = {
                readFile: readFile,
                readFileSync: readFileSync,
                writeFile: writeFile,
                writeFileSync: writeFileSync
            };
            e.exports = s
        }, 5745: (e, t) => {
            "use strict";
            t.S = function (e) {
                return Object.defineProperty((function () {
                    if (typeof arguments[arguments.length - 1] === "function") e.apply(this, arguments); else {
                        return new Promise(((t, n) => {
                            arguments[arguments.length] = (e, i) => {
                                if (e) return n(e);
                                t(i)
                            };
                            arguments.length++;
                            e.apply(this, arguments)
                        }))
                    }
                }), "name", {value: e.name})
            };
            t.z = function (e) {
                return Object.defineProperty((function () {
                    const t = arguments[arguments.length - 1];
                    if (typeof t !== "function") return e.apply(this, arguments); else e.apply(this, arguments).then((e => t(null, e)), t)
                }), "name", {value: e.name})
            }
        }, 3018: (e, t, n) => {
            "use strict";
            const i = n(5033);
            i.createWebSocketStream = n(5820);
            i.Server = n(3985);
            i.Receiver = n(4413);
            i.Sender = n(5693);
            i.WebSocket = i;
            i.WebSocketServer = i.Server;
            e.exports = i
        }, 6523: (e, t, n) => {
            "use strict";
            const {EMPTY_BUFFER: i} = n(8031);
            const s = Buffer[Symbol.species];

            function concat(e, t) {
                if (e.length === 0) return i;
                if (e.length === 1) return e[0];
                const n = Buffer.allocUnsafe(t);
                let o = 0;
                for (let t = 0; t < e.length; t++) {
                    const i = e[t];
                    n.set(i, o);
                    o += i.length
                }
                if (o < t) {
                    return new s(n.buffer, n.byteOffset, o)
                }
                return n
            }

            function _mask(e, t, n, i, s) {
                for (let o = 0; o < s; o++) {
                    n[i + o] = e[o] ^ t[o & 3]
                }
            }

            function _unmask(e, t) {
                for (let n = 0; n < e.length; n++) {
                    e[n] ^= t[n & 3]
                }
            }

            function toArrayBuffer(e) {
                if (e.length === e.buffer.byteLength) {
                    return e.buffer
                }
                return e.buffer.slice(e.byteOffset, e.byteOffset + e.length)
            }

            function toBuffer(e) {
                toBuffer.readOnly = true;
                if (Buffer.isBuffer(e)) return e;
                let t;
                if (e instanceof ArrayBuffer) {
                    t = new s(e)
                } else if (ArrayBuffer.isView(e)) {
                    t = new s(e.buffer, e.byteOffset, e.byteLength)
                } else {
                    t = Buffer.from(e);
                    toBuffer.readOnly = false
                }
                return t
            }

            e.exports = {
                concat: concat,
                mask: _mask,
                toArrayBuffer: toArrayBuffer,
                toBuffer: toBuffer,
                unmask: _unmask
            };
            if (!process.env.WS_NO_BUFFER_UTIL) {
                try {
                    const t = n(6687);
                    e.exports.mask = function (e, n, i, s, o) {
                        if (o < 48) _mask(e, n, i, s, o); else t.mask(e, n, i, s, o)
                    };
                    e.exports.unmask = function (e, n) {
                        if (e.length < 32) _unmask(e, n); else t.unmask(e, n)
                    }
                } catch (e) {
                }
            }
        }, 8031: e => {
            "use strict";
            const t = ["nodebuffer", "arraybuffer", "fragments"];
            const n = typeof Blob !== "undefined";
            if (n) t.push("blob");
            e.exports = {
                BINARY_TYPES: t,
                EMPTY_BUFFER: Buffer.alloc(0),
                GUID: "258EAFA5-E914-47DA-95CA-C5AB0DC85B11",
                hasBlob: n,
                kForOnEventAttribute: Symbol("kIsForOnEventAttribute"),
                kListener: Symbol("kListener"),
                kStatusCode: Symbol("status-code"),
                kWebSocket: Symbol("websocket"),
                NOOP: () => {
                }
            }
        }, 8666: (e, t, n) => {
            "use strict";
            const {kForOnEventAttribute: i, kListener: s} = n(8031);
            const o = Symbol("kCode");
            const a = Symbol("kData");
            const r = Symbol("kError");
            const c = Symbol("kMessage");
            const l = Symbol("kReason");
            const p = Symbol("kTarget");
            const u = Symbol("kType");
            const d = Symbol("kWasClean");

            class Event {
                constructor(e) {
                    this[p] = null;
                    this[u] = e
                }

                get target() {
                    return this[p]
                }

                get type() {
                    return this[u]
                }
            }

            Object.defineProperty(Event.prototype, "target", {enumerable: true});
            Object.defineProperty(Event.prototype, "type", {enumerable: true});

            class CloseEvent extends Event {
                constructor(e, t = {}) {
                    super(e);
                    this[o] = t.code === undefined ? 0 : t.code;
                    this[l] = t.reason === undefined ? "" : t.reason;
                    this[d] = t.wasClean === undefined ? false : t.wasClean
                }

                get code() {
                    return this[o]
                }

                get reason() {
                    return this[l]
                }

                get wasClean() {
                    return this[d]
                }
            }

            Object.defineProperty(CloseEvent.prototype, "code", {enumerable: true});
            Object.defineProperty(CloseEvent.prototype, "reason", {enumerable: true});
            Object.defineProperty(CloseEvent.prototype, "wasClean", {enumerable: true});

            class ErrorEvent extends Event {
                constructor(e, t = {}) {
                    super(e);
                    this[r] = t.error === undefined ? null : t.error;
                    this[c] = t.message === undefined ? "" : t.message
                }

                get error() {
                    return this[r]
                }

                get message() {
                    return this[c]
                }
            }

            Object.defineProperty(ErrorEvent.prototype, "error", {enumerable: true});
            Object.defineProperty(ErrorEvent.prototype, "message", {enumerable: true});

            class MessageEvent extends Event {
                constructor(e, t = {}) {
                    super(e);
                    this[a] = t.data === undefined ? null : t.data
                }

                get data() {
                    return this[a]
                }
            }

            Object.defineProperty(MessageEvent.prototype, "data", {enumerable: true});
            const f = {
                addEventListener(e, t, n = {}) {
                    for (const o of this.listeners(e)) {
                        if (!n[i] && o[s] === t && !o[i]) {
                            return
                        }
                    }
                    let o;
                    if (e === "message") {
                        o = function onMessage(e, n) {
                            const i = new MessageEvent("message", {data: n ? e : e.toString()});
                            i[p] = this;
                            callListener(t, this, i)
                        }
                    } else if (e === "close") {
                        o = function onClose(e, n) {
                            const i = new CloseEvent("close", {
                                code: e,
                                reason: n.toString(),
                                wasClean: this._closeFrameReceived && this._closeFrameSent
                            });
                            i[p] = this;
                            callListener(t, this, i)
                        }
                    } else if (e === "error") {
                        o = function onError(e) {
                            const n = new ErrorEvent("error", {error: e, message: e.message});
                            n[p] = this;
                            callListener(t, this, n)
                        }
                    } else if (e === "open") {
                        o = function onOpen() {
                            const e = new Event("open");
                            e[p] = this;
                            callListener(t, this, e)
                        }
                    } else {
                        return
                    }
                    o[i] = !!n[i];
                    o[s] = t;
                    if (n.once) {
                        this.once(e, o)
                    } else {
                        this.on(e, o)
                    }
                }, removeEventListener(e, t) {
                    for (const n of this.listeners(e)) {
                        if (n[s] === t && !n[i]) {
                            this.removeListener(e, n);
                            break
                        }
                    }
                }
            };
            e.exports = {
                CloseEvent: CloseEvent,
                ErrorEvent: ErrorEvent,
                Event: Event,
                EventTarget: f,
                MessageEvent: MessageEvent
            };

            function callListener(e, t, n) {
                if (typeof e === "object" && e.handleEvent) {
                    e.handleEvent.call(e, n)
                } else {
                    e.call(t, n)
                }
            }
        }, 247: (e, t, n) => {
            "use strict";
            const {tokenChars: i} = n(8631);

            function push(e, t, n) {
                if (e[t] === undefined) e[t] = [n]; else e[t].push(n)
            }

            function parse(e) {
                const t = Object.create(null);
                let n = Object.create(null);
                let s = false;
                let o = false;
                let a = false;
                let r;
                let c;
                let l = -1;
                let p = -1;
                let u = -1;
                let d = 0;
                for (; d < e.length; d++) {
                    p = e.charCodeAt(d);
                    if (r === undefined) {
                        if (u === -1 && i[p] === 1) {
                            if (l === -1) l = d
                        } else if (d !== 0 && (p === 32 || p === 9)) {
                            if (u === -1 && l !== -1) u = d
                        } else if (p === 59 || p === 44) {
                            if (l === -1) {
                                throw new SyntaxError(`Unexpected character at index ${d}`)
                            }
                            if (u === -1) u = d;
                            const i = e.slice(l, u);
                            if (p === 44) {
                                push(t, i, n);
                                n = Object.create(null)
                            } else {
                                r = i
                            }
                            l = u = -1
                        } else {
                            throw new SyntaxError(`Unexpected character at index ${d}`)
                        }
                    } else if (c === undefined) {
                        if (u === -1 && i[p] === 1) {
                            if (l === -1) l = d
                        } else if (p === 32 || p === 9) {
                            if (u === -1 && l !== -1) u = d
                        } else if (p === 59 || p === 44) {
                            if (l === -1) {
                                throw new SyntaxError(`Unexpected character at index ${d}`)
                            }
                            if (u === -1) u = d;
                            push(n, e.slice(l, u), true);
                            if (p === 44) {
                                push(t, r, n);
                                n = Object.create(null);
                                r = undefined
                            }
                            l = u = -1
                        } else if (p === 61 && l !== -1 && u === -1) {
                            c = e.slice(l, d);
                            l = u = -1
                        } else {
                            throw new SyntaxError(`Unexpected character at index ${d}`)
                        }
                    } else {
                        if (o) {
                            if (i[p] !== 1) {
                                throw new SyntaxError(`Unexpected character at index ${d}`)
                            }
                            if (l === -1) l = d; else if (!s) s = true;
                            o = false
                        } else if (a) {
                            if (i[p] === 1) {
                                if (l === -1) l = d
                            } else if (p === 34 && l !== -1) {
                                a = false;
                                u = d
                            } else if (p === 92) {
                                o = true
                            } else {
                                throw new SyntaxError(`Unexpected character at index ${d}`)
                            }
                        } else if (p === 34 && e.charCodeAt(d - 1) === 61) {
                            a = true
                        } else if (u === -1 && i[p] === 1) {
                            if (l === -1) l = d
                        } else if (l !== -1 && (p === 32 || p === 9)) {
                            if (u === -1) u = d
                        } else if (p === 59 || p === 44) {
                            if (l === -1) {
                                throw new SyntaxError(`Unexpected character at index ${d}`)
                            }
                            if (u === -1) u = d;
                            let i = e.slice(l, u);
                            if (s) {
                                i = i.replace(/\\/g, "");
                                s = false
                            }
                            push(n, c, i);
                            if (p === 44) {
                                push(t, r, n);
                                n = Object.create(null);
                                r = undefined
                            }
                            c = undefined;
                            l = u = -1
                        } else {
                            throw new SyntaxError(`Unexpected character at index ${d}`)
                        }
                    }
                }
                if (l === -1 || a || p === 32 || p === 9) {
                    throw new SyntaxError("Unexpected end of input")
                }
                if (u === -1) u = d;
                const f = e.slice(l, u);
                if (r === undefined) {
                    push(t, f, n)
                } else {
                    if (c === undefined) {
                        push(n, f, true)
                    } else if (s) {
                        push(n, c, f.replace(/\\/g, ""))
                    } else {
                        push(n, c, f)
                    }
                    push(t, r, n)
                }
                return t
            }

            function format(e) {
                return Object.keys(e).map((t => {
                    let n = e[t];
                    if (!Array.isArray(n)) n = [n];
                    return n.map((e => [t].concat(Object.keys(e).map((t => {
                        let n = e[t];
                        if (!Array.isArray(n)) n = [n];
                        return n.map((e => e === true ? t : `${t}=${e}`)).join("; ")
                    }))).join("; "))).join(", ")
                })).join(", ")
            }

            e.exports = {format: format, parse: parse}
        }, 6078: e => {
            "use strict";
            const t = Symbol("kDone");
            const n = Symbol("kRun");

            class Limiter {
                constructor(e) {
                    this[t] = () => {
                        this.pending--;
                        this[n]()
                    };
                    this.concurrency = e || Infinity;
                    this.jobs = [];
                    this.pending = 0
                }

                add(e) {
                    this.jobs.push(e);
                    this[n]()
                }

                [n]() {
                    if (this.pending === this.concurrency) return;
                    if (this.jobs.length) {
                        const e = this.jobs.shift();
                        this.pending++;
                        e(this[t])
                    }
                }
            }

            e.exports = Limiter
        }, 4536: (e, t, n) => {
            "use strict";
            const i = n(3106);
            const s = n(6523);
            const o = n(6078);
            const {kStatusCode: a} = n(8031);
            const r = Buffer[Symbol.species];
            const c = Buffer.from([0, 0, 255, 255]);
            const l = Symbol("permessage-deflate");
            const p = Symbol("total-length");
            const u = Symbol("callback");
            const d = Symbol("buffers");
            const f = Symbol("error");
            let m;

            class PerMessageDeflate {
                constructor(e, t, n) {
                    this._maxPayload = n | 0;
                    this._options = e || {};
                    this._threshold = this._options.threshold !== undefined ? this._options.threshold : 1024;
                    this._isServer = !!t;
                    this._deflate = null;
                    this._inflate = null;
                    this.params = null;
                    if (!m) {
                        const e = this._options.concurrencyLimit !== undefined ? this._options.concurrencyLimit : 10;
                        m = new o(e)
                    }
                }

                static get extensionName() {
                    return "permessage-deflate"
                }

                offer() {
                    const e = {};
                    if (this._options.serverNoContextTakeover) {
                        e.server_no_context_takeover = true
                    }
                    if (this._options.clientNoContextTakeover) {
                        e.client_no_context_takeover = true
                    }
                    if (this._options.serverMaxWindowBits) {
                        e.server_max_window_bits = this._options.serverMaxWindowBits
                    }
                    if (this._options.clientMaxWindowBits) {
                        e.client_max_window_bits = this._options.clientMaxWindowBits
                    } else if (this._options.clientMaxWindowBits == null) {
                        e.client_max_window_bits = true
                    }
                    return e
                }

                accept(e) {
                    e = this.normalizeParams(e);
                    this.params = this._isServer ? this.acceptAsServer(e) : this.acceptAsClient(e);
                    return this.params
                }

                cleanup() {
                    if (this._inflate) {
                        this._inflate.close();
                        this._inflate = null
                    }
                    if (this._deflate) {
                        const e = this._deflate[u];
                        this._deflate.close();
                        this._deflate = null;
                        if (e) {
                            e(new Error("The deflate stream was closed while data was being processed"))
                        }
                    }
                }

                acceptAsServer(e) {
                    const t = this._options;
                    const n = e.find((e => {
                        if (t.serverNoContextTakeover === false && e.server_no_context_takeover || e.server_max_window_bits && (t.serverMaxWindowBits === false || typeof t.serverMaxWindowBits === "number" && t.serverMaxWindowBits > e.server_max_window_bits) || typeof t.clientMaxWindowBits === "number" && !e.client_max_window_bits) {
                            return false
                        }
                        return true
                    }));
                    if (!n) {
                        throw new Error("None of the extension offers can be accepted")
                    }
                    if (t.serverNoContextTakeover) {
                        n.server_no_context_takeover = true
                    }
                    if (t.clientNoContextTakeover) {
                        n.client_no_context_takeover = true
                    }
                    if (typeof t.serverMaxWindowBits === "number") {
                        n.server_max_window_bits = t.serverMaxWindowBits
                    }
                    if (typeof t.clientMaxWindowBits === "number") {
                        n.client_max_window_bits = t.clientMaxWindowBits
                    } else if (n.client_max_window_bits === true || t.clientMaxWindowBits === false) {
                        delete n.client_max_window_bits
                    }
                    return n
                }

                acceptAsClient(e) {
                    const t = e[0];
                    if (this._options.clientNoContextTakeover === false && t.client_no_context_takeover) {
                        throw new Error('Unexpected parameter "client_no_context_takeover"')
                    }
                    if (!t.client_max_window_bits) {
                        if (typeof this._options.clientMaxWindowBits === "number") {
                            t.client_max_window_bits = this._options.clientMaxWindowBits
                        }
                    } else if (this._options.clientMaxWindowBits === false || typeof this._options.clientMaxWindowBits === "number" && t.client_max_window_bits > this._options.clientMaxWindowBits) {
                        throw new Error('Unexpected or invalid parameter "client_max_window_bits"')
                    }
                    return t
                }

                normalizeParams(e) {
                    e.forEach((e => {
                        Object.keys(e).forEach((t => {
                            let n = e[t];
                            if (n.length > 1) {
                                throw new Error(`Parameter "${t}" must have only a single value`)
                            }
                            n = n[0];
                            if (t === "client_max_window_bits") {
                                if (n !== true) {
                                    const e = +n;
                                    if (!Number.isInteger(e) || e < 8 || e > 15) {
                                        throw new TypeError(`Invalid value for parameter "${t}": ${n}`)
                                    }
                                    n = e
                                } else if (!this._isServer) {
                                    throw new TypeError(`Invalid value for parameter "${t}": ${n}`)
                                }
                            } else if (t === "server_max_window_bits") {
                                const e = +n;
                                if (!Number.isInteger(e) || e < 8 || e > 15) {
                                    throw new TypeError(`Invalid value for parameter "${t}": ${n}`)
                                }
                                n = e
                            } else if (t === "client_no_context_takeover" || t === "server_no_context_takeover") {
                                if (n !== true) {
                                    throw new TypeError(`Invalid value for parameter "${t}": ${n}`)
                                }
                            } else {
                                throw new Error(`Unknown parameter "${t}"`)
                            }
                            e[t] = n
                        }))
                    }));
                    return e
                }

                decompress(e, t, n) {
                    m.add((i => {
                        this._decompress(e, t, ((e, t) => {
                            i();
                            n(e, t)
                        }))
                    }))
                }

                compress(e, t, n) {
                    m.add((i => {
                        this._compress(e, t, ((e, t) => {
                            i();
                            n(e, t)
                        }))
                    }))
                }

                _decompress(e, t, n) {
                    const o = this._isServer ? "client" : "server";
                    if (!this._inflate) {
                        const e = `${o}_max_window_bits`;
                        const t = typeof this.params[e] !== "number" ? i.Z_DEFAULT_WINDOWBITS : this.params[e];
                        this._inflate = i.createInflateRaw({...this._options.zlibInflateOptions, windowBits: t});
                        this._inflate[l] = this;
                        this._inflate[p] = 0;
                        this._inflate[d] = [];
                        this._inflate.on("error", inflateOnError);
                        this._inflate.on("data", inflateOnData)
                    }
                    this._inflate[u] = n;
                    this._inflate.write(e);
                    if (t) this._inflate.write(c);
                    this._inflate.flush((() => {
                        const e = this._inflate[f];
                        if (e) {
                            this._inflate.close();
                            this._inflate = null;
                            n(e);
                            return
                        }
                        const i = s.concat(this._inflate[d], this._inflate[p]);
                        if (this._inflate._readableState.endEmitted) {
                            this._inflate.close();
                            this._inflate = null
                        } else {
                            this._inflate[p] = 0;
                            this._inflate[d] = [];
                            if (t && this.params[`${o}_no_context_takeover`]) {
                                this._inflate.reset()
                            }
                        }
                        n(null, i)
                    }))
                }

                _compress(e, t, n) {
                    const o = this._isServer ? "server" : "client";
                    if (!this._deflate) {
                        const e = `${o}_max_window_bits`;
                        const t = typeof this.params[e] !== "number" ? i.Z_DEFAULT_WINDOWBITS : this.params[e];
                        this._deflate = i.createDeflateRaw({...this._options.zlibDeflateOptions, windowBits: t});
                        this._deflate[p] = 0;
                        this._deflate[d] = [];
                        this._deflate.on("data", deflateOnData)
                    }
                    this._deflate[u] = n;
                    this._deflate.write(e);
                    this._deflate.flush(i.Z_SYNC_FLUSH, (() => {
                        if (!this._deflate) {
                            return
                        }
                        let e = s.concat(this._deflate[d], this._deflate[p]);
                        if (t) {
                            e = new r(e.buffer, e.byteOffset, e.length - 4)
                        }
                        this._deflate[u] = null;
                        this._deflate[p] = 0;
                        this._deflate[d] = [];
                        if (t && this.params[`${o}_no_context_takeover`]) {
                            this._deflate.reset()
                        }
                        n(null, e)
                    }))
                }
            }

            e.exports = PerMessageDeflate;

            function deflateOnData(e) {
                this[d].push(e);
                this[p] += e.length
            }

            function inflateOnData(e) {
                this[p] += e.length;
                if (this[l]._maxPayload < 1 || this[p] <= this[l]._maxPayload) {
                    this[d].push(e);
                    return
                }
                this[f] = new RangeError("Max payload size exceeded");
                this[f].code = "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH";
                this[f][a] = 1009;
                this.removeListener("data", inflateOnData);
                this.reset()
            }

            function inflateOnError(e) {
                this[l]._inflate = null;
                if (this[f]) {
                    this[u](this[f]);
                    return
                }
                e[a] = 1007;
                this[u](e)
            }
        }, 4413: (e, t, n) => {
            "use strict";
            const {Writable: i} = n(2203);
            const s = n(4536);
            const {BINARY_TYPES: o, EMPTY_BUFFER: a, kStatusCode: r, kWebSocket: c} = n(8031);
            const {concat: l, toArrayBuffer: p, unmask: u} = n(6523);
            const {isValidStatusCode: d, isValidUTF8: f} = n(8631);
            const m = Buffer[Symbol.species];
            const h = 0;
            const x = 1;
            const g = 2;
            const v = 3;
            const y = 4;
            const b = 5;
            const w = 6;

            class Receiver extends i {
                constructor(e = {}) {
                    super();
                    this._allowSynchronousEvents = e.allowSynchronousEvents !== undefined ? e.allowSynchronousEvents : true;
                    this._binaryType = e.binaryType || o[0];
                    this._extensions = e.extensions || {};
                    this._isServer = !!e.isServer;
                    this._maxPayload = e.maxPayload | 0;
                    this._skipUTF8Validation = !!e.skipUTF8Validation;
                    this[c] = undefined;
                    this._bufferedBytes = 0;
                    this._buffers = [];
                    this._compressed = false;
                    this._payloadLength = 0;
                    this._mask = undefined;
                    this._fragmented = 0;
                    this._masked = false;
                    this._fin = false;
                    this._opcode = 0;
                    this._totalPayloadLength = 0;
                    this._messageLength = 0;
                    this._fragments = [];
                    this._errored = false;
                    this._loop = false;
                    this._state = h
                }

                _write(e, t, n) {
                    if (this._opcode === 8 && this._state == h) return n();
                    this._bufferedBytes += e.length;
                    this._buffers.push(e);
                    this.startLoop(n)
                }

                consume(e) {
                    this._bufferedBytes -= e;
                    if (e === this._buffers[0].length) return this._buffers.shift();
                    if (e < this._buffers[0].length) {
                        const t = this._buffers[0];
                        this._buffers[0] = new m(t.buffer, t.byteOffset + e, t.length - e);
                        return new m(t.buffer, t.byteOffset, e)
                    }
                    const t = Buffer.allocUnsafe(e);
                    do {
                        const n = this._buffers[0];
                        const i = t.length - e;
                        if (e >= n.length) {
                            t.set(this._buffers.shift(), i)
                        } else {
                            t.set(new Uint8Array(n.buffer, n.byteOffset, e), i);
                            this._buffers[0] = new m(n.buffer, n.byteOffset + e, n.length - e)
                        }
                        e -= n.length
                    } while (e > 0);
                    return t
                }

                startLoop(e) {
                    this._loop = true;
                    do {
                        switch (this._state) {
                            case h:
                                this.getInfo(e);
                                break;
                            case x:
                                this.getPayloadLength16(e);
                                break;
                            case g:
                                this.getPayloadLength64(e);
                                break;
                            case v:
                                this.getMask();
                                break;
                            case y:
                                this.getData(e);
                                break;
                            case b:
                            case w:
                                this._loop = false;
                                return
                        }
                    } while (this._loop);
                    if (!this._errored) e()
                }

                getInfo(e) {
                    if (this._bufferedBytes < 2) {
                        this._loop = false;
                        return
                    }
                    const t = this.consume(2);
                    if ((t[0] & 48) !== 0) {
                        const t = this.createError(RangeError, "RSV2 and RSV3 must be clear", true, 1002, "WS_ERR_UNEXPECTED_RSV_2_3");
                        e(t);
                        return
                    }
                    const n = (t[0] & 64) === 64;
                    if (n && !this._extensions[s.extensionName]) {
                        const t = this.createError(RangeError, "RSV1 must be clear", true, 1002, "WS_ERR_UNEXPECTED_RSV_1");
                        e(t);
                        return
                    }
                    this._fin = (t[0] & 128) === 128;
                    this._opcode = t[0] & 15;
                    this._payloadLength = t[1] & 127;
                    if (this._opcode === 0) {
                        if (n) {
                            const t = this.createError(RangeError, "RSV1 must be clear", true, 1002, "WS_ERR_UNEXPECTED_RSV_1");
                            e(t);
                            return
                        }
                        if (!this._fragmented) {
                            const t = this.createError(RangeError, "invalid opcode 0", true, 1002, "WS_ERR_INVALID_OPCODE");
                            e(t);
                            return
                        }
                        this._opcode = this._fragmented
                    } else if (this._opcode === 1 || this._opcode === 2) {
                        if (this._fragmented) {
                            const t = this.createError(RangeError, `invalid opcode ${this._opcode}`, true, 1002, "WS_ERR_INVALID_OPCODE");
                            e(t);
                            return
                        }
                        this._compressed = n
                    } else if (this._opcode > 7 && this._opcode < 11) {
                        if (!this._fin) {
                            const t = this.createError(RangeError, "FIN must be set", true, 1002, "WS_ERR_EXPECTED_FIN");
                            e(t);
                            return
                        }
                        if (n) {
                            const t = this.createError(RangeError, "RSV1 must be clear", true, 1002, "WS_ERR_UNEXPECTED_RSV_1");
                            e(t);
                            return
                        }
                        if (this._payloadLength > 125 || this._opcode === 8 && this._payloadLength === 1) {
                            const t = this.createError(RangeError, `invalid payload length ${this._payloadLength}`, true, 1002, "WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH");
                            e(t);
                            return
                        }
                    } else {
                        const t = this.createError(RangeError, `invalid opcode ${this._opcode}`, true, 1002, "WS_ERR_INVALID_OPCODE");
                        e(t);
                        return
                    }
                    if (!this._fin && !this._fragmented) this._fragmented = this._opcode;
                    this._masked = (t[1] & 128) === 128;
                    if (this._isServer) {
                        if (!this._masked) {
                            const t = this.createError(RangeError, "MASK must be set", true, 1002, "WS_ERR_EXPECTED_MASK");
                            e(t);
                            return
                        }
                    } else if (this._masked) {
                        const t = this.createError(RangeError, "MASK must be clear", true, 1002, "WS_ERR_UNEXPECTED_MASK");
                        e(t);
                        return
                    }
                    if (this._payloadLength === 126) this._state = x; else if (this._payloadLength === 127) this._state = g; else this.haveLength(e)
                }

                getPayloadLength16(e) {
                    if (this._bufferedBytes < 2) {
                        this._loop = false;
                        return
                    }
                    this._payloadLength = this.consume(2).readUInt16BE(0);
                    this.haveLength(e)
                }

                getPayloadLength64(e) {
                    if (this._bufferedBytes < 8) {
                        this._loop = false;
                        return
                    }
                    const t = this.consume(8);
                    const n = t.readUInt32BE(0);
                    if (n > Math.pow(2, 53 - 32) - 1) {
                        const t = this.createError(RangeError, "Unsupported WebSocket frame: payload length > 2^53 - 1", false, 1009, "WS_ERR_UNSUPPORTED_DATA_PAYLOAD_LENGTH");
                        e(t);
                        return
                    }
                    this._payloadLength = n * Math.pow(2, 32) + t.readUInt32BE(4);
                    this.haveLength(e)
                }

                haveLength(e) {
                    if (this._payloadLength && this._opcode < 8) {
                        this._totalPayloadLength += this._payloadLength;
                        if (this._totalPayloadLength > this._maxPayload && this._maxPayload > 0) {
                            const t = this.createError(RangeError, "Max payload size exceeded", false, 1009, "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH");
                            e(t);
                            return
                        }
                    }
                    if (this._masked) this._state = v; else this._state = y
                }

                getMask() {
                    if (this._bufferedBytes < 4) {
                        this._loop = false;
                        return
                    }
                    this._mask = this.consume(4);
                    this._state = y
                }

                getData(e) {
                    let t = a;
                    if (this._payloadLength) {
                        if (this._bufferedBytes < this._payloadLength) {
                            this._loop = false;
                            return
                        }
                        t = this.consume(this._payloadLength);
                        if (this._masked && (this._mask[0] | this._mask[1] | this._mask[2] | this._mask[3]) !== 0) {
                            u(t, this._mask)
                        }
                    }
                    if (this._opcode > 7) {
                        this.controlMessage(t, e);
                        return
                    }
                    if (this._compressed) {
                        this._state = b;
                        this.decompress(t, e);
                        return
                    }
                    if (t.length) {
                        this._messageLength = this._totalPayloadLength;
                        this._fragments.push(t)
                    }
                    this.dataMessage(e)
                }

                decompress(e, t) {
                    const n = this._extensions[s.extensionName];
                    n.decompress(e, this._fin, ((e, n) => {
                        if (e) return t(e);
                        if (n.length) {
                            this._messageLength += n.length;
                            if (this._messageLength > this._maxPayload && this._maxPayload > 0) {
                                const e = this.createError(RangeError, "Max payload size exceeded", false, 1009, "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH");
                                t(e);
                                return
                            }
                            this._fragments.push(n)
                        }
                        this.dataMessage(t);
                        if (this._state === h) this.startLoop(t)
                    }))
                }

                dataMessage(e) {
                    if (!this._fin) {
                        this._state = h;
                        return
                    }
                    const t = this._messageLength;
                    const n = this._fragments;
                    this._totalPayloadLength = 0;
                    this._messageLength = 0;
                    this._fragmented = 0;
                    this._fragments = [];
                    if (this._opcode === 2) {
                        let i;
                        if (this._binaryType === "nodebuffer") {
                            i = l(n, t)
                        } else if (this._binaryType === "arraybuffer") {
                            i = p(l(n, t))
                        } else if (this._binaryType === "blob") {
                            i = new Blob(n)
                        } else {
                            i = n
                        }
                        if (this._allowSynchronousEvents) {
                            this.emit("message", i, true);
                            this._state = h
                        } else {
                            this._state = w;
                            setImmediate((() => {
                                this.emit("message", i, true);
                                this._state = h;
                                this.startLoop(e)
                            }))
                        }
                    } else {
                        const i = l(n, t);
                        if (!this._skipUTF8Validation && !f(i)) {
                            const t = this.createError(Error, "invalid UTF-8 sequence", true, 1007, "WS_ERR_INVALID_UTF8");
                            e(t);
                            return
                        }
                        if (this._state === b || this._allowSynchronousEvents) {
                            this.emit("message", i, false);
                            this._state = h
                        } else {
                            this._state = w;
                            setImmediate((() => {
                                this.emit("message", i, false);
                                this._state = h;
                                this.startLoop(e)
                            }))
                        }
                    }
                }

                controlMessage(e, t) {
                    if (this._opcode === 8) {
                        if (e.length === 0) {
                            this._loop = false;
                            this.emit("conclude", 1005, a);
                            this.end()
                        } else {
                            const n = e.readUInt16BE(0);
                            if (!d(n)) {
                                const e = this.createError(RangeError, `invalid status code ${n}`, true, 1002, "WS_ERR_INVALID_CLOSE_CODE");
                                t(e);
                                return
                            }
                            const i = new m(e.buffer, e.byteOffset + 2, e.length - 2);
                            if (!this._skipUTF8Validation && !f(i)) {
                                const e = this.createError(Error, "invalid UTF-8 sequence", true, 1007, "WS_ERR_INVALID_UTF8");
                                t(e);
                                return
                            }
                            this._loop = false;
                            this.emit("conclude", n, i);
                            this.end()
                        }
                        this._state = h;
                        return
                    }
                    if (this._allowSynchronousEvents) {
                        this.emit(this._opcode === 9 ? "ping" : "pong", e);
                        this._state = h
                    } else {
                        this._state = w;
                        setImmediate((() => {
                            this.emit(this._opcode === 9 ? "ping" : "pong", e);
                            this._state = h;
                            this.startLoop(t)
                        }))
                    }
                }

                createError(e, t, n, i, s) {
                    this._loop = false;
                    this._errored = true;
                    const o = new e(n ? `Invalid WebSocket frame: ${t}` : t);
                    Error.captureStackTrace(o, this.createError);
                    o.code = s;
                    o[r] = i;
                    return o
                }
            }

            e.exports = Receiver
        }, 5693: (e, t, n) => {
            "use strict";
            const {Duplex: i} = n(2203);
            const {randomFillSync: s} = n(6982);
            const o = n(4536);
            const {EMPTY_BUFFER: a, kWebSocket: r, NOOP: c} = n(8031);
            const {isBlob: l, isValidStatusCode: p} = n(8631);
            const {mask: u, toBuffer: d} = n(6523);
            const f = Symbol("kByteLength");
            const m = Buffer.alloc(4);
            const h = 8 * 1024;
            let x;
            let g = h;
            const v = 0;
            const y = 1;
            const b = 2;

            class Sender {
                constructor(e, t, n) {
                    this._extensions = t || {};
                    if (n) {
                        this._generateMask = n;
                        this._maskBuffer = Buffer.alloc(4)
                    }
                    this._socket = e;
                    this._firstFragment = true;
                    this._compress = false;
                    this._bufferedBytes = 0;
                    this._queue = [];
                    this._state = v;
                    this.onerror = c;
                    this[r] = undefined
                }

                static frame(e, t) {
                    let n;
                    let i = false;
                    let o = 2;
                    let a = false;
                    if (t.mask) {
                        n = t.maskBuffer || m;
                        if (t.generateMask) {
                            t.generateMask(n)
                        } else {
                            if (g === h) {
                                if (x === undefined) {
                                    x = Buffer.alloc(h)
                                }
                                s(x, 0, h);
                                g = 0
                            }
                            n[0] = x[g++];
                            n[1] = x[g++];
                            n[2] = x[g++];
                            n[3] = x[g++]
                        }
                        a = (n[0] | n[1] | n[2] | n[3]) === 0;
                        o = 6
                    }
                    let r;
                    if (typeof e === "string") {
                        if ((!t.mask || a) && t[f] !== undefined) {
                            r = t[f]
                        } else {
                            e = Buffer.from(e);
                            r = e.length
                        }
                    } else {
                        r = e.length;
                        i = t.mask && t.readOnly && !a
                    }
                    let c = r;
                    if (r >= 65536) {
                        o += 8;
                        c = 127
                    } else if (r > 125) {
                        o += 2;
                        c = 126
                    }
                    const l = Buffer.allocUnsafe(i ? r + o : o);
                    l[0] = t.fin ? t.opcode | 128 : t.opcode;
                    if (t.rsv1) l[0] |= 64;
                    l[1] = c;
                    if (c === 126) {
                        l.writeUInt16BE(r, 2)
                    } else if (c === 127) {
                        l[2] = l[3] = 0;
                        l.writeUIntBE(r, 4, 6)
                    }
                    if (!t.mask) return [l, e];
                    l[1] |= 128;
                    l[o - 4] = n[0];
                    l[o - 3] = n[1];
                    l[o - 2] = n[2];
                    l[o - 1] = n[3];
                    if (a) return [l, e];
                    if (i) {
                        u(e, n, l, o, r);
                        return [l]
                    }
                    u(e, n, e, 0, r);
                    return [l, e]
                }

                close(e, t, n, i) {
                    let s;
                    if (e === undefined) {
                        s = a
                    } else if (typeof e !== "number" || !p(e)) {
                        throw new TypeError("First argument must be a valid error code number")
                    } else if (t === undefined || !t.length) {
                        s = Buffer.allocUnsafe(2);
                        s.writeUInt16BE(e, 0)
                    } else {
                        const n = Buffer.byteLength(t);
                        if (n > 123) {
                            throw new RangeError("The message must not be greater than 123 bytes")
                        }
                        s = Buffer.allocUnsafe(2 + n);
                        s.writeUInt16BE(e, 0);
                        if (typeof t === "string") {
                            s.write(t, 2)
                        } else {
                            s.set(t, 2)
                        }
                    }
                    const o = {
                        [f]: s.length,
                        fin: true,
                        generateMask: this._generateMask,
                        mask: n,
                        maskBuffer: this._maskBuffer,
                        opcode: 8,
                        readOnly: false,
                        rsv1: false
                    };
                    if (this._state !== v) {
                        this.enqueue([this.dispatch, s, false, o, i])
                    } else {
                        this.sendFrame(Sender.frame(s, o), i)
                    }
                }

                ping(e, t, n) {
                    let i;
                    let s;
                    if (typeof e === "string") {
                        i = Buffer.byteLength(e);
                        s = false
                    } else if (l(e)) {
                        i = e.size;
                        s = false
                    } else {
                        e = d(e);
                        i = e.length;
                        s = d.readOnly
                    }
                    if (i > 125) {
                        throw new RangeError("The data size must not be greater than 125 bytes")
                    }
                    const o = {
                        [f]: i,
                        fin: true,
                        generateMask: this._generateMask,
                        mask: t,
                        maskBuffer: this._maskBuffer,
                        opcode: 9,
                        readOnly: s,
                        rsv1: false
                    };
                    if (l(e)) {
                        if (this._state !== v) {
                            this.enqueue([this.getBlobData, e, false, o, n])
                        } else {
                            this.getBlobData(e, false, o, n)
                        }
                    } else if (this._state !== v) {
                        this.enqueue([this.dispatch, e, false, o, n])
                    } else {
                        this.sendFrame(Sender.frame(e, o), n)
                    }
                }

                pong(e, t, n) {
                    let i;
                    let s;
                    if (typeof e === "string") {
                        i = Buffer.byteLength(e);
                        s = false
                    } else if (l(e)) {
                        i = e.size;
                        s = false
                    } else {
                        e = d(e);
                        i = e.length;
                        s = d.readOnly
                    }
                    if (i > 125) {
                        throw new RangeError("The data size must not be greater than 125 bytes")
                    }
                    const o = {
                        [f]: i,
                        fin: true,
                        generateMask: this._generateMask,
                        mask: t,
                        maskBuffer: this._maskBuffer,
                        opcode: 10,
                        readOnly: s,
                        rsv1: false
                    };
                    if (l(e)) {
                        if (this._state !== v) {
                            this.enqueue([this.getBlobData, e, false, o, n])
                        } else {
                            this.getBlobData(e, false, o, n)
                        }
                    } else if (this._state !== v) {
                        this.enqueue([this.dispatch, e, false, o, n])
                    } else {
                        this.sendFrame(Sender.frame(e, o), n)
                    }
                }

                send(e, t, n) {
                    const i = this._extensions[o.extensionName];
                    let s = t.binary ? 2 : 1;
                    let a = t.compress;
                    let r;
                    let c;
                    if (typeof e === "string") {
                        r = Buffer.byteLength(e);
                        c = false
                    } else if (l(e)) {
                        r = e.size;
                        c = false
                    } else {
                        e = d(e);
                        r = e.length;
                        c = d.readOnly
                    }
                    if (this._firstFragment) {
                        this._firstFragment = false;
                        if (a && i && i.params[i._isServer ? "server_no_context_takeover" : "client_no_context_takeover"]) {
                            a = r >= i._threshold
                        }
                        this._compress = a
                    } else {
                        a = false;
                        s = 0
                    }
                    if (t.fin) this._firstFragment = true;
                    const p = {
                        [f]: r,
                        fin: t.fin,
                        generateMask: this._generateMask,
                        mask: t.mask,
                        maskBuffer: this._maskBuffer,
                        opcode: s,
                        readOnly: c,
                        rsv1: a
                    };
                    if (l(e)) {
                        if (this._state !== v) {
                            this.enqueue([this.getBlobData, e, this._compress, p, n])
                        } else {
                            this.getBlobData(e, this._compress, p, n)
                        }
                    } else if (this._state !== v) {
                        this.enqueue([this.dispatch, e, this._compress, p, n])
                    } else {
                        this.dispatch(e, this._compress, p, n)
                    }
                }

                getBlobData(e, t, n, i) {
                    this._bufferedBytes += n[f];
                    this._state = b;
                    e.arrayBuffer().then((e => {
                        if (this._socket.destroyed) {
                            const e = new Error("The socket was closed while the blob was being read");
                            process.nextTick(callCallbacks, this, e, i);
                            return
                        }
                        this._bufferedBytes -= n[f];
                        const s = d(e);
                        if (!t) {
                            this._state = v;
                            this.sendFrame(Sender.frame(s, n), i);
                            this.dequeue()
                        } else {
                            this.dispatch(s, t, n, i)
                        }
                    })).catch((e => {
                        process.nextTick(onError, this, e, i)
                    }))
                }

                dispatch(e, t, n, i) {
                    if (!t) {
                        this.sendFrame(Sender.frame(e, n), i);
                        return
                    }
                    const s = this._extensions[o.extensionName];
                    this._bufferedBytes += n[f];
                    this._state = y;
                    s.compress(e, n.fin, ((e, t) => {
                        if (this._socket.destroyed) {
                            const e = new Error("The socket was closed while data was being compressed");
                            callCallbacks(this, e, i);
                            return
                        }
                        this._bufferedBytes -= n[f];
                        this._state = v;
                        n.readOnly = false;
                        this.sendFrame(Sender.frame(t, n), i);
                        this.dequeue()
                    }))
                }

                dequeue() {
                    while (this._state === v && this._queue.length) {
                        const e = this._queue.shift();
                        this._bufferedBytes -= e[3][f];
                        Reflect.apply(e[0], this, e.slice(1))
                    }
                }

                enqueue(e) {
                    this._bufferedBytes += e[3][f];
                    this._queue.push(e)
                }

                sendFrame(e, t) {
                    if (e.length === 2) {
                        this._socket.cork();
                        this._socket.write(e[0]);
                        this._socket.write(e[1], t);
                        this._socket.uncork()
                    } else {
                        this._socket.write(e[0], t)
                    }
                }
            }

            e.exports = Sender;

            function callCallbacks(e, t, n) {
                if (typeof n === "function") n(t);
                for (let n = 0; n < e._queue.length; n++) {
                    const i = e._queue[n];
                    const s = i[i.length - 1];
                    if (typeof s === "function") s(t)
                }
            }

            function onError(e, t, n) {
                callCallbacks(e, t, n);
                e.onerror(t)
            }
        }, 5820: (e, t, n) => {
            "use strict";
            const i = n(5033);
            const {Duplex: s} = n(2203);

            function emitClose(e) {
                e.emit("close")
            }

            function duplexOnEnd() {
                if (!this.destroyed && this._writableState.finished) {
                    this.destroy()
                }
            }

            function duplexOnError(e) {
                this.removeListener("error", duplexOnError);
                this.destroy();
                if (this.listenerCount("error") === 0) {
                    this.emit("error", e)
                }
            }

            function createWebSocketStream(e, t) {
                let n = true;
                const i = new s({
                    ...t,
                    autoDestroy: false,
                    emitClose: false,
                    objectMode: false,
                    writableObjectMode: false
                });
                e.on("message", (function message(t, n) {
                    const s = !n && i._readableState.objectMode ? t.toString() : t;
                    if (!i.push(s)) e.pause()
                }));
                e.once("error", (function error(e) {
                    if (i.destroyed) return;
                    n = false;
                    i.destroy(e)
                }));
                e.once("close", (function close() {
                    if (i.destroyed) return;
                    i.push(null)
                }));
                i._destroy = function (t, s) {
                    if (e.readyState === e.CLOSED) {
                        s(t);
                        process.nextTick(emitClose, i);
                        return
                    }
                    let o = false;
                    e.once("error", (function error(e) {
                        o = true;
                        s(e)
                    }));
                    e.once("close", (function close() {
                        if (!o) s(t);
                        process.nextTick(emitClose, i)
                    }));
                    if (n) e.terminate()
                };
                i._final = function (t) {
                    if (e.readyState === e.CONNECTING) {
                        e.once("open", (function open() {
                            i._final(t)
                        }));
                        return
                    }
                    if (e._socket === null) return;
                    if (e._socket._writableState.finished) {
                        t();
                        if (i._readableState.endEmitted) i.destroy()
                    } else {
                        e._socket.once("finish", (function finish() {
                            t()
                        }));
                        e.close()
                    }
                };
                i._read = function () {
                    if (e.isPaused) e.resume()
                };
                i._write = function (t, n, s) {
                    if (e.readyState === e.CONNECTING) {
                        e.once("open", (function open() {
                            i._write(t, n, s)
                        }));
                        return
                    }
                    e.send(t, s)
                };
                i.on("end", duplexOnEnd);
                i.on("error", duplexOnError);
                return i
            }

            e.exports = createWebSocketStream
        }, 7604: (e, t, n) => {
            "use strict";
            const {tokenChars: i} = n(8631);

            function parse(e) {
                const t = new Set;
                let n = -1;
                let s = -1;
                let o = 0;
                for (o; o < e.length; o++) {
                    const a = e.charCodeAt(o);
                    if (s === -1 && i[a] === 1) {
                        if (n === -1) n = o
                    } else if (o !== 0 && (a === 32 || a === 9)) {
                        if (s === -1 && n !== -1) s = o
                    } else if (a === 44) {
                        if (n === -1) {
                            throw new SyntaxError(`Unexpected character at index ${o}`)
                        }
                        if (s === -1) s = o;
                        const i = e.slice(n, s);
                        if (t.has(i)) {
                            throw new SyntaxError(`The "${i}" subprotocol is duplicated`)
                        }
                        t.add(i);
                        n = s = -1
                    } else {
                        throw new SyntaxError(`Unexpected character at index ${o}`)
                    }
                }
                if (n === -1 || s !== -1) {
                    throw new SyntaxError("Unexpected end of input")
                }
                const a = e.slice(n, o);
                if (t.has(a)) {
                    throw new SyntaxError(`The "${a}" subprotocol is duplicated`)
                }
                t.add(a);
                return t
            }

            e.exports = {parse: parse}
        }, 8631: (e, t, n) => {
            "use strict";
            const {isUtf8: i} = n(181);
            const {hasBlob: s} = n(8031);
            const o = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0];

            function isValidStatusCode(e) {
                return e >= 1e3 && e <= 1014 && e !== 1004 && e !== 1005 && e !== 1006 || e >= 3e3 && e <= 4999
            }

            function _isValidUTF8(e) {
                const t = e.length;
                let n = 0;
                while (n < t) {
                    if ((e[n] & 128) === 0) {
                        n++
                    } else if ((e[n] & 224) === 192) {
                        if (n + 1 === t || (e[n + 1] & 192) !== 128 || (e[n] & 254) === 192) {
                            return false
                        }
                        n += 2
                    } else if ((e[n] & 240) === 224) {
                        if (n + 2 >= t || (e[n + 1] & 192) !== 128 || (e[n + 2] & 192) !== 128 || e[n] === 224 && (e[n + 1] & 224) === 128 || e[n] === 237 && (e[n + 1] & 224) === 160) {
                            return false
                        }
                        n += 3
                    } else if ((e[n] & 248) === 240) {
                        if (n + 3 >= t || (e[n + 1] & 192) !== 128 || (e[n + 2] & 192) !== 128 || (e[n + 3] & 192) !== 128 || e[n] === 240 && (e[n + 1] & 240) === 128 || e[n] === 244 && e[n + 1] > 143 || e[n] > 244) {
                            return false
                        }
                        n += 4
                    } else {
                        return false
                    }
                }
                return true
            }

            function isBlob(e) {
                return s && typeof e === "object" && typeof e.arrayBuffer === "function" && typeof e.type === "string" && typeof e.stream === "function" && (e[Symbol.toStringTag] === "Blob" || e[Symbol.toStringTag] === "File")
            }

            e.exports = {
                isBlob: isBlob,
                isValidStatusCode: isValidStatusCode,
                isValidUTF8: _isValidUTF8,
                tokenChars: o
            };
            if (i) {
                e.exports.isValidUTF8 = function (e) {
                    return e.length < 24 ? _isValidUTF8(e) : i(e)
                }
            } else if (!process.env.WS_NO_UTF_8_VALIDATE) {
                try {
                    const t = n(8870);
                    e.exports.isValidUTF8 = function (e) {
                        return e.length < 32 ? _isValidUTF8(e) : t(e)
                    }
                } catch (e) {
                }
            }
        }, 3985: (e, t, n) => {
            "use strict";
            const i = n(4434);
            const s = n(8611);
            const {Duplex: o} = n(2203);
            const {createHash: a} = n(6982);
            const r = n(247);
            const c = n(4536);
            const l = n(7604);
            const p = n(5033);
            const {GUID: u, kWebSocket: d} = n(8031);
            const f = /^[+/0-9A-Za-z]{22}==$/;
            const m = 0;
            const h = 1;
            const x = 2;

            class WebSocketServer extends i {
                constructor(e, t) {
                    super();
                    e = {
                        allowSynchronousEvents: true,
                        autoPong: true,
                        maxPayload: 100 * 1024 * 1024,
                        skipUTF8Validation: false,
                        perMessageDeflate: false,
                        handleProtocols: null,
                        clientTracking: true,
                        verifyClient: null,
                        noServer: false,
                        backlog: null,
                        server: null,
                        host: null,
                        path: null,
                        port: null,
                        WebSocket: p, ...e
                    };
                    if (e.port == null && !e.server && !e.noServer || e.port != null && (e.server || e.noServer) || e.server && e.noServer) {
                        throw new TypeError('One and only one of the "port", "server", or "noServer" options ' + "must be specified")
                    }
                    if (e.port != null) {
                        this._server = s.createServer(((e, t) => {
                            const n = s.STATUS_CODES[426];
                            t.writeHead(426, {"Content-Length": n.length, "Content-Type": "text/plain"});
                            t.end(n)
                        }));
                        this._server.listen(e.port, e.host, e.backlog, t)
                    } else if (e.server) {
                        this._server = e.server
                    }
                    if (this._server) {
                        const e = this.emit.bind(this, "connection");
                        this._removeListeners = addListeners(this._server, {
                            listening: this.emit.bind(this, "listening"),
                            error: this.emit.bind(this, "error"),
                            upgrade: (t, n, i) => {
                                this.handleUpgrade(t, n, i, e)
                            }
                        })
                    }
                    if (e.perMessageDeflate === true) e.perMessageDeflate = {};
                    if (e.clientTracking) {
                        this.clients = new Set;
                        this._shouldEmitClose = false
                    }
                    this.options = e;
                    this._state = m
                }

                address() {
                    if (this.options.noServer) {
                        throw new Error('The server is operating in "noServer" mode')
                    }
                    if (!this._server) return null;
                    return this._server.address()
                }

                close(e) {
                    if (this._state === x) {
                        if (e) {
                            this.once("close", (() => {
                                e(new Error("The server is not running"))
                            }))
                        }
                        process.nextTick(emitClose, this);
                        return
                    }
                    if (e) this.once("close", e);
                    if (this._state === h) return;
                    this._state = h;
                    if (this.options.noServer || this.options.server) {
                        if (this._server) {
                            this._removeListeners();
                            this._removeListeners = this._server = null
                        }
                        if (this.clients) {
                            if (!this.clients.size) {
                                process.nextTick(emitClose, this)
                            } else {
                                this._shouldEmitClose = true
                            }
                        } else {
                            process.nextTick(emitClose, this)
                        }
                    } else {
                        const e = this._server;
                        this._removeListeners();
                        this._removeListeners = this._server = null;
                        e.close((() => {
                            emitClose(this)
                        }))
                    }
                }

                shouldHandle(e) {
                    if (this.options.path) {
                        const t = e.url.indexOf("?");
                        const n = t !== -1 ? e.url.slice(0, t) : e.url;
                        if (n !== this.options.path) return false
                    }
                    return true
                }

                handleUpgrade(e, t, n, i) {
                    t.on("error", socketOnError);
                    const s = e.headers["sec-websocket-key"];
                    const o = e.headers.upgrade;
                    const a = +e.headers["sec-websocket-version"];
                    if (e.method !== "GET") {
                        const n = "Invalid HTTP method";
                        abortHandshakeOrEmitwsClientError(this, e, t, 405, n);
                        return
                    }
                    if (o === undefined || o.toLowerCase() !== "websocket") {
                        const n = "Invalid Upgrade header";
                        abortHandshakeOrEmitwsClientError(this, e, t, 400, n);
                        return
                    }
                    if (s === undefined || !f.test(s)) {
                        const n = "Missing or invalid Sec-WebSocket-Key header";
                        abortHandshakeOrEmitwsClientError(this, e, t, 400, n);
                        return
                    }
                    if (a !== 13 && a !== 8) {
                        const n = "Missing or invalid Sec-WebSocket-Version header";
                        abortHandshakeOrEmitwsClientError(this, e, t, 400, n, {"Sec-WebSocket-Version": "13, 8"});
                        return
                    }
                    if (!this.shouldHandle(e)) {
                        abortHandshake(t, 400);
                        return
                    }
                    const p = e.headers["sec-websocket-protocol"];
                    let u = new Set;
                    if (p !== undefined) {
                        try {
                            u = l.parse(p)
                        } catch (n) {
                            const i = "Invalid Sec-WebSocket-Protocol header";
                            abortHandshakeOrEmitwsClientError(this, e, t, 400, i);
                            return
                        }
                    }
                    const d = e.headers["sec-websocket-extensions"];
                    const m = {};
                    if (this.options.perMessageDeflate && d !== undefined) {
                        const n = new c(this.options.perMessageDeflate, true, this.options.maxPayload);
                        try {
                            const e = r.parse(d);
                            if (e[c.extensionName]) {
                                n.accept(e[c.extensionName]);
                                m[c.extensionName] = n
                            }
                        } catch (n) {
                            const i = "Invalid or unacceptable Sec-WebSocket-Extensions header";
                            abortHandshakeOrEmitwsClientError(this, e, t, 400, i);
                            return
                        }
                    }
                    if (this.options.verifyClient) {
                        const o = {
                            origin: e.headers[`${a === 8 ? "sec-websocket-origin" : "origin"}`],
                            secure: !!(e.socket.authorized || e.socket.encrypted),
                            req: e
                        };
                        if (this.options.verifyClient.length === 2) {
                            this.options.verifyClient(o, ((o, a, r, c) => {
                                if (!o) {
                                    return abortHandshake(t, a || 401, r, c)
                                }
                                this.completeUpgrade(m, s, u, e, t, n, i)
                            }));
                            return
                        }
                        if (!this.options.verifyClient(o)) return abortHandshake(t, 401)
                    }
                    this.completeUpgrade(m, s, u, e, t, n, i)
                }

                completeUpgrade(e, t, n, i, s, o, l) {
                    if (!s.readable || !s.writable) return s.destroy();
                    if (s[d]) {
                        throw new Error("server.handleUpgrade() was called more than once with the same " + "socket, possibly due to a misconfiguration")
                    }
                    if (this._state > m) return abortHandshake(s, 503);
                    const p = a("sha1").update(t + u).digest("base64");
                    const f = ["HTTP/1.1 101 Switching Protocols", "Upgrade: websocket", "Connection: Upgrade", `Sec-WebSocket-Accept: ${p}`];
                    const h = new this.options.WebSocket(null, undefined, this.options);
                    if (n.size) {
                        const e = this.options.handleProtocols ? this.options.handleProtocols(n, i) : n.values().next().value;
                        if (e) {
                            f.push(`Sec-WebSocket-Protocol: ${e}`);
                            h._protocol = e
                        }
                    }
                    if (e[c.extensionName]) {
                        const t = e[c.extensionName].params;
                        const n = r.format({[c.extensionName]: [t]});
                        f.push(`Sec-WebSocket-Extensions: ${n}`);
                        h._extensions = e
                    }
                    this.emit("headers", f, i);
                    s.write(f.concat("\r\n").join("\r\n"));
                    s.removeListener("error", socketOnError);
                    h.setSocket(s, o, {
                        allowSynchronousEvents: this.options.allowSynchronousEvents,
                        maxPayload: this.options.maxPayload,
                        skipUTF8Validation: this.options.skipUTF8Validation
                    });
                    if (this.clients) {
                        this.clients.add(h);
                        h.on("close", (() => {
                            this.clients.delete(h);
                            if (this._shouldEmitClose && !this.clients.size) {
                                process.nextTick(emitClose, this)
                            }
                        }))
                    }
                    l(h, i)
                }
            }

            e.exports = WebSocketServer;

            function addListeners(e, t) {
                for (const n of Object.keys(t)) e.on(n, t[n]);
                return function removeListeners() {
                    for (const n of Object.keys(t)) {
                        e.removeListener(n, t[n])
                    }
                }
            }

            function emitClose(e) {
                e._state = x;
                e.emit("close")
            }

            function socketOnError() {
                this.destroy()
            }

            function abortHandshake(e, t, n, i) {
                n = n || s.STATUS_CODES[t];
                i = {Connection: "close", "Content-Type": "text/html", "Content-Length": Buffer.byteLength(n), ...i};
                e.once("finish", e.destroy);
                e.end(`HTTP/1.1 ${t} ${s.STATUS_CODES[t]}\r\n` + Object.keys(i).map((e => `${e}: ${i[e]}`)).join("\r\n") + "\r\n\r\n" + n)
            }

            function abortHandshakeOrEmitwsClientError(e, t, n, i, s, o) {
                if (e.listenerCount("wsClientError")) {
                    const i = new Error(s);
                    Error.captureStackTrace(i, abortHandshakeOrEmitwsClientError);
                    e.emit("wsClientError", i, n, t)
                } else {
                    abortHandshake(n, i, s, o)
                }
            }
        }, 5033: (e, t, n) => {
            "use strict";
            const i = n(4434);
            const s = n(5692);
            const o = n(8611);
            const a = n(9278);
            const r = n(4756);
            const {randomBytes: c, createHash: l} = n(6982);
            const {Duplex: p, Readable: u} = n(2203);
            const {URL: d} = n(7016);
            const f = n(4536);
            const m = n(4413);
            const h = n(5693);
            const {isBlob: x} = n(8631);
            const {
                BINARY_TYPES: g,
                EMPTY_BUFFER: v,
                GUID: y,
                kForOnEventAttribute: b,
                kListener: w,
                kStatusCode: S,
                kWebSocket: _,
                NOOP: k
            } = n(8031);
            const {EventTarget: {addEventListener: E, removeEventListener: O}} = n(8666);
            const {format: C, parse: T} = n(247);
            const {toBuffer: F} = n(6523);
            const A = 30 * 1e3;
            const j = Symbol("kAborted");
            const R = [8, 13];
            const L = ["CONNECTING", "OPEN", "CLOSING", "CLOSED"];
            const P = /^[!#$%&'*+\-.0-9A-Z^_`|a-z~]+$/;

            class WebSocket extends i {
                constructor(e, t, n) {
                    super();
                    this._binaryType = g[0];
                    this._closeCode = 1006;
                    this._closeFrameReceived = false;
                    this._closeFrameSent = false;
                    this._closeMessage = v;
                    this._closeTimer = null;
                    this._errorEmitted = false;
                    this._extensions = {};
                    this._paused = false;
                    this._protocol = "";
                    this._readyState = WebSocket.CONNECTING;
                    this._receiver = null;
                    this._sender = null;
                    this._socket = null;
                    if (e !== null) {
                        this._bufferedAmount = 0;
                        this._isServer = false;
                        this._redirects = 0;
                        if (t === undefined) {
                            t = []
                        } else if (!Array.isArray(t)) {
                            if (typeof t === "object" && t !== null) {
                                n = t;
                                t = []
                            } else {
                                t = [t]
                            }
                        }
                        initAsClient(this, e, t, n)
                    } else {
                        this._autoPong = n.autoPong;
                        this._isServer = true
                    }
                }

                get binaryType() {
                    return this._binaryType
                }

                set binaryType(e) {
                    if (!g.includes(e)) return;
                    this._binaryType = e;
                    if (this._receiver) this._receiver._binaryType = e
                }

                get bufferedAmount() {
                    if (!this._socket) return this._bufferedAmount;
                    return this._socket._writableState.length + this._sender._bufferedBytes
                }

                get extensions() {
                    return Object.keys(this._extensions).join()
                }

                get isPaused() {
                    return this._paused
                }

                get onclose() {
                    return null
                }

                get onerror() {
                    return null
                }

                get onopen() {
                    return null
                }

                get onmessage() {
                    return null
                }

                get protocol() {
                    return this._protocol
                }

                get readyState() {
                    return this._readyState
                }

                get url() {
                    return this._url
                }

                setSocket(e, t, n) {
                    const i = new m({
                        allowSynchronousEvents: n.allowSynchronousEvents,
                        binaryType: this.binaryType,
                        extensions: this._extensions,
                        isServer: this._isServer,
                        maxPayload: n.maxPayload,
                        skipUTF8Validation: n.skipUTF8Validation
                    });
                    const s = new h(e, this._extensions, n.generateMask);
                    this._receiver = i;
                    this._sender = s;
                    this._socket = e;
                    i[_] = this;
                    s[_] = this;
                    e[_] = this;
                    i.on("conclude", receiverOnConclude);
                    i.on("drain", receiverOnDrain);
                    i.on("error", receiverOnError);
                    i.on("message", receiverOnMessage);
                    i.on("ping", receiverOnPing);
                    i.on("pong", receiverOnPong);
                    s.onerror = senderOnError;
                    if (e.setTimeout) e.setTimeout(0);
                    if (e.setNoDelay) e.setNoDelay();
                    if (t.length > 0) e.unshift(t);
                    e.on("close", socketOnClose);
                    e.on("data", socketOnData);
                    e.on("end", socketOnEnd);
                    e.on("error", socketOnError);
                    this._readyState = WebSocket.OPEN;
                    this.emit("open")
                }

                emitClose() {
                    if (!this._socket) {
                        this._readyState = WebSocket.CLOSED;
                        this.emit("close", this._closeCode, this._closeMessage);
                        return
                    }
                    if (this._extensions[f.extensionName]) {
                        this._extensions[f.extensionName].cleanup()
                    }
                    this._receiver.removeAllListeners();
                    this._readyState = WebSocket.CLOSED;
                    this.emit("close", this._closeCode, this._closeMessage)
                }

                close(e, t) {
                    if (this.readyState === WebSocket.CLOSED) return;
                    if (this.readyState === WebSocket.CONNECTING) {
                        const e = "WebSocket was closed before the connection was established";
                        abortHandshake(this, this._req, e);
                        return
                    }
                    if (this.readyState === WebSocket.CLOSING) {
                        if (this._closeFrameSent && (this._closeFrameReceived || this._receiver._writableState.errorEmitted)) {
                            this._socket.end()
                        }
                        return
                    }
                    this._readyState = WebSocket.CLOSING;
                    this._sender.close(e, t, !this._isServer, (e => {
                        if (e) return;
                        this._closeFrameSent = true;
                        if (this._closeFrameReceived || this._receiver._writableState.errorEmitted) {
                            this._socket.end()
                        }
                    }));
                    setCloseTimer(this)
                }

                pause() {
                    if (this.readyState === WebSocket.CONNECTING || this.readyState === WebSocket.CLOSED) {
                        return
                    }
                    this._paused = true;
                    this._socket.pause()
                }

                ping(e, t, n) {
                    if (this.readyState === WebSocket.CONNECTING) {
                        throw new Error("WebSocket is not open: readyState 0 (CONNECTING)")
                    }
                    if (typeof e === "function") {
                        n = e;
                        e = t = undefined
                    } else if (typeof t === "function") {
                        n = t;
                        t = undefined
                    }
                    if (typeof e === "number") e = e.toString();
                    if (this.readyState !== WebSocket.OPEN) {
                        sendAfterClose(this, e, n);
                        return
                    }
                    if (t === undefined) t = !this._isServer;
                    this._sender.ping(e || v, t, n)
                }

                pong(e, t, n) {
                    if (this.readyState === WebSocket.CONNECTING) {
                        throw new Error("WebSocket is not open: readyState 0 (CONNECTING)")
                    }
                    if (typeof e === "function") {
                        n = e;
                        e = t = undefined
                    } else if (typeof t === "function") {
                        n = t;
                        t = undefined
                    }
                    if (typeof e === "number") e = e.toString();
                    if (this.readyState !== WebSocket.OPEN) {
                        sendAfterClose(this, e, n);
                        return
                    }
                    if (t === undefined) t = !this._isServer;
                    this._sender.pong(e || v, t, n)
                }

                resume() {
                    if (this.readyState === WebSocket.CONNECTING || this.readyState === WebSocket.CLOSED) {
                        return
                    }
                    this._paused = false;
                    if (!this._receiver._writableState.needDrain) this._socket.resume()
                }

                send(e, t, n) {
                    if (this.readyState === WebSocket.CONNECTING) {
                        throw new Error("WebSocket is not open: readyState 0 (CONNECTING)")
                    }
                    if (typeof t === "function") {
                        n = t;
                        t = {}
                    }
                    if (typeof e === "number") e = e.toString();
                    if (this.readyState !== WebSocket.OPEN) {
                        sendAfterClose(this, e, n);
                        return
                    }
                    const i = {binary: typeof e !== "string", mask: !this._isServer, compress: true, fin: true, ...t};
                    if (!this._extensions[f.extensionName]) {
                        i.compress = false
                    }
                    this._sender.send(e || v, i, n)
                }

                terminate() {
                    if (this.readyState === WebSocket.CLOSED) return;
                    if (this.readyState === WebSocket.CONNECTING) {
                        const e = "WebSocket was closed before the connection was established";
                        abortHandshake(this, this._req, e);
                        return
                    }
                    if (this._socket) {
                        this._readyState = WebSocket.CLOSING;
                        this._socket.destroy()
                    }
                }
            }

            Object.defineProperty(WebSocket, "CONNECTING", {enumerable: true, value: L.indexOf("CONNECTING")});
            Object.defineProperty(WebSocket.prototype, "CONNECTING", {
                enumerable: true,
                value: L.indexOf("CONNECTING")
            });
            Object.defineProperty(WebSocket, "OPEN", {enumerable: true, value: L.indexOf("OPEN")});
            Object.defineProperty(WebSocket.prototype, "OPEN", {enumerable: true, value: L.indexOf("OPEN")});
            Object.defineProperty(WebSocket, "CLOSING", {enumerable: true, value: L.indexOf("CLOSING")});
            Object.defineProperty(WebSocket.prototype, "CLOSING", {enumerable: true, value: L.indexOf("CLOSING")});
            Object.defineProperty(WebSocket, "CLOSED", {enumerable: true, value: L.indexOf("CLOSED")});
            Object.defineProperty(WebSocket.prototype, "CLOSED", {enumerable: true, value: L.indexOf("CLOSED")});
            ["binaryType", "bufferedAmount", "extensions", "isPaused", "protocol", "readyState", "url"].forEach((e => {
                Object.defineProperty(WebSocket.prototype, e, {enumerable: true})
            }));
            ["open", "error", "close", "message"].forEach((e => {
                Object.defineProperty(WebSocket.prototype, `on${e}`, {
                    enumerable: true, get() {
                        for (const t of this.listeners(e)) {
                            if (t[b]) return t[w]
                        }
                        return null
                    }, set(t) {
                        for (const t of this.listeners(e)) {
                            if (t[b]) {
                                this.removeListener(e, t);
                                break
                            }
                        }
                        if (typeof t !== "function") return;
                        this.addEventListener(e, t, {[b]: true})
                    }
                })
            }));
            WebSocket.prototype.addEventListener = E;
            WebSocket.prototype.removeEventListener = O;
            e.exports = WebSocket;

            function initAsClient(e, t, n, i) {
                const a = {
                    allowSynchronousEvents: true,
                    autoPong: true,
                    protocolVersion: R[1],
                    maxPayload: 100 * 1024 * 1024,
                    skipUTF8Validation: false,
                    perMessageDeflate: true,
                    followRedirects: false,
                    maxRedirects: 10, ...i,
                    socketPath: undefined,
                    hostname: undefined,
                    protocol: undefined,
                    timeout: undefined,
                    method: "GET",
                    host: undefined,
                    path: undefined,
                    port: undefined
                };
                e._autoPong = a.autoPong;
                if (!R.includes(a.protocolVersion)) {
                    throw new RangeError(`Unsupported protocol version: ${a.protocolVersion} ` + `(supported versions: ${R.join(", ")})`)
                }
                let r;
                if (t instanceof d) {
                    r = t
                } else {
                    try {
                        r = new d(t)
                    } catch (e) {
                        throw new SyntaxError(`Invalid URL: ${t}`)
                    }
                }
                if (r.protocol === "http:") {
                    r.protocol = "ws:"
                } else if (r.protocol === "https:") {
                    r.protocol = "wss:"
                }
                e._url = r.href;
                const p = r.protocol === "wss:";
                const u = r.protocol === "ws+unix:";
                let m;
                if (r.protocol !== "ws:" && !p && !u) {
                    m = 'The URL\'s protocol must be one of "ws:", "wss:", ' + '"http:", "https:", or "ws+unix:"'
                } else if (u && !r.pathname) {
                    m = "The URL's pathname is empty"
                } else if (r.hash) {
                    m = "The URL contains a fragment identifier"
                }
                if (m) {
                    const t = new SyntaxError(m);
                    if (e._redirects === 0) {
                        throw t
                    } else {
                        emitErrorAndClose(e, t);
                        return
                    }
                }
                const h = p ? 443 : 80;
                const x = c(16).toString("base64");
                const g = p ? s.request : o.request;
                const v = new Set;
                let b;
                a.createConnection = a.createConnection || (p ? tlsConnect : netConnect);
                a.defaultPort = a.defaultPort || h;
                a.port = r.port || h;
                a.host = r.hostname.startsWith("[") ? r.hostname.slice(1, -1) : r.hostname;
                a.headers = {
                    ...a.headers,
                    "Sec-WebSocket-Version": a.protocolVersion,
                    "Sec-WebSocket-Key": x,
                    Connection: "Upgrade",
                    Upgrade: "websocket"
                };
                a.path = r.pathname + r.search;
                a.timeout = a.handshakeTimeout;
                if (a.perMessageDeflate) {
                    b = new f(a.perMessageDeflate !== true ? a.perMessageDeflate : {}, false, a.maxPayload);
                    a.headers["Sec-WebSocket-Extensions"] = C({[f.extensionName]: b.offer()})
                }
                if (n.length) {
                    for (const e of n) {
                        if (typeof e !== "string" || !P.test(e) || v.has(e)) {
                            throw new SyntaxError("An invalid or duplicated subprotocol was specified")
                        }
                        v.add(e)
                    }
                    a.headers["Sec-WebSocket-Protocol"] = n.join(",")
                }
                if (a.origin) {
                    if (a.protocolVersion < 13) {
                        a.headers["Sec-WebSocket-Origin"] = a.origin
                    } else {
                        a.headers.Origin = a.origin
                    }
                }
                if (r.username || r.password) {
                    a.auth = `${r.username}:${r.password}`
                }
                if (u) {
                    const e = a.path.split(":");
                    a.socketPath = e[0];
                    a.path = e[1]
                }
                let w;
                if (a.followRedirects) {
                    if (e._redirects === 0) {
                        e._originalIpc = u;
                        e._originalSecure = p;
                        e._originalHostOrSocketPath = u ? a.socketPath : r.host;
                        const t = i && i.headers;
                        i = {...i, headers: {}};
                        if (t) {
                            for (const [e, n] of Object.entries(t)) {
                                i.headers[e.toLowerCase()] = n
                            }
                        }
                    } else if (e.listenerCount("redirect") === 0) {
                        const t = u ? e._originalIpc ? a.socketPath === e._originalHostOrSocketPath : false : e._originalIpc ? false : r.host === e._originalHostOrSocketPath;
                        if (!t || e._originalSecure && !p) {
                            delete a.headers.authorization;
                            delete a.headers.cookie;
                            if (!t) delete a.headers.host;
                            a.auth = undefined
                        }
                    }
                    if (a.auth && !i.headers.authorization) {
                        i.headers.authorization = "Basic " + Buffer.from(a.auth).toString("base64")
                    }
                    w = e._req = g(a);
                    if (e._redirects) {
                        e.emit("redirect", e.url, w)
                    }
                } else {
                    w = e._req = g(a)
                }
                if (a.timeout) {
                    w.on("timeout", (() => {
                        abortHandshake(e, w, "Opening handshake has timed out")
                    }))
                }
                w.on("error", (t => {
                    if (w === null || w[j]) return;
                    w = e._req = null;
                    emitErrorAndClose(e, t)
                }));
                w.on("response", (s => {
                    const o = s.headers.location;
                    const r = s.statusCode;
                    if (o && a.followRedirects && r >= 300 && r < 400) {
                        if (++e._redirects > a.maxRedirects) {
                            abortHandshake(e, w, "Maximum redirects exceeded");
                            return
                        }
                        w.abort();
                        let s;
                        try {
                            s = new d(o, t)
                        } catch (t) {
                            const n = new SyntaxError(`Invalid URL: ${o}`);
                            emitErrorAndClose(e, n);
                            return
                        }
                        initAsClient(e, s, n, i)
                    } else if (!e.emit("unexpected-response", w, s)) {
                        abortHandshake(e, w, `Unexpected server response: ${s.statusCode}`)
                    }
                }));
                w.on("upgrade", ((t, n, i) => {
                    e.emit("upgrade", t);
                    if (e.readyState !== WebSocket.CONNECTING) return;
                    w = e._req = null;
                    const s = t.headers.upgrade;
                    if (s === undefined || s.toLowerCase() !== "websocket") {
                        abortHandshake(e, n, "Invalid Upgrade header");
                        return
                    }
                    const o = l("sha1").update(x + y).digest("base64");
                    if (t.headers["sec-websocket-accept"] !== o) {
                        abortHandshake(e, n, "Invalid Sec-WebSocket-Accept header");
                        return
                    }
                    const r = t.headers["sec-websocket-protocol"];
                    let c;
                    if (r !== undefined) {
                        if (!v.size) {
                            c = "Server sent a subprotocol but none was requested"
                        } else if (!v.has(r)) {
                            c = "Server sent an invalid subprotocol"
                        }
                    } else if (v.size) {
                        c = "Server sent no subprotocol"
                    }
                    if (c) {
                        abortHandshake(e, n, c);
                        return
                    }
                    if (r) e._protocol = r;
                    const p = t.headers["sec-websocket-extensions"];
                    if (p !== undefined) {
                        if (!b) {
                            const t = "Server sent a Sec-WebSocket-Extensions header but no extension " + "was requested";
                            abortHandshake(e, n, t);
                            return
                        }
                        let t;
                        try {
                            t = T(p)
                        } catch (t) {
                            const i = "Invalid Sec-WebSocket-Extensions header";
                            abortHandshake(e, n, i);
                            return
                        }
                        const i = Object.keys(t);
                        if (i.length !== 1 || i[0] !== f.extensionName) {
                            const t = "Server indicated an extension that was not requested";
                            abortHandshake(e, n, t);
                            return
                        }
                        try {
                            b.accept(t[f.extensionName])
                        } catch (t) {
                            const i = "Invalid Sec-WebSocket-Extensions header";
                            abortHandshake(e, n, i);
                            return
                        }
                        e._extensions[f.extensionName] = b
                    }
                    e.setSocket(n, i, {
                        allowSynchronousEvents: a.allowSynchronousEvents,
                        generateMask: a.generateMask,
                        maxPayload: a.maxPayload,
                        skipUTF8Validation: a.skipUTF8Validation
                    })
                }));
                if (a.finishRequest) {
                    a.finishRequest(w, e)
                } else {
                    w.end()
                }
            }

            function emitErrorAndClose(e, t) {
                e._readyState = WebSocket.CLOSING;
                e._errorEmitted = true;
                e.emit("error", t);
                e.emitClose()
            }

            function netConnect(e) {
                e.path = e.socketPath;
                return a.connect(e)
            }

            function tlsConnect(e) {
                e.path = undefined;
                if (!e.servername && e.servername !== "") {
                    e.servername = a.isIP(e.host) ? "" : e.host
                }
                return r.connect(e)
            }

            function abortHandshake(e, t, n) {
                e._readyState = WebSocket.CLOSING;
                const i = new Error(n);
                Error.captureStackTrace(i, abortHandshake);
                if (t.setHeader) {
                    t[j] = true;
                    t.abort();
                    if (t.socket && !t.socket.destroyed) {
                        t.socket.destroy()
                    }
                    process.nextTick(emitErrorAndClose, e, i)
                } else {
                    t.destroy(i);
                    t.once("error", e.emit.bind(e, "error"));
                    t.once("close", e.emitClose.bind(e))
                }
            }

            function sendAfterClose(e, t, n) {
                if (t) {
                    const n = x(t) ? t.size : F(t).length;
                    if (e._socket) e._sender._bufferedBytes += n; else e._bufferedAmount += n
                }
                if (n) {
                    const t = new Error(`WebSocket is not open: readyState ${e.readyState} ` + `(${L[e.readyState]})`);
                    process.nextTick(n, t)
                }
            }

            function receiverOnConclude(e, t) {
                const n = this[_];
                n._closeFrameReceived = true;
                n._closeMessage = t;
                n._closeCode = e;
                if (n._socket[_] === undefined) return;
                n._socket.removeListener("data", socketOnData);
                process.nextTick(resume, n._socket);
                if (e === 1005) n.close(); else n.close(e, t)
            }

            function receiverOnDrain() {
                const e = this[_];
                if (!e.isPaused) e._socket.resume()
            }

            function receiverOnError(e) {
                const t = this[_];
                if (t._socket[_] !== undefined) {
                    t._socket.removeListener("data", socketOnData);
                    process.nextTick(resume, t._socket);
                    t.close(e[S])
                }
                if (!t._errorEmitted) {
                    t._errorEmitted = true;
                    t.emit("error", e)
                }
            }

            function receiverOnFinish() {
                this[_].emitClose()
            }

            function receiverOnMessage(e, t) {
                this[_].emit("message", e, t)
            }

            function receiverOnPing(e) {
                const t = this[_];
                if (t._autoPong) t.pong(e, !this._isServer, k);
                t.emit("ping", e)
            }

            function receiverOnPong(e) {
                this[_].emit("pong", e)
            }

            function resume(e) {
                e.resume()
            }

            function senderOnError(e) {
                const t = this[_];
                if (t.readyState === WebSocket.CLOSED) return;
                if (t.readyState === WebSocket.OPEN) {
                    t._readyState = WebSocket.CLOSING;
                    setCloseTimer(t)
                }
                this._socket.end();
                if (!t._errorEmitted) {
                    t._errorEmitted = true;
                    t.emit("error", e)
                }
            }

            function setCloseTimer(e) {
                e._closeTimer = setTimeout(e._socket.destroy.bind(e._socket), A)
            }

            function socketOnClose() {
                const e = this[_];
                this.removeListener("close", socketOnClose);
                this.removeListener("data", socketOnData);
                this.removeListener("end", socketOnEnd);
                e._readyState = WebSocket.CLOSING;
                let t;
                if (!this._readableState.endEmitted && !e._closeFrameReceived && !e._receiver._writableState.errorEmitted && (t = e._socket.read()) !== null) {
                    e._receiver.write(t)
                }
                e._receiver.end();
                this[_] = undefined;
                clearTimeout(e._closeTimer);
                if (e._receiver._writableState.finished || e._receiver._writableState.errorEmitted) {
                    e.emitClose()
                } else {
                    e._receiver.on("error", receiverOnFinish);
                    e._receiver.on("finish", receiverOnFinish)
                }
            }

            function socketOnData(e) {
                if (!this[_]._receiver.write(e)) {
                    this.pause()
                }
            }

            function socketOnEnd() {
                const e = this[_];
                e._readyState = WebSocket.CLOSING;
                e._receiver.end();
                this.end()
            }

            function socketOnError() {
                const e = this[_];
                this.removeListener("error", socketOnError);
                this.on("error", k);
                if (e) {
                    e._readyState = WebSocket.CLOSING;
                    this.destroy()
                }
            }
        }, 895: (e, t, n) => {
            const i = new Date;
            const s = n(364).configure({
                appenders: {
                    file: {
                        type: "file",
                        filename: `./log/${i.getFullYear()}.${i.getMonth() + 1}.${i.getDate()}.log`
                    }
                }, categories: {default: {appenders: ["file"], level: "info"}}
            }).getLogger();
            process.on("uncaughtException", (e => {
                s.error("Uncaught Exception:", e)
            }));
            const o = n(3018);

            class Plugins {
                static language = JSON.parse(process.argv[9]).application.language;
                static globalSettings = {};
                getGlobalSettingsFlag = true;

                constructor() {
                    if (Plugins.instance) {
                        return Plugins.instance
                    }
                    this.ws = new o("ws://127.0.0.1:" + process.argv[3]);
                    this.ws.on("open", (() => this.ws.send(JSON.stringify({
                        uuid: process.argv[5],
                        event: process.argv[7]
                    }))));
                    this.ws.on("close", process.exit);
                    this.ws.on("message", (e => {
                        if (this.getGlobalSettingsFlag) {
                            this.getGlobalSettingsFlag = false;
                            this.getGlobalSettings()
                        }
                        const t = JSON.parse(e.toString());
                        const n = t.action?.split(".").pop();
                        this[n]?.[t.event]?.(t);
                        if (t.event === "didReceiveGlobalSettings") {
                            Plugins.globalSettings = t.payload.settings
                        }
                        this[t.event]?.(t)
                    }));
                    Plugins.instance = this
                }

                setGlobalSettings(e) {
                    Plugins.globalSettings = e;
                    this.ws.send(JSON.stringify({event: "setGlobalSettings", context: process.argv[5], payload: e}))
                }

                getGlobalSettings() {
                    this.ws.send(JSON.stringify({event: "getGlobalSettings", context: process.argv[5]}))
                }

                setTitle(e, t, n = 0, i = 6) {
                    let s = null;
                    if (n && t) {
                        let e = 1, o = t.split("");
                        o.forEach(((t, o) => {
                            if (e < n && o >= e * i) {
                                e++;
                                s += "\n"
                            }
                            if (e <= n && o < e * i) {
                                s += t
                            }
                        }));
                        if (o.length > n * i) {
                            s = s.substring(0, s.length - 1);
                            s += ".."
                        }
                    }
                    this.ws.send(JSON.stringify({
                        event: "setTitle",
                        context: e,
                        payload: {target: 0, title: s || t + ""}
                    }))
                }

                setImage(e, t) {
                    this.ws.send(JSON.stringify({event: "setImage", context: e, payload: {target: 0, image: t}}))
                }

                setState(e, t) {
                    this.ws.send(JSON.stringify({event: "setState", context: e, payload: {state: t}}))
                }

                setSettings(e, t) {
                    this.ws.send(JSON.stringify({event: "setSettings", context: e, payload: t}))
                }

                showAlert(e) {
                    this.ws.send(JSON.stringify({event: "showAlert", context: e}))
                }

                showOk(e) {
                    this.ws.send(JSON.stringify({event: "showOk", context: e}))
                }

                sendToPropertyInspector(e) {
                    this.ws.send(JSON.stringify({
                        action: Actions.currentAction,
                        context: Actions.currentContext,
                        payload: e,
                        event: "sendToPropertyInspector"
                    }))
                }

                openUrl(e) {
                    this.ws.send(JSON.stringify({event: "openUrl", payload: {url: e}}))
                }
            }

            class Actions {
                constructor(e) {
                    this.data = {};
                    this.default = {};
                    Object.assign(this, e)
                }

                static currentAction = null;
                static currentContext = null;
                static actions = {};

                propertyInspectorDidAppear(e) {
                    Actions.currentAction = e.action;
                    Actions.currentContext = e.context;
                    this._propertyInspectorDidAppear?.(e)
                }

                willAppear(e) {
                    Plugins.globalContext = e.context;
                    Actions.actions[e.context] = e.action;
                    const {context: t, payload: {settings: n}} = e;
                    this.data[t] = Object.assign({...this.default}, n);
                    this._willAppear?.(e)
                }

                didReceiveSettings(e) {
                    this.data[e.context] = e.payload.settings;
                    this._didReceiveSettings?.(e)
                }

                willDisappear(e) {
                    this._willDisappear?.(e);
                    delete this.data[e.context]
                }
            }

            class EventEmitter {
                constructor() {
                    this.events = {}
                }

                subscribe(e, t) {
                    if (!this.events[e]) {
                        this.events[e] = []
                    }
                    this.events[e].push(t)
                }

                unsubscribe(e, t) {
                    if (!this.events[e]) return;
                    this.events[e] = this.events[e].filter((e => e !== t))
                }

                emit(e, t) {
                    if (!this.events[e]) return;
                    this.events[e].forEach((e => e(t)))
                }
            }

            e.exports = {log: s, Plugins: Plugins, Actions: Actions, EventEmitter: EventEmitter}
        }, 6687: module => {
            module.exports = eval("require")("bufferutil")
        }, 2963: module => {
            module.exports = eval("require")("supports-color")
        }, 8870: module => {
            module.exports = eval("require")("utf-8-validate")
        }, 2613: e => {
            "use strict";
            e.exports = require("assert")
        }, 181: e => {
            "use strict";
            e.exports = require("buffer")
        }, 5317: e => {
            "use strict";
            e.exports = require("child_process")
        }, 9907: e => {
            "use strict";
            e.exports = require("cluster")
        }, 9140: e => {
            "use strict";
            e.exports = require("constants")
        }, 6982: e => {
            "use strict";
            e.exports = require("crypto")
        }, 4434: e => {
            "use strict";
            e.exports = require("events")
        }, 9896: e => {
            "use strict";
            e.exports = require("fs")
        }, 8611: e => {
            "use strict";
            e.exports = require("http")
        }, 5692: e => {
            "use strict";
            e.exports = require("https")
        }, 9278: e => {
            "use strict";
            e.exports = require("net")
        }, 857: e => {
            "use strict";
            e.exports = require("os")
        }, 6928: e => {
            "use strict";
            e.exports = require("path")
        }, 2203: e => {
            "use strict";
            e.exports = require("stream")
        }, 4756: e => {
            "use strict";
            e.exports = require("tls")
        }, 2018: e => {
            "use strict";
            e.exports = require("tty")
        }, 7016: e => {
            "use strict";
            e.exports = require("url")
        }, 9023: e => {
            "use strict";
            e.exports = require("util")
        }, 3106: e => {
            "use strict";
            e.exports = require("zlib")
        }, 638: (e, t) => {
            "use strict";
            const {parse: n, stringify: i} = JSON;
            const {keys: s} = Object;
            const o = String;
            const a = "string";
            const r = {};
            const c = "object";
            const noop = (e, t) => t;
            const primitives = e => e instanceof o ? o(e) : e;
            const Primitives = (e, t) => typeof t === a ? new o(t) : t;
            const revive = (e, t, n, i) => {
                const a = [];
                for (let l = s(n), {length: p} = l, u = 0; u < p; u++) {
                    const s = l[u];
                    const p = n[s];
                    if (p instanceof o) {
                        const o = e[p];
                        if (typeof o === c && !t.has(o)) {
                            t.add(o);
                            n[s] = r;
                            a.push({k: s, a: [e, t, o, i]})
                        } else n[s] = i.call(n, s, o)
                    } else if (n[s] !== r) n[s] = i.call(n, s, p)
                }
                for (let {length: e} = a, t = 0; t < e; t++) {
                    const {k: e, a: s} = a[t];
                    n[e] = i.call(n, e, revive.apply(null, s))
                }
                return n
            };
            const set = (e, t, n) => {
                const i = o(t.push(n) - 1);
                e.set(n, i);
                return i
            };
            const parse = (e, t) => {
                const i = n(e, Primitives).map(primitives);
                const s = i[0];
                const o = t || noop;
                const a = typeof s === c && s ? revive(i, new Set, s, o) : s;
                return o.call({"": a}, "", a)
            };
            t.parse = parse;
            const stringify = (e, t, n) => {
                const s = t && typeof t === c ? (e, n) => e === "" || -1 < t.indexOf(e) ? n : void 0 : t || noop;
                const o = new Map;
                const r = [];
                const l = [];
                let p = +set(o, r, s.call({"": e}, "", e));
                let u = !p;
                while (p < r.length) {
                    u = true;
                    l[p] = i(r[p++], replace, n)
                }
                return "[" + l.join(",") + "]";

                function replace(e, t) {
                    if (u) {
                        u = !u;
                        return t
                    }
                    const n = s.call(this, e, t);
                    switch (typeof n) {
                        case c:
                            if (n === null) return n;
                        case a:
                            return o.get(n) || set(o, r, n)
                    }
                    return n
                }
            };
            t.stringify = stringify;
            const toJSON = e => n(stringify(e));
            t.toJSON = toJSON;
            const fromJSON = e => parse(i(e));
            t.fromJSON = fromJSON
        }, 7977: (e, t, n) => {
            "use strict";
            /*! Axios v1.11.0 Copyright (c) 2025 Matt Zabriskie and contributors */
            const i = n(3846);
            const s = n(6982);
            const o = n(7016);
            const a = n(6801);
            const r = n(8611);
            const c = n(5692);
            const l = n(9023);
            const p = n(8853);
            const u = n(3106);
            const d = n(2203);
            const f = n(4434);

            function _interopDefaultLegacy(e) {
                return e && typeof e === "object" && "default" in e ? e : {default: e}
            }

            const m = _interopDefaultLegacy(i);
            const h = _interopDefaultLegacy(s);
            const x = _interopDefaultLegacy(o);
            const g = _interopDefaultLegacy(a);
            const v = _interopDefaultLegacy(r);
            const y = _interopDefaultLegacy(c);
            const b = _interopDefaultLegacy(l);
            const w = _interopDefaultLegacy(p);
            const S = _interopDefaultLegacy(u);
            const _ = _interopDefaultLegacy(d);

            function bind(e, t) {
                return function wrap() {
                    return e.apply(t, arguments)
                }
            }

            const {toString: k} = Object.prototype;
            const {getPrototypeOf: E} = Object;
            const {iterator: O, toStringTag: C} = Symbol;
            const T = (e => t => {
                const n = k.call(t);
                return e[n] || (e[n] = n.slice(8, -1).toLowerCase())
            })(Object.create(null));
            const kindOfTest = e => {
                e = e.toLowerCase();
                return t => T(t) === e
            };
            const typeOfTest = e => t => typeof t === e;
            const {isArray: F} = Array;
            const A = typeOfTest("undefined");

            function isBuffer(e) {
                return e !== null && !A(e) && e.constructor !== null && !A(e.constructor) && L(e.constructor.isBuffer) && e.constructor.isBuffer(e)
            }

            const j = kindOfTest("ArrayBuffer");

            function isArrayBufferView(e) {
                let t;
                if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
                    t = ArrayBuffer.isView(e)
                } else {
                    t = e && e.buffer && j(e.buffer)
                }
                return t
            }

            const R = typeOfTest("string");
            const L = typeOfTest("function");
            const P = typeOfTest("number");
            const isObject = e => e !== null && typeof e === "object";
            const isBoolean = e => e === true || e === false;
            const isPlainObject = e => {
                if (T(e) !== "object") {
                    return false
                }
                const t = E(e);
                return (t === null || t === Object.prototype || Object.getPrototypeOf(t) === null) && !(C in e) && !(O in e)
            };
            const isEmptyObject = e => {
                if (!isObject(e) || isBuffer(e)) {
                    return false
                }
                try {
                    return Object.keys(e).length === 0 && Object.getPrototypeOf(e) === Object.prototype
                } catch (e) {
                    return false
                }
            };
            const D = kindOfTest("Date");
            const N = kindOfTest("File");
            const I = kindOfTest("Blob");
            const B = kindOfTest("FileList");
            const isStream = e => isObject(e) && L(e.pipe);
            const isFormData = e => {
                let t;
                return e && (typeof FormData === "function" && e instanceof FormData || L(e.append) && ((t = T(e)) === "formdata" || t === "object" && L(e.toString) && e.toString() === "[object FormData]"))
            };
            const M = kindOfTest("URLSearchParams");
            const [U, z, $, q] = ["ReadableStream", "Request", "Response", "Headers"].map(kindOfTest);
            const trim = e => e.trim ? e.trim() : e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");

            function forEach(e, t, {allOwnKeys: n = false} = {}) {
                if (e === null || typeof e === "undefined") {
                    return
                }
                let i;
                let s;
                if (typeof e !== "object") {
                    e = [e]
                }
                if (F(e)) {
                    for (i = 0, s = e.length; i < s; i++) {
                        t.call(null, e[i], i, e)
                    }
                } else {
                    if (isBuffer(e)) {
                        return
                    }
                    const s = n ? Object.getOwnPropertyNames(e) : Object.keys(e);
                    const o = s.length;
                    let a;
                    for (i = 0; i < o; i++) {
                        a = s[i];
                        t.call(null, e[a], a, e)
                    }
                }
            }

            function findKey(e, t) {
                if (isBuffer(e)) {
                    return null
                }
                t = t.toLowerCase();
                const n = Object.keys(e);
                let i = n.length;
                let s;
                while (i-- > 0) {
                    s = n[i];
                    if (t === s.toLowerCase()) {
                        return s
                    }
                }
                return null
            }

            const W = (() => {
                if (typeof globalThis !== "undefined") return globalThis;
                return typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : global
            })();
            const isContextDefined = e => !A(e) && e !== W;

            function merge() {
                const {caseless: e} = isContextDefined(this) && this || {};
                const t = {};
                const assignValue = (n, i) => {
                    const s = e && findKey(t, i) || i;
                    if (isPlainObject(t[s]) && isPlainObject(n)) {
                        t[s] = merge(t[s], n)
                    } else if (isPlainObject(n)) {
                        t[s] = merge({}, n)
                    } else if (F(n)) {
                        t[s] = n.slice()
                    } else {
                        t[s] = n
                    }
                };
                for (let e = 0, t = arguments.length; e < t; e++) {
                    arguments[e] && forEach(arguments[e], assignValue)
                }
                return t
            }

            const extend = (e, t, n, {allOwnKeys: i} = {}) => {
                forEach(t, ((t, i) => {
                    if (n && L(t)) {
                        e[i] = bind(t, n)
                    } else {
                        e[i] = t
                    }
                }), {allOwnKeys: i});
                return e
            };
            const stripBOM = e => {
                if (e.charCodeAt(0) === 65279) {
                    e = e.slice(1)
                }
                return e
            };
            const inherits = (e, t, n, i) => {
                e.prototype = Object.create(t.prototype, i);
                e.prototype.constructor = e;
                Object.defineProperty(e, "super", {value: t.prototype});
                n && Object.assign(e.prototype, n)
            };
            const toFlatObject = (e, t, n, i) => {
                let s;
                let o;
                let a;
                const r = {};
                t = t || {};
                if (e == null) return t;
                do {
                    s = Object.getOwnPropertyNames(e);
                    o = s.length;
                    while (o-- > 0) {
                        a = s[o];
                        if ((!i || i(a, e, t)) && !r[a]) {
                            t[a] = e[a];
                            r[a] = true
                        }
                    }
                    e = n !== false && E(e)
                } while (e && (!n || n(e, t)) && e !== Object.prototype);
                return t
            };
            const endsWith = (e, t, n) => {
                e = String(e);
                if (n === undefined || n > e.length) {
                    n = e.length
                }
                n -= t.length;
                const i = e.indexOf(t, n);
                return i !== -1 && i === n
            };
            const toArray = e => {
                if (!e) return null;
                if (F(e)) return e;
                let t = e.length;
                if (!P(t)) return null;
                const n = new Array(t);
                while (t-- > 0) {
                    n[t] = e[t]
                }
                return n
            };
            const H = (e => t => e && t instanceof e)(typeof Uint8Array !== "undefined" && E(Uint8Array));
            const forEachEntry = (e, t) => {
                const n = e && e[O];
                const i = n.call(e);
                let s;
                while ((s = i.next()) && !s.done) {
                    const n = s.value;
                    t.call(e, n[0], n[1])
                }
            };
            const matchAll = (e, t) => {
                let n;
                const i = [];
                while ((n = e.exec(t)) !== null) {
                    i.push(n)
                }
                return i
            };
            const G = kindOfTest("HTMLFormElement");
            const toCamelCase = e => e.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g, (function replacer(e, t, n) {
                return t.toUpperCase() + n
            }));
            const V = (({hasOwnProperty: e}) => (t, n) => e.call(t, n))(Object.prototype);
            const J = kindOfTest("RegExp");
            const reduceDescriptors = (e, t) => {
                const n = Object.getOwnPropertyDescriptors(e);
                const i = {};
                forEach(n, ((n, s) => {
                    let o;
                    if ((o = t(n, s, e)) !== false) {
                        i[s] = o || n
                    }
                }));
                Object.defineProperties(e, i)
            };
            const freezeMethods = e => {
                reduceDescriptors(e, ((t, n) => {
                    if (L(e) && ["arguments", "caller", "callee"].indexOf(n) !== -1) {
                        return false
                    }
                    const i = e[n];
                    if (!L(i)) return;
                    t.enumerable = false;
                    if ("writable" in t) {
                        t.writable = false;
                        return
                    }
                    if (!t.set) {
                        t.set = () => {
                            throw Error("Can not rewrite read-only method '" + n + "'")
                        }
                    }
                }))
            };
            const toObjectSet = (e, t) => {
                const n = {};
                const define = e => {
                    e.forEach((e => {
                        n[e] = true
                    }))
                };
                F(e) ? define(e) : define(String(e).split(t));
                return n
            };
            const noop = () => {
            };
            const toFiniteNumber = (e, t) => e != null && Number.isFinite(e = +e) ? e : t;

            function isSpecCompliantForm(e) {
                return !!(e && L(e.append) && e[C] === "FormData" && e[O])
            }

            const toJSONObject = e => {
                const t = new Array(10);
                const visit = (e, n) => {
                    if (isObject(e)) {
                        if (t.indexOf(e) >= 0) {
                            return
                        }
                        if (isBuffer(e)) {
                            return e
                        }
                        if (!("toJSON" in e)) {
                            t[n] = e;
                            const i = F(e) ? [] : {};
                            forEach(e, ((e, t) => {
                                const s = visit(e, n + 1);
                                !A(s) && (i[t] = s)
                            }));
                            t[n] = undefined;
                            return i
                        }
                    }
                    return e
                };
                return visit(e, 0)
            };
            const K = kindOfTest("AsyncFunction");
            const isThenable = e => e && (isObject(e) || L(e)) && L(e.then) && L(e.catch);
            const Y = ((e, t) => {
                if (e) {
                    return setImmediate
                }
                return t ? ((e, t) => {
                    W.addEventListener("message", (({source: n, data: i}) => {
                        if (n === W && i === e) {
                            t.length && t.shift()()
                        }
                    }), false);
                    return n => {
                        t.push(n);
                        W.postMessage(e, "*")
                    }
                })(`axios@${Math.random()}`, []) : e => setTimeout(e)
            })(typeof setImmediate === "function", L(W.postMessage));
            const Z = typeof queueMicrotask !== "undefined" ? queueMicrotask.bind(W) : typeof process !== "undefined" && process.nextTick || Y;
            const isIterable = e => e != null && L(e[O]);
            const X = {
                isArray: F,
                isArrayBuffer: j,
                isBuffer: isBuffer,
                isFormData: isFormData,
                isArrayBufferView: isArrayBufferView,
                isString: R,
                isNumber: P,
                isBoolean: isBoolean,
                isObject: isObject,
                isPlainObject: isPlainObject,
                isEmptyObject: isEmptyObject,
                isReadableStream: U,
                isRequest: z,
                isResponse: $,
                isHeaders: q,
                isUndefined: A,
                isDate: D,
                isFile: N,
                isBlob: I,
                isRegExp: J,
                isFunction: L,
                isStream: isStream,
                isURLSearchParams: M,
                isTypedArray: H,
                isFileList: B,
                forEach: forEach,
                merge: merge,
                extend: extend,
                trim: trim,
                stripBOM: stripBOM,
                inherits: inherits,
                toFlatObject: toFlatObject,
                kindOf: T,
                kindOfTest: kindOfTest,
                endsWith: endsWith,
                toArray: toArray,
                forEachEntry: forEachEntry,
                matchAll: matchAll,
                isHTMLForm: G,
                hasOwnProperty: V,
                hasOwnProp: V,
                reduceDescriptors: reduceDescriptors,
                freezeMethods: freezeMethods,
                toObjectSet: toObjectSet,
                toCamelCase: toCamelCase,
                noop: noop,
                toFiniteNumber: toFiniteNumber,
                findKey: findKey,
                global: W,
                isContextDefined: isContextDefined,
                isSpecCompliantForm: isSpecCompliantForm,
                toJSONObject: toJSONObject,
                isAsyncFn: K,
                isThenable: isThenable,
                setImmediate: Y,
                asap: Z,
                isIterable: isIterable
            };

            function AxiosError(e, t, n, i, s) {
                Error.call(this);
                if (Error.captureStackTrace) {
                    Error.captureStackTrace(this, this.constructor)
                } else {
                    this.stack = (new Error).stack
                }
                this.message = e;
                this.name = "AxiosError";
                t && (this.code = t);
                n && (this.config = n);
                i && (this.request = i);
                if (s) {
                    this.response = s;
                    this.status = s.status ? s.status : null
                }
            }

            X.inherits(AxiosError, Error, {
                toJSON: function toJSON() {
                    return {
                        message: this.message,
                        name: this.name,
                        description: this.description,
                        number: this.number,
                        fileName: this.fileName,
                        lineNumber: this.lineNumber,
                        columnNumber: this.columnNumber,
                        stack: this.stack,
                        config: X.toJSONObject(this.config),
                        code: this.code,
                        status: this.status
                    }
                }
            });
            const Q = AxiosError.prototype;
            const ee = {};
            ["ERR_BAD_OPTION_VALUE", "ERR_BAD_OPTION", "ECONNABORTED", "ETIMEDOUT", "ERR_NETWORK", "ERR_FR_TOO_MANY_REDIRECTS", "ERR_DEPRECATED", "ERR_BAD_RESPONSE", "ERR_BAD_REQUEST", "ERR_CANCELED", "ERR_NOT_SUPPORT", "ERR_INVALID_URL"].forEach((e => {
                ee[e] = {value: e}
            }));
            Object.defineProperties(AxiosError, ee);
            Object.defineProperty(Q, "isAxiosError", {value: true});
            AxiosError.from = (e, t, n, i, s, o) => {
                const a = Object.create(Q);
                X.toFlatObject(e, a, (function filter(e) {
                    return e !== Error.prototype
                }), (e => e !== "isAxiosError"));
                AxiosError.call(a, e.message, t, n, i, s);
                a.cause = e;
                a.name = e.name;
                o && Object.assign(a, o);
                return a
            };

            function isVisitable(e) {
                return X.isPlainObject(e) || X.isArray(e)
            }

            function removeBrackets(e) {
                return X.endsWith(e, "[]") ? e.slice(0, -2) : e
            }

            function renderKey(e, t, n) {
                if (!e) return t;
                return e.concat(t).map((function each(e, t) {
                    e = removeBrackets(e);
                    return !n && t ? "[" + e + "]" : e
                })).join(n ? "." : "")
            }

            function isFlatArray(e) {
                return X.isArray(e) && !e.some(isVisitable)
            }

            const te = X.toFlatObject(X, {}, null, (function filter(e) {
                return /^is[A-Z]/.test(e)
            }));

            function toFormData(e, t, n) {
                if (!X.isObject(e)) {
                    throw new TypeError("target must be an object")
                }
                t = t || new (m["default"] || FormData);
                n = X.toFlatObject(n, {metaTokens: true, dots: false, indexes: false}, false, (function defined(e, t) {
                    return !X.isUndefined(t[e])
                }));
                const i = n.metaTokens;
                const s = n.visitor || defaultVisitor;
                const o = n.dots;
                const a = n.indexes;
                const r = n.Blob || typeof Blob !== "undefined" && Blob;
                const c = r && X.isSpecCompliantForm(t);
                if (!X.isFunction(s)) {
                    throw new TypeError("visitor must be a function")
                }

                function convertValue(e) {
                    if (e === null) return "";
                    if (X.isDate(e)) {
                        return e.toISOString()
                    }
                    if (X.isBoolean(e)) {
                        return e.toString()
                    }
                    if (!c && X.isBlob(e)) {
                        throw new AxiosError("Blob is not supported. Use a Buffer instead.")
                    }
                    if (X.isArrayBuffer(e) || X.isTypedArray(e)) {
                        return c && typeof Blob === "function" ? new Blob([e]) : Buffer.from(e)
                    }
                    return e
                }

                function defaultVisitor(e, n, s) {
                    let r = e;
                    if (e && !s && typeof e === "object") {
                        if (X.endsWith(n, "{}")) {
                            n = i ? n : n.slice(0, -2);
                            e = JSON.stringify(e)
                        } else if (X.isArray(e) && isFlatArray(e) || (X.isFileList(e) || X.endsWith(n, "[]")) && (r = X.toArray(e))) {
                            n = removeBrackets(n);
                            r.forEach((function each(e, i) {
                                !(X.isUndefined(e) || e === null) && t.append(a === true ? renderKey([n], i, o) : a === null ? n : n + "[]", convertValue(e))
                            }));
                            return false
                        }
                    }
                    if (isVisitable(e)) {
                        return true
                    }
                    t.append(renderKey(s, n, o), convertValue(e));
                    return false
                }

                const l = [];
                const p = Object.assign(te, {
                    defaultVisitor: defaultVisitor,
                    convertValue: convertValue,
                    isVisitable: isVisitable
                });

                function build(e, n) {
                    if (X.isUndefined(e)) return;
                    if (l.indexOf(e) !== -1) {
                        throw Error("Circular reference detected in " + n.join("."))
                    }
                    l.push(e);
                    X.forEach(e, (function each(e, i) {
                        const o = !(X.isUndefined(e) || e === null) && s.call(t, e, X.isString(i) ? i.trim() : i, n, p);
                        if (o === true) {
                            build(e, n ? n.concat(i) : [i])
                        }
                    }));
                    l.pop()
                }

                if (!X.isObject(e)) {
                    throw new TypeError("data must be an object")
                }
                build(e);
                return t
            }

            function encode$1(e) {
                const t = {"!": "%21", "'": "%27", "(": "%28", ")": "%29", "~": "%7E", "%20": "+", "%00": "\0"};
                return encodeURIComponent(e).replace(/[!'()~]|%20|%00/g, (function replacer(e) {
                    return t[e]
                }))
            }

            function AxiosURLSearchParams(e, t) {
                this._pairs = [];
                e && toFormData(e, this, t)
            }

            const ne = AxiosURLSearchParams.prototype;
            ne.append = function append(e, t) {
                this._pairs.push([e, t])
            };
            ne.toString = function toString(e) {
                const t = e ? function (t) {
                    return e.call(this, t, encode$1)
                } : encode$1;
                return this._pairs.map((function each(e) {
                    return t(e[0]) + "=" + t(e[1])
                }), "").join("&")
            };

            function encode(e) {
                return encodeURIComponent(e).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]")
            }

            function buildURL(e, t, n) {
                if (!t) {
                    return e
                }
                const i = n && n.encode || encode;
                if (X.isFunction(n)) {
                    n = {serialize: n}
                }
                const s = n && n.serialize;
                let o;
                if (s) {
                    o = s(t, n)
                } else {
                    o = X.isURLSearchParams(t) ? t.toString() : new AxiosURLSearchParams(t, n).toString(i)
                }
                if (o) {
                    const t = e.indexOf("#");
                    if (t !== -1) {
                        e = e.slice(0, t)
                    }
                    e += (e.indexOf("?") === -1 ? "?" : "&") + o
                }
                return e
            }

            class InterceptorManager {
                constructor() {
                    this.handlers = []
                }

                use(e, t, n) {
                    this.handlers.push({
                        fulfilled: e,
                        rejected: t,
                        synchronous: n ? n.synchronous : false,
                        runWhen: n ? n.runWhen : null
                    });
                    return this.handlers.length - 1
                }

                eject(e) {
                    if (this.handlers[e]) {
                        this.handlers[e] = null
                    }
                }

                clear() {
                    if (this.handlers) {
                        this.handlers = []
                    }
                }

                forEach(e) {
                    X.forEach(this.handlers, (function forEachHandler(t) {
                        if (t !== null) {
                            e(t)
                        }
                    }))
                }
            }

            const ie = InterceptorManager;
            const se = {silentJSONParsing: true, forcedJSONParsing: true, clarifyTimeoutError: false};
            const oe = x["default"].URLSearchParams;
            const ae = "abcdefghijklmnopqrstuvwxyz";
            const re = "0123456789";
            const ce = {DIGIT: re, ALPHA: ae, ALPHA_DIGIT: ae + ae.toUpperCase() + re};
            const generateString = (e = 16, t = ce.ALPHA_DIGIT) => {
                let n = "";
                const {length: i} = t;
                const s = new Uint32Array(e);
                h["default"].randomFillSync(s);
                for (let o = 0; o < e; o++) {
                    n += t[s[o] % i]
                }
                return n
            };
            const le = {
                isNode: true,
                classes: {
                    URLSearchParams: oe,
                    FormData: m["default"],
                    Blob: typeof Blob !== "undefined" && Blob || null
                },
                ALPHABET: ce,
                generateString: generateString,
                protocols: ["http", "https", "file", "data"]
            };
            const pe = typeof window !== "undefined" && typeof document !== "undefined";
            const ue = typeof navigator === "object" && navigator || undefined;
            const de = pe && (!ue || ["ReactNative", "NativeScript", "NS"].indexOf(ue.product) < 0);
            const fe = (() => typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope && typeof self.importScripts === "function")();
            const me = pe && window.location.href || "http://localhost";
            const he = Object.freeze({
                __proto__: null,
                hasBrowserEnv: pe,
                hasStandardBrowserWebWorkerEnv: fe,
                hasStandardBrowserEnv: de,
                navigator: ue,
                origin: me
            });
            const xe = {...he, ...le};

            function toURLEncodedForm(e, t) {
                return toFormData(e, new xe.classes.URLSearchParams, {
                    visitor: function (e, t, n, i) {
                        if (xe.isNode && X.isBuffer(e)) {
                            this.append(t, e.toString("base64"));
                            return false
                        }
                        return i.defaultVisitor.apply(this, arguments)
                    }, ...t
                })
            }

            function parsePropPath(e) {
                return X.matchAll(/\w+|\[(\w*)]/g, e).map((e => e[0] === "[]" ? "" : e[1] || e[0]))
            }

            function arrayToObject(e) {
                const t = {};
                const n = Object.keys(e);
                let i;
                const s = n.length;
                let o;
                for (i = 0; i < s; i++) {
                    o = n[i];
                    t[o] = e[o]
                }
                return t
            }

            function formDataToJSON(e) {
                function buildPath(e, t, n, i) {
                    let s = e[i++];
                    if (s === "__proto__") return true;
                    const o = Number.isFinite(+s);
                    const a = i >= e.length;
                    s = !s && X.isArray(n) ? n.length : s;
                    if (a) {
                        if (X.hasOwnProp(n, s)) {
                            n[s] = [n[s], t]
                        } else {
                            n[s] = t
                        }
                        return !o
                    }
                    if (!n[s] || !X.isObject(n[s])) {
                        n[s] = []
                    }
                    const r = buildPath(e, t, n[s], i);
                    if (r && X.isArray(n[s])) {
                        n[s] = arrayToObject(n[s])
                    }
                    return !o
                }

                if (X.isFormData(e) && X.isFunction(e.entries)) {
                    const t = {};
                    X.forEachEntry(e, ((e, n) => {
                        buildPath(parsePropPath(e), n, t, 0)
                    }));
                    return t
                }
                return null
            }

            function stringifySafely(e, t, n) {
                if (X.isString(e)) {
                    try {
                        (t || JSON.parse)(e);
                        return X.trim(e)
                    } catch (e) {
                        if (e.name !== "SyntaxError") {
                            throw e
                        }
                    }
                }
                return (n || JSON.stringify)(e)
            }

            const ge = {
                transitional: se,
                adapter: ["xhr", "http", "fetch"],
                transformRequest: [function transformRequest(e, t) {
                    const n = t.getContentType() || "";
                    const i = n.indexOf("application/json") > -1;
                    const s = X.isObject(e);
                    if (s && X.isHTMLForm(e)) {
                        e = new FormData(e)
                    }
                    const o = X.isFormData(e);
                    if (o) {
                        return i ? JSON.stringify(formDataToJSON(e)) : e
                    }
                    if (X.isArrayBuffer(e) || X.isBuffer(e) || X.isStream(e) || X.isFile(e) || X.isBlob(e) || X.isReadableStream(e)) {
                        return e
                    }
                    if (X.isArrayBufferView(e)) {
                        return e.buffer
                    }
                    if (X.isURLSearchParams(e)) {
                        t.setContentType("application/x-www-form-urlencoded;charset=utf-8", false);
                        return e.toString()
                    }
                    let a;
                    if (s) {
                        if (n.indexOf("application/x-www-form-urlencoded") > -1) {
                            return toURLEncodedForm(e, this.formSerializer).toString()
                        }
                        if ((a = X.isFileList(e)) || n.indexOf("multipart/form-data") > -1) {
                            const t = this.env && this.env.FormData;
                            return toFormData(a ? {"files[]": e} : e, t && new t, this.formSerializer)
                        }
                    }
                    if (s || i) {
                        t.setContentType("application/json", false);
                        return stringifySafely(e)
                    }
                    return e
                }],
                transformResponse: [function transformResponse(e) {
                    const t = this.transitional || ge.transitional;
                    const n = t && t.forcedJSONParsing;
                    const i = this.responseType === "json";
                    if (X.isResponse(e) || X.isReadableStream(e)) {
                        return e
                    }
                    if (e && X.isString(e) && (n && !this.responseType || i)) {
                        const n = t && t.silentJSONParsing;
                        const s = !n && i;
                        try {
                            return JSON.parse(e)
                        } catch (e) {
                            if (s) {
                                if (e.name === "SyntaxError") {
                                    throw AxiosError.from(e, AxiosError.ERR_BAD_RESPONSE, this, null, this.response)
                                }
                                throw e
                            }
                        }
                    }
                    return e
                }],
                timeout: 0,
                xsrfCookieName: "XSRF-TOKEN",
                xsrfHeaderName: "X-XSRF-TOKEN",
                maxContentLength: -1,
                maxBodyLength: -1,
                env: {FormData: xe.classes.FormData, Blob: xe.classes.Blob},
                validateStatus: function validateStatus(e) {
                    return e >= 200 && e < 300
                },
                headers: {common: {Accept: "application/json, text/plain, */*", "Content-Type": undefined}}
            };
            X.forEach(["delete", "get", "head", "post", "put", "patch"], (e => {
                ge.headers[e] = {}
            }));
            const ve = ge;
            const ye = X.toObjectSet(["age", "authorization", "content-length", "content-type", "etag", "expires", "from", "host", "if-modified-since", "if-unmodified-since", "last-modified", "location", "max-forwards", "proxy-authorization", "referer", "retry-after", "user-agent"]);
            const parseHeaders = e => {
                const t = {};
                let n;
                let i;
                let s;
                e && e.split("\n").forEach((function parser(e) {
                    s = e.indexOf(":");
                    n = e.substring(0, s).trim().toLowerCase();
                    i = e.substring(s + 1).trim();
                    if (!n || t[n] && ye[n]) {
                        return
                    }
                    if (n === "set-cookie") {
                        if (t[n]) {
                            t[n].push(i)
                        } else {
                            t[n] = [i]
                        }
                    } else {
                        t[n] = t[n] ? t[n] + ", " + i : i
                    }
                }));
                return t
            };
            const be = Symbol("internals");

            function normalizeHeader(e) {
                return e && String(e).trim().toLowerCase()
            }

            function normalizeValue(e) {
                if (e === false || e == null) {
                    return e
                }
                return X.isArray(e) ? e.map(normalizeValue) : String(e)
            }

            function parseTokens(e) {
                const t = Object.create(null);
                const n = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
                let i;
                while (i = n.exec(e)) {
                    t[i[1]] = i[2]
                }
                return t
            }

            const isValidHeaderName = e => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(e.trim());

            function matchHeaderValue(e, t, n, i, s) {
                if (X.isFunction(i)) {
                    return i.call(this, t, n)
                }
                if (s) {
                    t = n
                }
                if (!X.isString(t)) return;
                if (X.isString(i)) {
                    return t.indexOf(i) !== -1
                }
                if (X.isRegExp(i)) {
                    return i.test(t)
                }
            }

            function formatHeader(e) {
                return e.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, ((e, t, n) => t.toUpperCase() + n))
            }

            function buildAccessors(e, t) {
                const n = X.toCamelCase(" " + t);
                ["get", "set", "has"].forEach((i => {
                    Object.defineProperty(e, i + n, {
                        value: function (e, n, s) {
                            return this[i].call(this, t, e, n, s)
                        }, configurable: true
                    })
                }))
            }

            class AxiosHeaders {
                constructor(e) {
                    e && this.set(e)
                }

                set(e, t, n) {
                    const i = this;

                    function setHeader(e, t, n) {
                        const s = normalizeHeader(t);
                        if (!s) {
                            throw new Error("header name must be a non-empty string")
                        }
                        const o = X.findKey(i, s);
                        if (!o || i[o] === undefined || n === true || n === undefined && i[o] !== false) {
                            i[o || t] = normalizeValue(e)
                        }
                    }

                    const setHeaders = (e, t) => X.forEach(e, ((e, n) => setHeader(e, n, t)));
                    if (X.isPlainObject(e) || e instanceof this.constructor) {
                        setHeaders(e, t)
                    } else if (X.isString(e) && (e = e.trim()) && !isValidHeaderName(e)) {
                        setHeaders(parseHeaders(e), t)
                    } else if (X.isObject(e) && X.isIterable(e)) {
                        let n = {}, i, s;
                        for (const t of e) {
                            if (!X.isArray(t)) {
                                throw TypeError("Object iterator must return a key-value pair")
                            }
                            n[s = t[0]] = (i = n[s]) ? X.isArray(i) ? [...i, t[1]] : [i, t[1]] : t[1]
                        }
                        setHeaders(n, t)
                    } else {
                        e != null && setHeader(t, e, n)
                    }
                    return this
                }

                get(e, t) {
                    e = normalizeHeader(e);
                    if (e) {
                        const n = X.findKey(this, e);
                        if (n) {
                            const e = this[n];
                            if (!t) {
                                return e
                            }
                            if (t === true) {
                                return parseTokens(e)
                            }
                            if (X.isFunction(t)) {
                                return t.call(this, e, n)
                            }
                            if (X.isRegExp(t)) {
                                return t.exec(e)
                            }
                            throw new TypeError("parser must be boolean|regexp|function")
                        }
                    }
                }

                has(e, t) {
                    e = normalizeHeader(e);
                    if (e) {
                        const n = X.findKey(this, e);
                        return !!(n && this[n] !== undefined && (!t || matchHeaderValue(this, this[n], n, t)))
                    }
                    return false
                }

                delete(e, t) {
                    const n = this;
                    let i = false;

                    function deleteHeader(e) {
                        e = normalizeHeader(e);
                        if (e) {
                            const s = X.findKey(n, e);
                            if (s && (!t || matchHeaderValue(n, n[s], s, t))) {
                                delete n[s];
                                i = true
                            }
                        }
                    }

                    if (X.isArray(e)) {
                        e.forEach(deleteHeader)
                    } else {
                        deleteHeader(e)
                    }
                    return i
                }

                clear(e) {
                    const t = Object.keys(this);
                    let n = t.length;
                    let i = false;
                    while (n--) {
                        const s = t[n];
                        if (!e || matchHeaderValue(this, this[s], s, e, true)) {
                            delete this[s];
                            i = true
                        }
                    }
                    return i
                }

                normalize(e) {
                    const t = this;
                    const n = {};
                    X.forEach(this, ((i, s) => {
                        const o = X.findKey(n, s);
                        if (o) {
                            t[o] = normalizeValue(i);
                            delete t[s];
                            return
                        }
                        const a = e ? formatHeader(s) : String(s).trim();
                        if (a !== s) {
                            delete t[s]
                        }
                        t[a] = normalizeValue(i);
                        n[a] = true
                    }));
                    return this
                }

                concat(...e) {
                    return this.constructor.concat(this, ...e)
                }

                toJSON(e) {
                    const t = Object.create(null);
                    X.forEach(this, ((n, i) => {
                        n != null && n !== false && (t[i] = e && X.isArray(n) ? n.join(", ") : n)
                    }));
                    return t
                }

                [Symbol.iterator]() {
                    return Object.entries(this.toJSON())[Symbol.iterator]()
                }

                toString() {
                    return Object.entries(this.toJSON()).map((([e, t]) => e + ": " + t)).join("\n")
                }

                getSetCookie() {
                    return this.get("set-cookie") || []
                }

                get [Symbol.toStringTag]() {
                    return "AxiosHeaders"
                }

                static from(e) {
                    return e instanceof this ? e : new this(e)
                }

                static concat(e, ...t) {
                    const n = new this(e);
                    t.forEach((e => n.set(e)));
                    return n
                }

                static accessor(e) {
                    const t = this[be] = this[be] = {accessors: {}};
                    const n = t.accessors;
                    const i = this.prototype;

                    function defineAccessor(e) {
                        const t = normalizeHeader(e);
                        if (!n[t]) {
                            buildAccessors(i, e);
                            n[t] = true
                        }
                    }

                    X.isArray(e) ? e.forEach(defineAccessor) : defineAccessor(e);
                    return this
                }
            }

            AxiosHeaders.accessor(["Content-Type", "Content-Length", "Accept", "Accept-Encoding", "User-Agent", "Authorization"]);
            X.reduceDescriptors(AxiosHeaders.prototype, (({value: e}, t) => {
                let n = t[0].toUpperCase() + t.slice(1);
                return {
                    get: () => e, set(e) {
                        this[n] = e
                    }
                }
            }));
            X.freezeMethods(AxiosHeaders);
            const we = AxiosHeaders;

            function transformData(e, t) {
                const n = this || ve;
                const i = t || n;
                const s = we.from(i.headers);
                let o = i.data;
                X.forEach(e, (function transform(e) {
                    o = e.call(n, o, s.normalize(), t ? t.status : undefined)
                }));
                s.normalize();
                return o
            }

            function isCancel(e) {
                return !!(e && e.__CANCEL__)
            }

            function CanceledError(e, t, n) {
                AxiosError.call(this, e == null ? "canceled" : e, AxiosError.ERR_CANCELED, t, n);
                this.name = "CanceledError"
            }

            X.inherits(CanceledError, AxiosError, {__CANCEL__: true});

            function settle(e, t, n) {
                const i = n.config.validateStatus;
                if (!n.status || !i || i(n.status)) {
                    e(n)
                } else {
                    t(new AxiosError("Request failed with status code " + n.status, [AxiosError.ERR_BAD_REQUEST, AxiosError.ERR_BAD_RESPONSE][Math.floor(n.status / 100) - 4], n.config, n.request, n))
                }
            }

            function isAbsoluteURL(e) {
                return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(e)
            }

            function combineURLs(e, t) {
                return t ? e.replace(/\/?\/$/, "") + "/" + t.replace(/^\/+/, "") : e
            }

            function buildFullPath(e, t, n) {
                let i = !isAbsoluteURL(t);
                if (e && (i || n == false)) {
                    return combineURLs(e, t)
                }
                return t
            }

            const Se = "1.11.0";

            function parseProtocol(e) {
                const t = /^([-+\w]{1,25})(:?\/\/|:)/.exec(e);
                return t && t[1] || ""
            }

            const _e = /^(?:([^;]+);)?(?:[^;]+;)?(base64|),([\s\S]*)$/;

            function fromDataURI(e, t, n) {
                const i = n && n.Blob || xe.classes.Blob;
                const s = parseProtocol(e);
                if (t === undefined && i) {
                    t = true
                }
                if (s === "data") {
                    e = s.length ? e.slice(s.length + 1) : e;
                    const n = _e.exec(e);
                    if (!n) {
                        throw new AxiosError("Invalid URL", AxiosError.ERR_INVALID_URL)
                    }
                    const o = n[1];
                    const a = n[2];
                    const r = n[3];
                    const c = Buffer.from(decodeURIComponent(r), a ? "base64" : "utf8");
                    if (t) {
                        if (!i) {
                            throw new AxiosError("Blob is not supported", AxiosError.ERR_NOT_SUPPORT)
                        }
                        return new i([c], {type: o})
                    }
                    return c
                }
                throw new AxiosError("Unsupported protocol " + s, AxiosError.ERR_NOT_SUPPORT)
            }

            const ke = Symbol("internals");

            class AxiosTransformStream extends _["default"].Transform {
                constructor(e) {
                    e = X.toFlatObject(e, {
                        maxRate: 0,
                        chunkSize: 64 * 1024,
                        minChunkSize: 100,
                        timeWindow: 500,
                        ticksRate: 2,
                        samplesCount: 15
                    }, null, ((e, t) => !X.isUndefined(t[e])));
                    super({readableHighWaterMark: e.chunkSize});
                    const t = this[ke] = {
                        timeWindow: e.timeWindow,
                        chunkSize: e.chunkSize,
                        maxRate: e.maxRate,
                        minChunkSize: e.minChunkSize,
                        bytesSeen: 0,
                        isCaptured: false,
                        notifiedBytesLoaded: 0,
                        ts: Date.now(),
                        bytes: 0,
                        onReadCallback: null
                    };
                    this.on("newListener", (e => {
                        if (e === "progress") {
                            if (!t.isCaptured) {
                                t.isCaptured = true
                            }
                        }
                    }))
                }

                _read(e) {
                    const t = this[ke];
                    if (t.onReadCallback) {
                        t.onReadCallback()
                    }
                    return super._read(e)
                }

                _transform(e, t, n) {
                    const i = this[ke];
                    const s = i.maxRate;
                    const o = this.readableHighWaterMark;
                    const a = i.timeWindow;
                    const r = 1e3 / a;
                    const c = s / r;
                    const l = i.minChunkSize !== false ? Math.max(i.minChunkSize, c * .01) : 0;
                    const pushChunk = (e, t) => {
                        const n = Buffer.byteLength(e);
                        i.bytesSeen += n;
                        i.bytes += n;
                        i.isCaptured && this.emit("progress", i.bytesSeen);
                        if (this.push(e)) {
                            process.nextTick(t)
                        } else {
                            i.onReadCallback = () => {
                                i.onReadCallback = null;
                                process.nextTick(t)
                            }
                        }
                    };
                    const transformChunk = (e, t) => {
                        const n = Buffer.byteLength(e);
                        let r = null;
                        let p = o;
                        let u;
                        let d = 0;
                        if (s) {
                            const e = Date.now();
                            if (!i.ts || (d = e - i.ts) >= a) {
                                i.ts = e;
                                u = c - i.bytes;
                                i.bytes = u < 0 ? -u : 0;
                                d = 0
                            }
                            u = c - i.bytes
                        }
                        if (s) {
                            if (u <= 0) {
                                return setTimeout((() => {
                                    t(null, e)
                                }), a - d)
                            }
                            if (u < p) {
                                p = u
                            }
                        }
                        if (p && n > p && n - p > l) {
                            r = e.subarray(p);
                            e = e.subarray(0, p)
                        }
                        pushChunk(e, r ? () => {
                            process.nextTick(t, null, r)
                        } : t)
                    };
                    transformChunk(e, (function transformNextChunk(e, t) {
                        if (e) {
                            return n(e)
                        }
                        if (t) {
                            transformChunk(t, transformNextChunk)
                        } else {
                            n(null)
                        }
                    }))
                }
            }

            const Ee = AxiosTransformStream;
            const {asyncIterator: Oe} = Symbol;
            const readBlob = async function* (e) {
                if (e.stream) {
                    yield* e.stream()
                } else if (e.arrayBuffer) {
                    yield await e.arrayBuffer()
                } else if (e[Oe]) {
                    yield* e[Oe]()
                } else {
                    yield e
                }
            };
            const Ce = readBlob;
            const Te = xe.ALPHABET.ALPHA_DIGIT + "-_";
            const Fe = typeof TextEncoder === "function" ? new TextEncoder : new b["default"].TextEncoder;
            const Ae = "\r\n";
            const je = Fe.encode(Ae);
            const Re = 2;

            class FormDataPart {
                constructor(e, t) {
                    const {escapeName: n} = this.constructor;
                    const i = X.isString(t);
                    let s = `Content-Disposition: form-data; name="${n(e)}"${!i && t.name ? `; filename="${n(t.name)}"` : ""}${Ae}`;
                    if (i) {
                        t = Fe.encode(String(t).replace(/\r?\n|\r\n?/g, Ae))
                    } else {
                        s += `Content-Type: ${t.type || "application/octet-stream"}${Ae}`
                    }
                    this.headers = Fe.encode(s + Ae);
                    this.contentLength = i ? t.byteLength : t.size;
                    this.size = this.headers.byteLength + this.contentLength + Re;
                    this.name = e;
                    this.value = t
                }

                async* encode() {
                    yield this.headers;
                    const {value: e} = this;
                    if (X.isTypedArray(e)) {
                        yield e
                    } else {
                        yield* Ce(e)
                    }
                    yield je
                }

                static escapeName(e) {
                    return String(e).replace(/[\r\n"]/g, (e => ({"\r": "%0D", "\n": "%0A", '"': "%22"}[e])))
                }
            }

            const formDataToStream = (e, t, n) => {
                const {
                    tag: i = "form-data-boundary",
                    size: s = 25,
                    boundary: o = i + "-" + xe.generateString(s, Te)
                } = n || {};
                if (!X.isFormData(e)) {
                    throw TypeError("FormData instance required")
                }
                if (o.length < 1 || o.length > 70) {
                    throw Error("boundary must be 10-70 characters long")
                }
                const a = Fe.encode("--" + o + Ae);
                const r = Fe.encode("--" + o + "--" + Ae);
                let c = r.byteLength;
                const l = Array.from(e.entries()).map((([e, t]) => {
                    const n = new FormDataPart(e, t);
                    c += n.size;
                    return n
                }));
                c += a.byteLength * l.length;
                c = X.toFiniteNumber(c);
                const p = {"Content-Type": `multipart/form-data; boundary=${o}`};
                if (Number.isFinite(c)) {
                    p["Content-Length"] = c
                }
                t && t(p);
                return d.Readable.from(async function* () {
                    for (const e of l) {
                        yield a;
                        yield* e.encode()
                    }
                    yield r
                }())
            };
            const Le = formDataToStream;

            class ZlibHeaderTransformStream extends _["default"].Transform {
                __transform(e, t, n) {
                    this.push(e);
                    n()
                }

                _transform(e, t, n) {
                    if (e.length !== 0) {
                        this._transform = this.__transform;
                        if (e[0] !== 120) {
                            const e = Buffer.alloc(2);
                            e[0] = 120;
                            e[1] = 156;
                            this.push(e, t)
                        }
                    }
                    this.__transform(e, t, n)
                }
            }

            const Pe = ZlibHeaderTransformStream;
            const callbackify = (e, t) => X.isAsyncFn(e) ? function (...n) {
                const i = n.pop();
                e.apply(this, n).then((e => {
                    try {
                        t ? i(null, ...t(e)) : i(null, e)
                    } catch (e) {
                        i(e)
                    }
                }), i)
            } : e;
            const De = callbackify;

            function speedometer(e, t) {
                e = e || 10;
                const n = new Array(e);
                const i = new Array(e);
                let s = 0;
                let o = 0;
                let a;
                t = t !== undefined ? t : 1e3;
                return function push(r) {
                    const c = Date.now();
                    const l = i[o];
                    if (!a) {
                        a = c
                    }
                    n[s] = r;
                    i[s] = c;
                    let p = o;
                    let u = 0;
                    while (p !== s) {
                        u += n[p++];
                        p = p % e
                    }
                    s = (s + 1) % e;
                    if (s === o) {
                        o = (o + 1) % e
                    }
                    if (c - a < t) {
                        return
                    }
                    const d = l && c - l;
                    return d ? Math.round(u * 1e3 / d) : undefined
                }
            }

            function throttle(e, t) {
                let n = 0;
                let i = 1e3 / t;
                let s;
                let o;
                const invoke = (t, i = Date.now()) => {
                    n = i;
                    s = null;
                    if (o) {
                        clearTimeout(o);
                        o = null
                    }
                    e(...t)
                };
                const throttled = (...e) => {
                    const t = Date.now();
                    const a = t - n;
                    if (a >= i) {
                        invoke(e, t)
                    } else {
                        s = e;
                        if (!o) {
                            o = setTimeout((() => {
                                o = null;
                                invoke(s)
                            }), i - a)
                        }
                    }
                };
                const flush = () => s && invoke(s);
                return [throttled, flush]
            }

            const progressEventReducer = (e, t, n = 3) => {
                let i = 0;
                const s = speedometer(50, 250);
                return throttle((n => {
                    const o = n.loaded;
                    const a = n.lengthComputable ? n.total : undefined;
                    const r = o - i;
                    const c = s(r);
                    const l = o <= a;
                    i = o;
                    const p = {
                        loaded: o,
                        total: a,
                        progress: a ? o / a : undefined,
                        bytes: r,
                        rate: c ? c : undefined,
                        estimated: c && a && l ? (a - o) / c : undefined,
                        event: n,
                        lengthComputable: a != null,
                        [t ? "download" : "upload"]: true
                    };
                    e(p)
                }), n)
            };
            const progressEventDecorator = (e, t) => {
                const n = e != null;
                return [i => t[0]({lengthComputable: n, total: e, loaded: i}), t[1]]
            };
            const asyncDecorator = e => (...t) => X.asap((() => e(...t)));
            const Ne = {flush: S["default"].constants.Z_SYNC_FLUSH, finishFlush: S["default"].constants.Z_SYNC_FLUSH};
            const Ie = {
                flush: S["default"].constants.BROTLI_OPERATION_FLUSH,
                finishFlush: S["default"].constants.BROTLI_OPERATION_FLUSH
            };
            const Be = X.isFunction(S["default"].createBrotliDecompress);
            const {http: Me, https: Ue} = w["default"];
            const ze = /https:?/;
            const $e = xe.protocols.map((e => e + ":"));
            const flushOnFinish = (e, [t, n]) => {
                e.on("end", n).on("error", n);
                return t
            };

            function dispatchBeforeRedirect(e, t) {
                if (e.beforeRedirects.proxy) {
                    e.beforeRedirects.proxy(e)
                }
                if (e.beforeRedirects.config) {
                    e.beforeRedirects.config(e, t)
                }
            }

            function setProxy(e, t, n) {
                let i = t;
                if (!i && i !== false) {
                    const e = g["default"].getProxyForUrl(n);
                    if (e) {
                        i = new URL(e)
                    }
                }
                if (i) {
                    if (i.username) {
                        i.auth = (i.username || "") + ":" + (i.password || "")
                    }
                    if (i.auth) {
                        if (i.auth.username || i.auth.password) {
                            i.auth = (i.auth.username || "") + ":" + (i.auth.password || "")
                        }
                        const t = Buffer.from(i.auth, "utf8").toString("base64");
                        e.headers["Proxy-Authorization"] = "Basic " + t
                    }
                    e.headers.host = e.hostname + (e.port ? ":" + e.port : "");
                    const t = i.hostname || i.host;
                    e.hostname = t;
                    e.host = t;
                    e.port = i.port;
                    e.path = n;
                    if (i.protocol) {
                        e.protocol = i.protocol.includes(":") ? i.protocol : `${i.protocol}:`
                    }
                }
                e.beforeRedirects.proxy = function beforeRedirect(e) {
                    setProxy(e, t, e.href)
                }
            }

            const qe = typeof process !== "undefined" && X.kindOf(process) === "process";
            const wrapAsync = e => new Promise(((t, n) => {
                let i;
                let s;
                const done = (e, t) => {
                    if (s) return;
                    s = true;
                    i && i(e, t)
                };
                const _resolve = e => {
                    done(e);
                    t(e)
                };
                const _reject = e => {
                    done(e, true);
                    n(e)
                };
                e(_resolve, _reject, (e => i = e)).catch(_reject)
            }));
            const resolveFamily = ({address: e, family: t}) => {
                if (!X.isString(e)) {
                    throw TypeError("address must be a string")
                }
                return {address: e, family: t || (e.indexOf(".") < 0 ? 6 : 4)}
            };
            const buildAddressEntry = (e, t) => resolveFamily(X.isObject(e) ? e : {address: e, family: t});
            const We = qe && function httpAdapter(e) {
                return wrapAsync((async function dispatchHttpRequest(t, n, i) {
                    let {data: s, lookup: o, family: a} = e;
                    const {responseType: r, responseEncoding: c} = e;
                    const l = e.method.toUpperCase();
                    let p;
                    let u = false;
                    let d;
                    if (o) {
                        const e = De(o, (e => X.isArray(e) ? e : [e]));
                        o = (t, n, i) => {
                            e(t, n, ((e, t, s) => {
                                if (e) {
                                    return i(e)
                                }
                                const o = X.isArray(t) ? t.map((e => buildAddressEntry(e))) : [buildAddressEntry(t, s)];
                                n.all ? i(e, o) : i(e, o[0].address, o[0].family)
                            }))
                        }
                    }
                    const m = new f.EventEmitter;
                    const onFinished = () => {
                        if (e.cancelToken) {
                            e.cancelToken.unsubscribe(abort)
                        }
                        if (e.signal) {
                            e.signal.removeEventListener("abort", abort)
                        }
                        m.removeAllListeners()
                    };
                    i(((e, t) => {
                        p = true;
                        if (t) {
                            u = true;
                            onFinished()
                        }
                    }));

                    function abort(t) {
                        m.emit("abort", !t || t.type ? new CanceledError(null, e, d) : t)
                    }

                    m.once("abort", n);
                    if (e.cancelToken || e.signal) {
                        e.cancelToken && e.cancelToken.subscribe(abort);
                        if (e.signal) {
                            e.signal.aborted ? abort() : e.signal.addEventListener("abort", abort)
                        }
                    }
                    const h = buildFullPath(e.baseURL, e.url, e.allowAbsoluteUrls);
                    const x = new URL(h, xe.hasBrowserEnv ? xe.origin : undefined);
                    const g = x.protocol || $e[0];
                    if (g === "data:") {
                        let i;
                        if (l !== "GET") {
                            return settle(t, n, {status: 405, statusText: "method not allowed", headers: {}, config: e})
                        }
                        try {
                            i = fromDataURI(e.url, r === "blob", {Blob: e.env && e.env.Blob})
                        } catch (t) {
                            throw AxiosError.from(t, AxiosError.ERR_BAD_REQUEST, e)
                        }
                        if (r === "text") {
                            i = i.toString(c);
                            if (!c || c === "utf8") {
                                i = X.stripBOM(i)
                            }
                        } else if (r === "stream") {
                            i = _["default"].Readable.from(i)
                        }
                        return settle(t, n, {data: i, status: 200, statusText: "OK", headers: new we, config: e})
                    }
                    if ($e.indexOf(g) === -1) {
                        return n(new AxiosError("Unsupported protocol " + g, AxiosError.ERR_BAD_REQUEST, e))
                    }
                    const w = we.from(e.headers).normalize();
                    w.set("User-Agent", "axios/" + Se, false);
                    const {onUploadProgress: k, onDownloadProgress: E} = e;
                    const O = e.maxRate;
                    let C = undefined;
                    let T = undefined;
                    if (X.isSpecCompliantForm(s)) {
                        const e = w.getContentType(/boundary=([-_\w\d]{10,70})/i);
                        s = Le(s, (e => {
                            w.set(e)
                        }), {tag: `axios-${Se}-boundary`, boundary: e && e[1] || undefined})
                    } else if (X.isFormData(s) && X.isFunction(s.getHeaders)) {
                        w.set(s.getHeaders());
                        if (!w.hasContentLength()) {
                            try {
                                const e = await b["default"].promisify(s.getLength).call(s);
                                Number.isFinite(e) && e >= 0 && w.setContentLength(e)
                            } catch (e) {
                            }
                        }
                    } else if (X.isBlob(s) || X.isFile(s)) {
                        s.size && w.setContentType(s.type || "application/octet-stream");
                        w.setContentLength(s.size || 0);
                        s = _["default"].Readable.from(Ce(s))
                    } else if (s && !X.isStream(s)) {
                        if (Buffer.isBuffer(s)) ; else if (X.isArrayBuffer(s)) {
                            s = Buffer.from(new Uint8Array(s))
                        } else if (X.isString(s)) {
                            s = Buffer.from(s, "utf-8")
                        } else {
                            return n(new AxiosError("Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream", AxiosError.ERR_BAD_REQUEST, e))
                        }
                        w.setContentLength(s.length, false);
                        if (e.maxBodyLength > -1 && s.length > e.maxBodyLength) {
                            return n(new AxiosError("Request body larger than maxBodyLength limit", AxiosError.ERR_BAD_REQUEST, e))
                        }
                    }
                    const F = X.toFiniteNumber(w.getContentLength());
                    if (X.isArray(O)) {
                        C = O[0];
                        T = O[1]
                    } else {
                        C = T = O
                    }
                    if (s && (k || C)) {
                        if (!X.isStream(s)) {
                            s = _["default"].Readable.from(s, {objectMode: false})
                        }
                        s = _["default"].pipeline([s, new Ee({maxRate: X.toFiniteNumber(C)})], X.noop);
                        k && s.on("progress", flushOnFinish(s, progressEventDecorator(F, progressEventReducer(asyncDecorator(k), false, 3))))
                    }
                    let A = undefined;
                    if (e.auth) {
                        const t = e.auth.username || "";
                        const n = e.auth.password || "";
                        A = t + ":" + n
                    }
                    if (!A && x.username) {
                        const e = x.username;
                        const t = x.password;
                        A = e + ":" + t
                    }
                    A && w.delete("authorization");
                    let j;
                    try {
                        j = buildURL(x.pathname + x.search, e.params, e.paramsSerializer).replace(/^\?/, "")
                    } catch (t) {
                        const i = new Error(t.message);
                        i.config = e;
                        i.url = e.url;
                        i.exists = true;
                        return n(i)
                    }
                    w.set("Accept-Encoding", "gzip, compress, deflate" + (Be ? ", br" : ""), false);
                    const R = {
                        path: j,
                        method: l,
                        headers: w.toJSON(),
                        agents: {http: e.httpAgent, https: e.httpsAgent},
                        auth: A,
                        protocol: g,
                        family: a,
                        beforeRedirect: dispatchBeforeRedirect,
                        beforeRedirects: {}
                    };
                    !X.isUndefined(o) && (R.lookup = o);
                    if (e.socketPath) {
                        R.socketPath = e.socketPath
                    } else {
                        R.hostname = x.hostname.startsWith("[") ? x.hostname.slice(1, -1) : x.hostname;
                        R.port = x.port;
                        setProxy(R, e.proxy, g + "//" + x.hostname + (x.port ? ":" + x.port : "") + R.path)
                    }
                    let L;
                    const P = ze.test(R.protocol);
                    R.agent = P ? e.httpsAgent : e.httpAgent;
                    if (e.transport) {
                        L = e.transport
                    } else if (e.maxRedirects === 0) {
                        L = P ? y["default"] : v["default"]
                    } else {
                        if (e.maxRedirects) {
                            R.maxRedirects = e.maxRedirects
                        }
                        if (e.beforeRedirect) {
                            R.beforeRedirects.config = e.beforeRedirect
                        }
                        L = P ? Ue : Me
                    }
                    if (e.maxBodyLength > -1) {
                        R.maxBodyLength = e.maxBodyLength
                    } else {
                        R.maxBodyLength = Infinity
                    }
                    if (e.insecureHTTPParser) {
                        R.insecureHTTPParser = e.insecureHTTPParser
                    }
                    d = L.request(R, (function handleResponse(i) {
                        if (d.destroyed) return;
                        const s = [i];
                        const o = +i.headers["content-length"];
                        if (E || T) {
                            const e = new Ee({maxRate: X.toFiniteNumber(T)});
                            E && e.on("progress", flushOnFinish(e, progressEventDecorator(o, progressEventReducer(asyncDecorator(E), true, 3))));
                            s.push(e)
                        }
                        let a = i;
                        const p = i.req || d;
                        if (e.decompress !== false && i.headers["content-encoding"]) {
                            if (l === "HEAD" || i.statusCode === 204) {
                                delete i.headers["content-encoding"]
                            }
                            switch ((i.headers["content-encoding"] || "").toLowerCase()) {
                                case"gzip":
                                case"x-gzip":
                                case"compress":
                                case"x-compress":
                                    s.push(S["default"].createUnzip(Ne));
                                    delete i.headers["content-encoding"];
                                    break;
                                case"deflate":
                                    s.push(new Pe);
                                    s.push(S["default"].createUnzip(Ne));
                                    delete i.headers["content-encoding"];
                                    break;
                                case"br":
                                    if (Be) {
                                        s.push(S["default"].createBrotliDecompress(Ie));
                                        delete i.headers["content-encoding"]
                                    }
                            }
                        }
                        a = s.length > 1 ? _["default"].pipeline(s, X.noop) : s[0];
                        const f = _["default"].finished(a, (() => {
                            f();
                            onFinished()
                        }));
                        const h = {
                            status: i.statusCode,
                            statusText: i.statusMessage,
                            headers: new we(i.headers),
                            config: e,
                            request: p
                        };
                        if (r === "stream") {
                            h.data = a;
                            settle(t, n, h)
                        } else {
                            const i = [];
                            let s = 0;
                            a.on("data", (function handleStreamData(t) {
                                i.push(t);
                                s += t.length;
                                if (e.maxContentLength > -1 && s > e.maxContentLength) {
                                    u = true;
                                    a.destroy();
                                    n(new AxiosError("maxContentLength size of " + e.maxContentLength + " exceeded", AxiosError.ERR_BAD_RESPONSE, e, p))
                                }
                            }));
                            a.on("aborted", (function handlerStreamAborted() {
                                if (u) {
                                    return
                                }
                                const t = new AxiosError("stream has been aborted", AxiosError.ERR_BAD_RESPONSE, e, p);
                                a.destroy(t);
                                n(t)
                            }));
                            a.on("error", (function handleStreamError(t) {
                                if (d.destroyed) return;
                                n(AxiosError.from(t, null, e, p))
                            }));
                            a.on("end", (function handleStreamEnd() {
                                try {
                                    let e = i.length === 1 ? i[0] : Buffer.concat(i);
                                    if (r !== "arraybuffer") {
                                        e = e.toString(c);
                                        if (!c || c === "utf8") {
                                            e = X.stripBOM(e)
                                        }
                                    }
                                    h.data = e
                                } catch (t) {
                                    return n(AxiosError.from(t, null, e, h.request, h))
                                }
                                settle(t, n, h)
                            }))
                        }
                        m.once("abort", (e => {
                            if (!a.destroyed) {
                                a.emit("error", e);
                                a.destroy()
                            }
                        }))
                    }));
                    m.once("abort", (e => {
                        n(e);
                        d.destroy(e)
                    }));
                    d.on("error", (function handleRequestError(t) {
                        n(AxiosError.from(t, null, e, d))
                    }));
                    d.on("socket", (function handleRequestSocket(e) {
                        e.setKeepAlive(true, 1e3 * 60)
                    }));
                    if (e.timeout) {
                        const t = parseInt(e.timeout, 10);
                        if (Number.isNaN(t)) {
                            n(new AxiosError("error trying to parse `config.timeout` to int", AxiosError.ERR_BAD_OPTION_VALUE, e, d));
                            return
                        }
                        d.setTimeout(t, (function handleRequestTimeout() {
                            if (p) return;
                            let t = e.timeout ? "timeout of " + e.timeout + "ms exceeded" : "timeout exceeded";
                            const i = e.transitional || se;
                            if (e.timeoutErrorMessage) {
                                t = e.timeoutErrorMessage
                            }
                            n(new AxiosError(t, i.clarifyTimeoutError ? AxiosError.ETIMEDOUT : AxiosError.ECONNABORTED, e, d));
                            abort()
                        }))
                    }
                    if (X.isStream(s)) {
                        let t = false;
                        let n = false;
                        s.on("end", (() => {
                            t = true
                        }));
                        s.once("error", (e => {
                            n = true;
                            d.destroy(e)
                        }));
                        s.on("close", (() => {
                            if (!t && !n) {
                                abort(new CanceledError("Request stream has been aborted", e, d))
                            }
                        }));
                        s.pipe(d)
                    } else {
                        d.end(s)
                    }
                }))
            };
            const He = xe.hasStandardBrowserEnv ? ((e, t) => n => {
                n = new URL(n, xe.origin);
                return e.protocol === n.protocol && e.host === n.host && (t || e.port === n.port)
            })(new URL(xe.origin), xe.navigator && /(msie|trident)/i.test(xe.navigator.userAgent)) : () => true;
            const Ge = xe.hasStandardBrowserEnv ? {
                write(e, t, n, i, s, o) {
                    const a = [e + "=" + encodeURIComponent(t)];
                    X.isNumber(n) && a.push("expires=" + new Date(n).toGMTString());
                    X.isString(i) && a.push("path=" + i);
                    X.isString(s) && a.push("domain=" + s);
                    o === true && a.push("secure");
                    document.cookie = a.join("; ")
                }, read(e) {
                    const t = document.cookie.match(new RegExp("(^|;\\s*)(" + e + ")=([^;]*)"));
                    return t ? decodeURIComponent(t[3]) : null
                }, remove(e) {
                    this.write(e, "", Date.now() - 864e5)
                }
            } : {
                write() {
                }, read() {
                    return null
                }, remove() {
                }
            };
            const headersToObject = e => e instanceof we ? {...e} : e;

            function mergeConfig(e, t) {
                t = t || {};
                const n = {};

                function getMergedValue(e, t, n, i) {
                    if (X.isPlainObject(e) && X.isPlainObject(t)) {
                        return X.merge.call({caseless: i}, e, t)
                    } else if (X.isPlainObject(t)) {
                        return X.merge({}, t)
                    } else if (X.isArray(t)) {
                        return t.slice()
                    }
                    return t
                }

                function mergeDeepProperties(e, t, n, i) {
                    if (!X.isUndefined(t)) {
                        return getMergedValue(e, t, n, i)
                    } else if (!X.isUndefined(e)) {
                        return getMergedValue(undefined, e, n, i)
                    }
                }

                function valueFromConfig2(e, t) {
                    if (!X.isUndefined(t)) {
                        return getMergedValue(undefined, t)
                    }
                }

                function defaultToConfig2(e, t) {
                    if (!X.isUndefined(t)) {
                        return getMergedValue(undefined, t)
                    } else if (!X.isUndefined(e)) {
                        return getMergedValue(undefined, e)
                    }
                }

                function mergeDirectKeys(n, i, s) {
                    if (s in t) {
                        return getMergedValue(n, i)
                    } else if (s in e) {
                        return getMergedValue(undefined, n)
                    }
                }

                const i = {
                    url: valueFromConfig2,
                    method: valueFromConfig2,
                    data: valueFromConfig2,
                    baseURL: defaultToConfig2,
                    transformRequest: defaultToConfig2,
                    transformResponse: defaultToConfig2,
                    paramsSerializer: defaultToConfig2,
                    timeout: defaultToConfig2,
                    timeoutMessage: defaultToConfig2,
                    withCredentials: defaultToConfig2,
                    withXSRFToken: defaultToConfig2,
                    adapter: defaultToConfig2,
                    responseType: defaultToConfig2,
                    xsrfCookieName: defaultToConfig2,
                    xsrfHeaderName: defaultToConfig2,
                    onUploadProgress: defaultToConfig2,
                    onDownloadProgress: defaultToConfig2,
                    decompress: defaultToConfig2,
                    maxContentLength: defaultToConfig2,
                    maxBodyLength: defaultToConfig2,
                    beforeRedirect: defaultToConfig2,
                    transport: defaultToConfig2,
                    httpAgent: defaultToConfig2,
                    httpsAgent: defaultToConfig2,
                    cancelToken: defaultToConfig2,
                    socketPath: defaultToConfig2,
                    responseEncoding: defaultToConfig2,
                    validateStatus: mergeDirectKeys,
                    headers: (e, t, n) => mergeDeepProperties(headersToObject(e), headersToObject(t), n, true)
                };
                X.forEach(Object.keys({...e, ...t}), (function computeConfigValue(s) {
                    const o = i[s] || mergeDeepProperties;
                    const a = o(e[s], t[s], s);
                    X.isUndefined(a) && o !== mergeDirectKeys || (n[s] = a)
                }));
                return n
            }

            const resolveConfig = e => {
                const t = mergeConfig({}, e);
                let {data: n, withXSRFToken: i, xsrfHeaderName: s, xsrfCookieName: o, headers: a, auth: r} = t;
                t.headers = a = we.from(a);
                t.url = buildURL(buildFullPath(t.baseURL, t.url, t.allowAbsoluteUrls), e.params, e.paramsSerializer);
                if (r) {
                    a.set("Authorization", "Basic " + btoa((r.username || "") + ":" + (r.password ? unescape(encodeURIComponent(r.password)) : "")))
                }
                let c;
                if (X.isFormData(n)) {
                    if (xe.hasStandardBrowserEnv || xe.hasStandardBrowserWebWorkerEnv) {
                        a.setContentType(undefined)
                    } else if ((c = a.getContentType()) !== false) {
                        const [e, ...t] = c ? c.split(";").map((e => e.trim())).filter(Boolean) : [];
                        a.setContentType([e || "multipart/form-data", ...t].join("; "))
                    }
                }
                if (xe.hasStandardBrowserEnv) {
                    i && X.isFunction(i) && (i = i(t));
                    if (i || i !== false && He(t.url)) {
                        const e = s && o && Ge.read(o);
                        if (e) {
                            a.set(s, e)
                        }
                    }
                }
                return t
            };
            const Ve = typeof XMLHttpRequest !== "undefined";
            const Je = Ve && function (e) {
                return new Promise((function dispatchXhrRequest(t, n) {
                    const i = resolveConfig(e);
                    let s = i.data;
                    const o = we.from(i.headers).normalize();
                    let {responseType: a, onUploadProgress: r, onDownloadProgress: c} = i;
                    let l;
                    let p, u;
                    let d, f;

                    function done() {
                        d && d();
                        f && f();
                        i.cancelToken && i.cancelToken.unsubscribe(l);
                        i.signal && i.signal.removeEventListener("abort", l)
                    }

                    let m = new XMLHttpRequest;
                    m.open(i.method.toUpperCase(), i.url, true);
                    m.timeout = i.timeout;

                    function onloadend() {
                        if (!m) {
                            return
                        }
                        const i = we.from("getAllResponseHeaders" in m && m.getAllResponseHeaders());
                        const s = !a || a === "text" || a === "json" ? m.responseText : m.response;
                        const o = {
                            data: s,
                            status: m.status,
                            statusText: m.statusText,
                            headers: i,
                            config: e,
                            request: m
                        };
                        settle((function _resolve(e) {
                            t(e);
                            done()
                        }), (function _reject(e) {
                            n(e);
                            done()
                        }), o);
                        m = null
                    }

                    if ("onloadend" in m) {
                        m.onloadend = onloadend
                    } else {
                        m.onreadystatechange = function handleLoad() {
                            if (!m || m.readyState !== 4) {
                                return
                            }
                            if (m.status === 0 && !(m.responseURL && m.responseURL.indexOf("file:") === 0)) {
                                return
                            }
                            setTimeout(onloadend)
                        }
                    }
                    m.onabort = function handleAbort() {
                        if (!m) {
                            return
                        }
                        n(new AxiosError("Request aborted", AxiosError.ECONNABORTED, e, m));
                        m = null
                    };
                    m.onerror = function handleError() {
                        n(new AxiosError("Network Error", AxiosError.ERR_NETWORK, e, m));
                        m = null
                    };
                    m.ontimeout = function handleTimeout() {
                        let t = i.timeout ? "timeout of " + i.timeout + "ms exceeded" : "timeout exceeded";
                        const s = i.transitional || se;
                        if (i.timeoutErrorMessage) {
                            t = i.timeoutErrorMessage
                        }
                        n(new AxiosError(t, s.clarifyTimeoutError ? AxiosError.ETIMEDOUT : AxiosError.ECONNABORTED, e, m));
                        m = null
                    };
                    s === undefined && o.setContentType(null);
                    if ("setRequestHeader" in m) {
                        X.forEach(o.toJSON(), (function setRequestHeader(e, t) {
                            m.setRequestHeader(t, e)
                        }))
                    }
                    if (!X.isUndefined(i.withCredentials)) {
                        m.withCredentials = !!i.withCredentials
                    }
                    if (a && a !== "json") {
                        m.responseType = i.responseType
                    }
                    if (c) {
                        [u, f] = progressEventReducer(c, true);
                        m.addEventListener("progress", u)
                    }
                    if (r && m.upload) {
                        [p, d] = progressEventReducer(r);
                        m.upload.addEventListener("progress", p);
                        m.upload.addEventListener("loadend", d)
                    }
                    if (i.cancelToken || i.signal) {
                        l = t => {
                            if (!m) {
                                return
                            }
                            n(!t || t.type ? new CanceledError(null, e, m) : t);
                            m.abort();
                            m = null
                        };
                        i.cancelToken && i.cancelToken.subscribe(l);
                        if (i.signal) {
                            i.signal.aborted ? l() : i.signal.addEventListener("abort", l)
                        }
                    }
                    const h = parseProtocol(i.url);
                    if (h && xe.protocols.indexOf(h) === -1) {
                        n(new AxiosError("Unsupported protocol " + h + ":", AxiosError.ERR_BAD_REQUEST, e));
                        return
                    }
                    m.send(s || null)
                }))
            };
            const composeSignals = (e, t) => {
                const {length: n} = e = e ? e.filter(Boolean) : [];
                if (t || n) {
                    let n = new AbortController;
                    let i;
                    const onabort = function (e) {
                        if (!i) {
                            i = true;
                            unsubscribe();
                            const t = e instanceof Error ? e : this.reason;
                            n.abort(t instanceof AxiosError ? t : new CanceledError(t instanceof Error ? t.message : t))
                        }
                    };
                    let s = t && setTimeout((() => {
                        s = null;
                        onabort(new AxiosError(`timeout ${t} of ms exceeded`, AxiosError.ETIMEDOUT))
                    }), t);
                    const unsubscribe = () => {
                        if (e) {
                            s && clearTimeout(s);
                            s = null;
                            e.forEach((e => {
                                e.unsubscribe ? e.unsubscribe(onabort) : e.removeEventListener("abort", onabort)
                            }));
                            e = null
                        }
                    };
                    e.forEach((e => e.addEventListener("abort", onabort)));
                    const {signal: o} = n;
                    o.unsubscribe = () => X.asap(unsubscribe);
                    return o
                }
            };
            const Ke = composeSignals;
            const streamChunk = function* (e, t) {
                let n = e.byteLength;
                if (!t || n < t) {
                    yield e;
                    return
                }
                let i = 0;
                let s;
                while (i < n) {
                    s = i + t;
                    yield e.slice(i, s);
                    i = s
                }
            };
            const readBytes = async function* (e, t) {
                for await(const n of readStream(e)) {
                    yield* streamChunk(n, t)
                }
            };
            const readStream = async function* (e) {
                if (e[Symbol.asyncIterator]) {
                    yield* e;
                    return
                }
                const t = e.getReader();
                try {
                    for (; ;) {
                        const {done: e, value: n} = await t.read();
                        if (e) {
                            break
                        }
                        yield n
                    }
                } finally {
                    await t.cancel()
                }
            };
            const trackStream = (e, t, n, i) => {
                const s = readBytes(e, t);
                let o = 0;
                let a;
                let _onFinish = e => {
                    if (!a) {
                        a = true;
                        i && i(e)
                    }
                };
                return new ReadableStream({
                    async pull(e) {
                        try {
                            const {done: t, value: i} = await s.next();
                            if (t) {
                                _onFinish();
                                e.close();
                                return
                            }
                            let a = i.byteLength;
                            if (n) {
                                let e = o += a;
                                n(e)
                            }
                            e.enqueue(new Uint8Array(i))
                        } catch (e) {
                            _onFinish(e);
                            throw e
                        }
                    }, cancel(e) {
                        _onFinish(e);
                        return s.return()
                    }
                }, {highWaterMark: 2})
            };
            const Ye = typeof fetch === "function" && typeof Request === "function" && typeof Response === "function";
            const Ze = Ye && typeof ReadableStream === "function";
            const Xe = Ye && (typeof TextEncoder === "function" ? (e => t => e.encode(t))(new TextEncoder) : async e => new Uint8Array(await new Response(e).arrayBuffer()));
            const test = (e, ...t) => {
                try {
                    return !!e(...t)
                } catch (e) {
                    return false
                }
            };
            const Qe = Ze && test((() => {
                let e = false;
                const t = new Request(xe.origin, {
                    body: new ReadableStream, method: "POST", get duplex() {
                        e = true;
                        return "half"
                    }
                }).headers.has("Content-Type");
                return e && !t
            }));
            const et = 64 * 1024;
            const tt = Ze && test((() => X.isReadableStream(new Response("").body)));
            const nt = {stream: tt && (e => e.body)};
            Ye && (e => {
                ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((t => {
                    !nt[t] && (nt[t] = X.isFunction(e[t]) ? e => e[t]() : (e, n) => {
                        throw new AxiosError(`Response type '${t}' is not supported`, AxiosError.ERR_NOT_SUPPORT, n)
                    })
                }))
            })(new Response);
            const getBodyLength = async e => {
                if (e == null) {
                    return 0
                }
                if (X.isBlob(e)) {
                    return e.size
                }
                if (X.isSpecCompliantForm(e)) {
                    const t = new Request(xe.origin, {method: "POST", body: e});
                    return (await t.arrayBuffer()).byteLength
                }
                if (X.isArrayBufferView(e) || X.isArrayBuffer(e)) {
                    return e.byteLength
                }
                if (X.isURLSearchParams(e)) {
                    e = e + ""
                }
                if (X.isString(e)) {
                    return (await Xe(e)).byteLength
                }
            };
            const resolveBodyLength = async (e, t) => {
                const n = X.toFiniteNumber(e.getContentLength());
                return n == null ? getBodyLength(t) : n
            };
            const it = Ye && (async e => {
                let {
                    url: t,
                    method: n,
                    data: i,
                    signal: s,
                    cancelToken: o,
                    timeout: a,
                    onDownloadProgress: r,
                    onUploadProgress: c,
                    responseType: l,
                    headers: p,
                    withCredentials: u = "same-origin",
                    fetchOptions: d
                } = resolveConfig(e);
                l = l ? (l + "").toLowerCase() : "text";
                let f = Ke([s, o && o.toAbortSignal()], a);
                let m;
                const h = f && f.unsubscribe && (() => {
                    f.unsubscribe()
                });
                let x;
                try {
                    if (c && Qe && n !== "get" && n !== "head" && (x = await resolveBodyLength(p, i)) !== 0) {
                        let e = new Request(t, {method: "POST", body: i, duplex: "half"});
                        let n;
                        if (X.isFormData(i) && (n = e.headers.get("content-type"))) {
                            p.setContentType(n)
                        }
                        if (e.body) {
                            const [t, n] = progressEventDecorator(x, progressEventReducer(asyncDecorator(c)));
                            i = trackStream(e.body, et, t, n)
                        }
                    }
                    if (!X.isString(u)) {
                        u = u ? "include" : "omit"
                    }
                    const s = "credentials" in Request.prototype;
                    m = new Request(t, {
                        ...d,
                        signal: f,
                        method: n.toUpperCase(),
                        headers: p.normalize().toJSON(),
                        body: i,
                        duplex: "half",
                        credentials: s ? u : undefined
                    });
                    let o = await fetch(m, d);
                    const a = tt && (l === "stream" || l === "response");
                    if (tt && (r || a && h)) {
                        const e = {};
                        ["status", "statusText", "headers"].forEach((t => {
                            e[t] = o[t]
                        }));
                        const t = X.toFiniteNumber(o.headers.get("content-length"));
                        const [n, i] = r && progressEventDecorator(t, progressEventReducer(asyncDecorator(r), true)) || [];
                        o = new Response(trackStream(o.body, et, n, (() => {
                            i && i();
                            h && h()
                        })), e)
                    }
                    l = l || "text";
                    let g = await nt[X.findKey(nt, l) || "text"](o, e);
                    !a && h && h();
                    return await new Promise(((t, n) => {
                        settle(t, n, {
                            data: g,
                            headers: we.from(o.headers),
                            status: o.status,
                            statusText: o.statusText,
                            config: e,
                            request: m
                        })
                    }))
                } catch (t) {
                    h && h();
                    if (t && t.name === "TypeError" && /Load failed|fetch/i.test(t.message)) {
                        throw Object.assign(new AxiosError("Network Error", AxiosError.ERR_NETWORK, e, m), {cause: t.cause || t})
                    }
                    throw AxiosError.from(t, t && t.code, e, m)
                }
            });
            const st = {http: We, xhr: Je, fetch: it};
            X.forEach(st, ((e, t) => {
                if (e) {
                    try {
                        Object.defineProperty(e, "name", {value: t})
                    } catch (e) {
                    }
                    Object.defineProperty(e, "adapterName", {value: t})
                }
            }));
            const renderReason = e => `- ${e}`;
            const isResolvedHandle = e => X.isFunction(e) || e === null || e === false;
            const ot = {
                getAdapter: e => {
                    e = X.isArray(e) ? e : [e];
                    const {length: t} = e;
                    let n;
                    let i;
                    const s = {};
                    for (let o = 0; o < t; o++) {
                        n = e[o];
                        let t;
                        i = n;
                        if (!isResolvedHandle(n)) {
                            i = st[(t = String(n)).toLowerCase()];
                            if (i === undefined) {
                                throw new AxiosError(`Unknown adapter '${t}'`)
                            }
                        }
                        if (i) {
                            break
                        }
                        s[t || "#" + o] = i
                    }
                    if (!i) {
                        const e = Object.entries(s).map((([e, t]) => `adapter ${e} ` + (t === false ? "is not supported by the environment" : "is not available in the build")));
                        let n = t ? e.length > 1 ? "since :\n" + e.map(renderReason).join("\n") : " " + renderReason(e[0]) : "as no adapter specified";
                        throw new AxiosError(`There is no suitable adapter to dispatch the request ` + n, "ERR_NOT_SUPPORT")
                    }
                    return i
                }, adapters: st
            };

            function throwIfCancellationRequested(e) {
                if (e.cancelToken) {
                    e.cancelToken.throwIfRequested()
                }
                if (e.signal && e.signal.aborted) {
                    throw new CanceledError(null, e)
                }
            }

            function dispatchRequest(e) {
                throwIfCancellationRequested(e);
                e.headers = we.from(e.headers);
                e.data = transformData.call(e, e.transformRequest);
                if (["post", "put", "patch"].indexOf(e.method) !== -1) {
                    e.headers.setContentType("application/x-www-form-urlencoded", false)
                }
                const t = ot.getAdapter(e.adapter || ve.adapter);
                return t(e).then((function onAdapterResolution(t) {
                    throwIfCancellationRequested(e);
                    t.data = transformData.call(e, e.transformResponse, t);
                    t.headers = we.from(t.headers);
                    return t
                }), (function onAdapterRejection(t) {
                    if (!isCancel(t)) {
                        throwIfCancellationRequested(e);
                        if (t && t.response) {
                            t.response.data = transformData.call(e, e.transformResponse, t.response);
                            t.response.headers = we.from(t.response.headers)
                        }
                    }
                    return Promise.reject(t)
                }))
            }

            const at = {};
            ["object", "boolean", "number", "function", "string", "symbol"].forEach(((e, t) => {
                at[e] = function validator(n) {
                    return typeof n === e || "a" + (t < 1 ? "n " : " ") + e
                }
            }));
            const rt = {};
            at.transitional = function transitional(e, t, n) {
                function formatMessage(e, t) {
                    return "[Axios v" + Se + "] Transitional option '" + e + "'" + t + (n ? ". " + n : "")
                }

                return (n, i, s) => {
                    if (e === false) {
                        throw new AxiosError(formatMessage(i, " has been removed" + (t ? " in " + t : "")), AxiosError.ERR_DEPRECATED)
                    }
                    if (t && !rt[i]) {
                        rt[i] = true;
                        console.warn(formatMessage(i, " has been deprecated since v" + t + " and will be removed in the near future"))
                    }
                    return e ? e(n, i, s) : true
                }
            };
            at.spelling = function spelling(e) {
                return (t, n) => {
                    console.warn(`${n} is likely a misspelling of ${e}`);
                    return true
                }
            };

            function assertOptions(e, t, n) {
                if (typeof e !== "object") {
                    throw new AxiosError("options must be an object", AxiosError.ERR_BAD_OPTION_VALUE)
                }
                const i = Object.keys(e);
                let s = i.length;
                while (s-- > 0) {
                    const o = i[s];
                    const a = t[o];
                    if (a) {
                        const t = e[o];
                        const n = t === undefined || a(t, o, e);
                        if (n !== true) {
                            throw new AxiosError("option " + o + " must be " + n, AxiosError.ERR_BAD_OPTION_VALUE)
                        }
                        continue
                    }
                    if (n !== true) {
                        throw new AxiosError("Unknown option " + o, AxiosError.ERR_BAD_OPTION)
                    }
                }
            }

            const ct = {assertOptions: assertOptions, validators: at};
            const lt = ct.validators;

            class Axios {
                constructor(e) {
                    this.defaults = e || {};
                    this.interceptors = {request: new ie, response: new ie}
                }

                async request(e, t) {
                    try {
                        return await this._request(e, t)
                    } catch (e) {
                        if (e instanceof Error) {
                            let t = {};
                            Error.captureStackTrace ? Error.captureStackTrace(t) : t = new Error;
                            const n = t.stack ? t.stack.replace(/^.+\n/, "") : "";
                            try {
                                if (!e.stack) {
                                    e.stack = n
                                } else if (n && !String(e.stack).endsWith(n.replace(/^.+\n.+\n/, ""))) {
                                    e.stack += "\n" + n
                                }
                            } catch (e) {
                            }
                        }
                        throw e
                    }
                }

                _request(e, t) {
                    if (typeof e === "string") {
                        t = t || {};
                        t.url = e
                    } else {
                        t = e || {}
                    }
                    t = mergeConfig(this.defaults, t);
                    const {transitional: n, paramsSerializer: i, headers: s} = t;
                    if (n !== undefined) {
                        ct.assertOptions(n, {
                            silentJSONParsing: lt.transitional(lt.boolean),
                            forcedJSONParsing: lt.transitional(lt.boolean),
                            clarifyTimeoutError: lt.transitional(lt.boolean)
                        }, false)
                    }
                    if (i != null) {
                        if (X.isFunction(i)) {
                            t.paramsSerializer = {serialize: i}
                        } else {
                            ct.assertOptions(i, {encode: lt.function, serialize: lt.function}, true)
                        }
                    }
                    if (t.allowAbsoluteUrls !== undefined) ; else if (this.defaults.allowAbsoluteUrls !== undefined) {
                        t.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls
                    } else {
                        t.allowAbsoluteUrls = true
                    }
                    ct.assertOptions(t, {
                        baseUrl: lt.spelling("baseURL"),
                        withXsrfToken: lt.spelling("withXSRFToken")
                    }, true);
                    t.method = (t.method || this.defaults.method || "get").toLowerCase();
                    let o = s && X.merge(s.common, s[t.method]);
                    s && X.forEach(["delete", "get", "head", "post", "put", "patch", "common"], (e => {
                        delete s[e]
                    }));
                    t.headers = we.concat(o, s);
                    const a = [];
                    let r = true;
                    this.interceptors.request.forEach((function unshiftRequestInterceptors(e) {
                        if (typeof e.runWhen === "function" && e.runWhen(t) === false) {
                            return
                        }
                        r = r && e.synchronous;
                        a.unshift(e.fulfilled, e.rejected)
                    }));
                    const c = [];
                    this.interceptors.response.forEach((function pushResponseInterceptors(e) {
                        c.push(e.fulfilled, e.rejected)
                    }));
                    let l;
                    let p = 0;
                    let u;
                    if (!r) {
                        const e = [dispatchRequest.bind(this), undefined];
                        e.unshift(...a);
                        e.push(...c);
                        u = e.length;
                        l = Promise.resolve(t);
                        while (p < u) {
                            l = l.then(e[p++], e[p++])
                        }
                        return l
                    }
                    u = a.length;
                    let d = t;
                    p = 0;
                    while (p < u) {
                        const e = a[p++];
                        const t = a[p++];
                        try {
                            d = e(d)
                        } catch (e) {
                            t.call(this, e);
                            break
                        }
                    }
                    try {
                        l = dispatchRequest.call(this, d)
                    } catch (e) {
                        return Promise.reject(e)
                    }
                    p = 0;
                    u = c.length;
                    while (p < u) {
                        l = l.then(c[p++], c[p++])
                    }
                    return l
                }

                getUri(e) {
                    e = mergeConfig(this.defaults, e);
                    const t = buildFullPath(e.baseURL, e.url, e.allowAbsoluteUrls);
                    return buildURL(t, e.params, e.paramsSerializer)
                }
            }

            X.forEach(["delete", "get", "head", "options"], (function forEachMethodNoData(e) {
                Axios.prototype[e] = function (t, n) {
                    return this.request(mergeConfig(n || {}, {method: e, url: t, data: (n || {}).data}))
                }
            }));
            X.forEach(["post", "put", "patch"], (function forEachMethodWithData(e) {
                function generateHTTPMethod(t) {
                    return function httpMethod(n, i, s) {
                        return this.request(mergeConfig(s || {}, {
                            method: e,
                            headers: t ? {"Content-Type": "multipart/form-data"} : {},
                            url: n,
                            data: i
                        }))
                    }
                }

                Axios.prototype[e] = generateHTTPMethod();
                Axios.prototype[e + "Form"] = generateHTTPMethod(true)
            }));
            const pt = Axios;

            class CancelToken {
                constructor(e) {
                    if (typeof e !== "function") {
                        throw new TypeError("executor must be a function.")
                    }
                    let t;
                    this.promise = new Promise((function promiseExecutor(e) {
                        t = e
                    }));
                    const n = this;
                    this.promise.then((e => {
                        if (!n._listeners) return;
                        let t = n._listeners.length;
                        while (t-- > 0) {
                            n._listeners[t](e)
                        }
                        n._listeners = null
                    }));
                    this.promise.then = e => {
                        let t;
                        const i = new Promise((e => {
                            n.subscribe(e);
                            t = e
                        })).then(e);
                        i.cancel = function reject() {
                            n.unsubscribe(t)
                        };
                        return i
                    };
                    e((function cancel(e, i, s) {
                        if (n.reason) {
                            return
                        }
                        n.reason = new CanceledError(e, i, s);
                        t(n.reason)
                    }))
                }

                throwIfRequested() {
                    if (this.reason) {
                        throw this.reason
                    }
                }

                subscribe(e) {
                    if (this.reason) {
                        e(this.reason);
                        return
                    }
                    if (this._listeners) {
                        this._listeners.push(e)
                    } else {
                        this._listeners = [e]
                    }
                }

                unsubscribe(e) {
                    if (!this._listeners) {
                        return
                    }
                    const t = this._listeners.indexOf(e);
                    if (t !== -1) {
                        this._listeners.splice(t, 1)
                    }
                }

                toAbortSignal() {
                    const e = new AbortController;
                    const abort = t => {
                        e.abort(t)
                    };
                    this.subscribe(abort);
                    e.signal.unsubscribe = () => this.unsubscribe(abort);
                    return e.signal
                }

                static source() {
                    let e;
                    const t = new CancelToken((function executor(t) {
                        e = t
                    }));
                    return {token: t, cancel: e}
                }
            }

            const ut = CancelToken;

            function spread(e) {
                return function wrap(t) {
                    return e.apply(null, t)
                }
            }

            function isAxiosError(e) {
                return X.isObject(e) && e.isAxiosError === true
            }

            const dt = {
                Continue: 100,
                SwitchingProtocols: 101,
                Processing: 102,
                EarlyHints: 103,
                Ok: 200,
                Created: 201,
                Accepted: 202,
                NonAuthoritativeInformation: 203,
                NoContent: 204,
                ResetContent: 205,
                PartialContent: 206,
                MultiStatus: 207,
                AlreadyReported: 208,
                ImUsed: 226,
                MultipleChoices: 300,
                MovedPermanently: 301,
                Found: 302,
                SeeOther: 303,
                NotModified: 304,
                UseProxy: 305,
                Unused: 306,
                TemporaryRedirect: 307,
                PermanentRedirect: 308,
                BadRequest: 400,
                Unauthorized: 401,
                PaymentRequired: 402,
                Forbidden: 403,
                NotFound: 404,
                MethodNotAllowed: 405,
                NotAcceptable: 406,
                ProxyAuthenticationRequired: 407,
                RequestTimeout: 408,
                Conflict: 409,
                Gone: 410,
                LengthRequired: 411,
                PreconditionFailed: 412,
                PayloadTooLarge: 413,
                UriTooLong: 414,
                UnsupportedMediaType: 415,
                RangeNotSatisfiable: 416,
                ExpectationFailed: 417,
                ImATeapot: 418,
                MisdirectedRequest: 421,
                UnprocessableEntity: 422,
                Locked: 423,
                FailedDependency: 424,
                TooEarly: 425,
                UpgradeRequired: 426,
                PreconditionRequired: 428,
                TooManyRequests: 429,
                RequestHeaderFieldsTooLarge: 431,
                UnavailableForLegalReasons: 451,
                InternalServerError: 500,
                NotImplemented: 501,
                BadGateway: 502,
                ServiceUnavailable: 503,
                GatewayTimeout: 504,
                HttpVersionNotSupported: 505,
                VariantAlsoNegotiates: 506,
                InsufficientStorage: 507,
                LoopDetected: 508,
                NotExtended: 510,
                NetworkAuthenticationRequired: 511
            };
            Object.entries(dt).forEach((([e, t]) => {
                dt[t] = e
            }));
            const ft = dt;

            function createInstance(e) {
                const t = new pt(e);
                const n = bind(pt.prototype.request, t);
                X.extend(n, pt.prototype, t, {allOwnKeys: true});
                X.extend(n, t, null, {allOwnKeys: true});
                n.create = function create(t) {
                    return createInstance(mergeConfig(e, t))
                };
                return n
            }

            const mt = createInstance(ve);
            mt.Axios = pt;
            mt.CanceledError = CanceledError;
            mt.CancelToken = ut;
            mt.isCancel = isCancel;
            mt.VERSION = Se;
            mt.toFormData = toFormData;
            mt.AxiosError = AxiosError;
            mt.Cancel = mt.CanceledError;
            mt.all = function all(e) {
                return Promise.all(e)
            };
            mt.spread = spread;
            mt.isAxiosError = isAxiosError;
            mt.mergeConfig = mergeConfig;
            mt.AxiosHeaders = we;
            mt.formToJSON = e => formDataToJSON(X.isHTMLForm(e) ? new FormData(e) : e);
            mt.getAdapter = ot.getAdapter;
            mt.HttpStatusCode = ft;
            mt.default = mt;
            e.exports = mt
        }, 1813: e => {
            "use strict";
            e.exports = JSON.parse('{"application/1d-interleaved-parityfec":{"source":"iana"},"application/3gpdash-qoe-report+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/3gpp-ims+xml":{"source":"iana","compressible":true},"application/3gpphal+json":{"source":"iana","compressible":true},"application/3gpphalforms+json":{"source":"iana","compressible":true},"application/a2l":{"source":"iana"},"application/ace+cbor":{"source":"iana"},"application/activemessage":{"source":"iana"},"application/activity+json":{"source":"iana","compressible":true},"application/alto-costmap+json":{"source":"iana","compressible":true},"application/alto-costmapfilter+json":{"source":"iana","compressible":true},"application/alto-directory+json":{"source":"iana","compressible":true},"application/alto-endpointcost+json":{"source":"iana","compressible":true},"application/alto-endpointcostparams+json":{"source":"iana","compressible":true},"application/alto-endpointprop+json":{"source":"iana","compressible":true},"application/alto-endpointpropparams+json":{"source":"iana","compressible":true},"application/alto-error+json":{"source":"iana","compressible":true},"application/alto-networkmap+json":{"source":"iana","compressible":true},"application/alto-networkmapfilter+json":{"source":"iana","compressible":true},"application/alto-updatestreamcontrol+json":{"source":"iana","compressible":true},"application/alto-updatestreamparams+json":{"source":"iana","compressible":true},"application/aml":{"source":"iana"},"application/andrew-inset":{"source":"iana","extensions":["ez"]},"application/applefile":{"source":"iana"},"application/applixware":{"source":"apache","extensions":["aw"]},"application/at+jwt":{"source":"iana"},"application/atf":{"source":"iana"},"application/atfx":{"source":"iana"},"application/atom+xml":{"source":"iana","compressible":true,"extensions":["atom"]},"application/atomcat+xml":{"source":"iana","compressible":true,"extensions":["atomcat"]},"application/atomdeleted+xml":{"source":"iana","compressible":true,"extensions":["atomdeleted"]},"application/atomicmail":{"source":"iana"},"application/atomsvc+xml":{"source":"iana","compressible":true,"extensions":["atomsvc"]},"application/atsc-dwd+xml":{"source":"iana","compressible":true,"extensions":["dwd"]},"application/atsc-dynamic-event-message":{"source":"iana"},"application/atsc-held+xml":{"source":"iana","compressible":true,"extensions":["held"]},"application/atsc-rdt+json":{"source":"iana","compressible":true},"application/atsc-rsat+xml":{"source":"iana","compressible":true,"extensions":["rsat"]},"application/atxml":{"source":"iana"},"application/auth-policy+xml":{"source":"iana","compressible":true},"application/bacnet-xdd+zip":{"source":"iana","compressible":false},"application/batch-smtp":{"source":"iana"},"application/bdoc":{"compressible":false,"extensions":["bdoc"]},"application/beep+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/calendar+json":{"source":"iana","compressible":true},"application/calendar+xml":{"source":"iana","compressible":true,"extensions":["xcs"]},"application/call-completion":{"source":"iana"},"application/cals-1840":{"source":"iana"},"application/captive+json":{"source":"iana","compressible":true},"application/cbor":{"source":"iana"},"application/cbor-seq":{"source":"iana"},"application/cccex":{"source":"iana"},"application/ccmp+xml":{"source":"iana","compressible":true},"application/ccxml+xml":{"source":"iana","compressible":true,"extensions":["ccxml"]},"application/cdfx+xml":{"source":"iana","compressible":true,"extensions":["cdfx"]},"application/cdmi-capability":{"source":"iana","extensions":["cdmia"]},"application/cdmi-container":{"source":"iana","extensions":["cdmic"]},"application/cdmi-domain":{"source":"iana","extensions":["cdmid"]},"application/cdmi-object":{"source":"iana","extensions":["cdmio"]},"application/cdmi-queue":{"source":"iana","extensions":["cdmiq"]},"application/cdni":{"source":"iana"},"application/cea":{"source":"iana"},"application/cea-2018+xml":{"source":"iana","compressible":true},"application/cellml+xml":{"source":"iana","compressible":true},"application/cfw":{"source":"iana"},"application/city+json":{"source":"iana","compressible":true},"application/clr":{"source":"iana"},"application/clue+xml":{"source":"iana","compressible":true},"application/clue_info+xml":{"source":"iana","compressible":true},"application/cms":{"source":"iana"},"application/cnrp+xml":{"source":"iana","compressible":true},"application/coap-group+json":{"source":"iana","compressible":true},"application/coap-payload":{"source":"iana"},"application/commonground":{"source":"iana"},"application/conference-info+xml":{"source":"iana","compressible":true},"application/cose":{"source":"iana"},"application/cose-key":{"source":"iana"},"application/cose-key-set":{"source":"iana"},"application/cpl+xml":{"source":"iana","compressible":true,"extensions":["cpl"]},"application/csrattrs":{"source":"iana"},"application/csta+xml":{"source":"iana","compressible":true},"application/cstadata+xml":{"source":"iana","compressible":true},"application/csvm+json":{"source":"iana","compressible":true},"application/cu-seeme":{"source":"apache","extensions":["cu"]},"application/cwt":{"source":"iana"},"application/cybercash":{"source":"iana"},"application/dart":{"compressible":true},"application/dash+xml":{"source":"iana","compressible":true,"extensions":["mpd"]},"application/dash-patch+xml":{"source":"iana","compressible":true,"extensions":["mpp"]},"application/dashdelta":{"source":"iana"},"application/davmount+xml":{"source":"iana","compressible":true,"extensions":["davmount"]},"application/dca-rft":{"source":"iana"},"application/dcd":{"source":"iana"},"application/dec-dx":{"source":"iana"},"application/dialog-info+xml":{"source":"iana","compressible":true},"application/dicom":{"source":"iana"},"application/dicom+json":{"source":"iana","compressible":true},"application/dicom+xml":{"source":"iana","compressible":true},"application/dii":{"source":"iana"},"application/dit":{"source":"iana"},"application/dns":{"source":"iana"},"application/dns+json":{"source":"iana","compressible":true},"application/dns-message":{"source":"iana"},"application/docbook+xml":{"source":"apache","compressible":true,"extensions":["dbk"]},"application/dots+cbor":{"source":"iana"},"application/dskpp+xml":{"source":"iana","compressible":true},"application/dssc+der":{"source":"iana","extensions":["dssc"]},"application/dssc+xml":{"source":"iana","compressible":true,"extensions":["xdssc"]},"application/dvcs":{"source":"iana"},"application/ecmascript":{"source":"iana","compressible":true,"extensions":["es","ecma"]},"application/edi-consent":{"source":"iana"},"application/edi-x12":{"source":"iana","compressible":false},"application/edifact":{"source":"iana","compressible":false},"application/efi":{"source":"iana"},"application/elm+json":{"source":"iana","charset":"UTF-8","compressible":true},"application/elm+xml":{"source":"iana","compressible":true},"application/emergencycalldata.cap+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/emergencycalldata.comment+xml":{"source":"iana","compressible":true},"application/emergencycalldata.control+xml":{"source":"iana","compressible":true},"application/emergencycalldata.deviceinfo+xml":{"source":"iana","compressible":true},"application/emergencycalldata.ecall.msd":{"source":"iana"},"application/emergencycalldata.providerinfo+xml":{"source":"iana","compressible":true},"application/emergencycalldata.serviceinfo+xml":{"source":"iana","compressible":true},"application/emergencycalldata.subscriberinfo+xml":{"source":"iana","compressible":true},"application/emergencycalldata.veds+xml":{"source":"iana","compressible":true},"application/emma+xml":{"source":"iana","compressible":true,"extensions":["emma"]},"application/emotionml+xml":{"source":"iana","compressible":true,"extensions":["emotionml"]},"application/encaprtp":{"source":"iana"},"application/epp+xml":{"source":"iana","compressible":true},"application/epub+zip":{"source":"iana","compressible":false,"extensions":["epub"]},"application/eshop":{"source":"iana"},"application/exi":{"source":"iana","extensions":["exi"]},"application/expect-ct-report+json":{"source":"iana","compressible":true},"application/express":{"source":"iana","extensions":["exp"]},"application/fastinfoset":{"source":"iana"},"application/fastsoap":{"source":"iana"},"application/fdt+xml":{"source":"iana","compressible":true,"extensions":["fdt"]},"application/fhir+json":{"source":"iana","charset":"UTF-8","compressible":true},"application/fhir+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/fido.trusted-apps+json":{"compressible":true},"application/fits":{"source":"iana"},"application/flexfec":{"source":"iana"},"application/font-sfnt":{"source":"iana"},"application/font-tdpfr":{"source":"iana","extensions":["pfr"]},"application/font-woff":{"source":"iana","compressible":false},"application/framework-attributes+xml":{"source":"iana","compressible":true},"application/geo+json":{"source":"iana","compressible":true,"extensions":["geojson"]},"application/geo+json-seq":{"source":"iana"},"application/geopackage+sqlite3":{"source":"iana"},"application/geoxacml+xml":{"source":"iana","compressible":true},"application/gltf-buffer":{"source":"iana"},"application/gml+xml":{"source":"iana","compressible":true,"extensions":["gml"]},"application/gpx+xml":{"source":"apache","compressible":true,"extensions":["gpx"]},"application/gxf":{"source":"apache","extensions":["gxf"]},"application/gzip":{"source":"iana","compressible":false,"extensions":["gz"]},"application/h224":{"source":"iana"},"application/held+xml":{"source":"iana","compressible":true},"application/hjson":{"extensions":["hjson"]},"application/http":{"source":"iana"},"application/hyperstudio":{"source":"iana","extensions":["stk"]},"application/ibe-key-request+xml":{"source":"iana","compressible":true},"application/ibe-pkg-reply+xml":{"source":"iana","compressible":true},"application/ibe-pp-data":{"source":"iana"},"application/iges":{"source":"iana"},"application/im-iscomposing+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/index":{"source":"iana"},"application/index.cmd":{"source":"iana"},"application/index.obj":{"source":"iana"},"application/index.response":{"source":"iana"},"application/index.vnd":{"source":"iana"},"application/inkml+xml":{"source":"iana","compressible":true,"extensions":["ink","inkml"]},"application/iotp":{"source":"iana"},"application/ipfix":{"source":"iana","extensions":["ipfix"]},"application/ipp":{"source":"iana"},"application/isup":{"source":"iana"},"application/its+xml":{"source":"iana","compressible":true,"extensions":["its"]},"application/java-archive":{"source":"apache","compressible":false,"extensions":["jar","war","ear"]},"application/java-serialized-object":{"source":"apache","compressible":false,"extensions":["ser"]},"application/java-vm":{"source":"apache","compressible":false,"extensions":["class"]},"application/javascript":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["js","mjs"]},"application/jf2feed+json":{"source":"iana","compressible":true},"application/jose":{"source":"iana"},"application/jose+json":{"source":"iana","compressible":true},"application/jrd+json":{"source":"iana","compressible":true},"application/jscalendar+json":{"source":"iana","compressible":true},"application/json":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["json","map"]},"application/json-patch+json":{"source":"iana","compressible":true},"application/json-seq":{"source":"iana"},"application/json5":{"extensions":["json5"]},"application/jsonml+json":{"source":"apache","compressible":true,"extensions":["jsonml"]},"application/jwk+json":{"source":"iana","compressible":true},"application/jwk-set+json":{"source":"iana","compressible":true},"application/jwt":{"source":"iana"},"application/kpml-request+xml":{"source":"iana","compressible":true},"application/kpml-response+xml":{"source":"iana","compressible":true},"application/ld+json":{"source":"iana","compressible":true,"extensions":["jsonld"]},"application/lgr+xml":{"source":"iana","compressible":true,"extensions":["lgr"]},"application/link-format":{"source":"iana"},"application/load-control+xml":{"source":"iana","compressible":true},"application/lost+xml":{"source":"iana","compressible":true,"extensions":["lostxml"]},"application/lostsync+xml":{"source":"iana","compressible":true},"application/lpf+zip":{"source":"iana","compressible":false},"application/lxf":{"source":"iana"},"application/mac-binhex40":{"source":"iana","extensions":["hqx"]},"application/mac-compactpro":{"source":"apache","extensions":["cpt"]},"application/macwriteii":{"source":"iana"},"application/mads+xml":{"source":"iana","compressible":true,"extensions":["mads"]},"application/manifest+json":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["webmanifest"]},"application/marc":{"source":"iana","extensions":["mrc"]},"application/marcxml+xml":{"source":"iana","compressible":true,"extensions":["mrcx"]},"application/mathematica":{"source":"iana","extensions":["ma","nb","mb"]},"application/mathml+xml":{"source":"iana","compressible":true,"extensions":["mathml"]},"application/mathml-content+xml":{"source":"iana","compressible":true},"application/mathml-presentation+xml":{"source":"iana","compressible":true},"application/mbms-associated-procedure-description+xml":{"source":"iana","compressible":true},"application/mbms-deregister+xml":{"source":"iana","compressible":true},"application/mbms-envelope+xml":{"source":"iana","compressible":true},"application/mbms-msk+xml":{"source":"iana","compressible":true},"application/mbms-msk-response+xml":{"source":"iana","compressible":true},"application/mbms-protection-description+xml":{"source":"iana","compressible":true},"application/mbms-reception-report+xml":{"source":"iana","compressible":true},"application/mbms-register+xml":{"source":"iana","compressible":true},"application/mbms-register-response+xml":{"source":"iana","compressible":true},"application/mbms-schedule+xml":{"source":"iana","compressible":true},"application/mbms-user-service-description+xml":{"source":"iana","compressible":true},"application/mbox":{"source":"iana","extensions":["mbox"]},"application/media-policy-dataset+xml":{"source":"iana","compressible":true,"extensions":["mpf"]},"application/media_control+xml":{"source":"iana","compressible":true},"application/mediaservercontrol+xml":{"source":"iana","compressible":true,"extensions":["mscml"]},"application/merge-patch+json":{"source":"iana","compressible":true},"application/metalink+xml":{"source":"apache","compressible":true,"extensions":["metalink"]},"application/metalink4+xml":{"source":"iana","compressible":true,"extensions":["meta4"]},"application/mets+xml":{"source":"iana","compressible":true,"extensions":["mets"]},"application/mf4":{"source":"iana"},"application/mikey":{"source":"iana"},"application/mipc":{"source":"iana"},"application/missing-blocks+cbor-seq":{"source":"iana"},"application/mmt-aei+xml":{"source":"iana","compressible":true,"extensions":["maei"]},"application/mmt-usd+xml":{"source":"iana","compressible":true,"extensions":["musd"]},"application/mods+xml":{"source":"iana","compressible":true,"extensions":["mods"]},"application/moss-keys":{"source":"iana"},"application/moss-signature":{"source":"iana"},"application/mosskey-data":{"source":"iana"},"application/mosskey-request":{"source":"iana"},"application/mp21":{"source":"iana","extensions":["m21","mp21"]},"application/mp4":{"source":"iana","extensions":["mp4s","m4p"]},"application/mpeg4-generic":{"source":"iana"},"application/mpeg4-iod":{"source":"iana"},"application/mpeg4-iod-xmt":{"source":"iana"},"application/mrb-consumer+xml":{"source":"iana","compressible":true},"application/mrb-publish+xml":{"source":"iana","compressible":true},"application/msc-ivr+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/msc-mixer+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/msword":{"source":"iana","compressible":false,"extensions":["doc","dot"]},"application/mud+json":{"source":"iana","compressible":true},"application/multipart-core":{"source":"iana"},"application/mxf":{"source":"iana","extensions":["mxf"]},"application/n-quads":{"source":"iana","extensions":["nq"]},"application/n-triples":{"source":"iana","extensions":["nt"]},"application/nasdata":{"source":"iana"},"application/news-checkgroups":{"source":"iana","charset":"US-ASCII"},"application/news-groupinfo":{"source":"iana","charset":"US-ASCII"},"application/news-transmission":{"source":"iana"},"application/nlsml+xml":{"source":"iana","compressible":true},"application/node":{"source":"iana","extensions":["cjs"]},"application/nss":{"source":"iana"},"application/oauth-authz-req+jwt":{"source":"iana"},"application/oblivious-dns-message":{"source":"iana"},"application/ocsp-request":{"source":"iana"},"application/ocsp-response":{"source":"iana"},"application/octet-stream":{"source":"iana","compressible":false,"extensions":["bin","dms","lrf","mar","so","dist","distz","pkg","bpk","dump","elc","deploy","exe","dll","deb","dmg","iso","img","msi","msp","msm","buffer"]},"application/oda":{"source":"iana","extensions":["oda"]},"application/odm+xml":{"source":"iana","compressible":true},"application/odx":{"source":"iana"},"application/oebps-package+xml":{"source":"iana","compressible":true,"extensions":["opf"]},"application/ogg":{"source":"iana","compressible":false,"extensions":["ogx"]},"application/omdoc+xml":{"source":"apache","compressible":true,"extensions":["omdoc"]},"application/onenote":{"source":"apache","extensions":["onetoc","onetoc2","onetmp","onepkg"]},"application/opc-nodeset+xml":{"source":"iana","compressible":true},"application/oscore":{"source":"iana"},"application/oxps":{"source":"iana","extensions":["oxps"]},"application/p21":{"source":"iana"},"application/p21+zip":{"source":"iana","compressible":false},"application/p2p-overlay+xml":{"source":"iana","compressible":true,"extensions":["relo"]},"application/parityfec":{"source":"iana"},"application/passport":{"source":"iana"},"application/patch-ops-error+xml":{"source":"iana","compressible":true,"extensions":["xer"]},"application/pdf":{"source":"iana","compressible":false,"extensions":["pdf"]},"application/pdx":{"source":"iana"},"application/pem-certificate-chain":{"source":"iana"},"application/pgp-encrypted":{"source":"iana","compressible":false,"extensions":["pgp"]},"application/pgp-keys":{"source":"iana","extensions":["asc"]},"application/pgp-signature":{"source":"iana","extensions":["asc","sig"]},"application/pics-rules":{"source":"apache","extensions":["prf"]},"application/pidf+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/pidf-diff+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/pkcs10":{"source":"iana","extensions":["p10"]},"application/pkcs12":{"source":"iana"},"application/pkcs7-mime":{"source":"iana","extensions":["p7m","p7c"]},"application/pkcs7-signature":{"source":"iana","extensions":["p7s"]},"application/pkcs8":{"source":"iana","extensions":["p8"]},"application/pkcs8-encrypted":{"source":"iana"},"application/pkix-attr-cert":{"source":"iana","extensions":["ac"]},"application/pkix-cert":{"source":"iana","extensions":["cer"]},"application/pkix-crl":{"source":"iana","extensions":["crl"]},"application/pkix-pkipath":{"source":"iana","extensions":["pkipath"]},"application/pkixcmp":{"source":"iana","extensions":["pki"]},"application/pls+xml":{"source":"iana","compressible":true,"extensions":["pls"]},"application/poc-settings+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/postscript":{"source":"iana","compressible":true,"extensions":["ai","eps","ps"]},"application/ppsp-tracker+json":{"source":"iana","compressible":true},"application/problem+json":{"source":"iana","compressible":true},"application/problem+xml":{"source":"iana","compressible":true},"application/provenance+xml":{"source":"iana","compressible":true,"extensions":["provx"]},"application/prs.alvestrand.titrax-sheet":{"source":"iana"},"application/prs.cww":{"source":"iana","extensions":["cww"]},"application/prs.cyn":{"source":"iana","charset":"7-BIT"},"application/prs.hpub+zip":{"source":"iana","compressible":false},"application/prs.nprend":{"source":"iana"},"application/prs.plucker":{"source":"iana"},"application/prs.rdf-xml-crypt":{"source":"iana"},"application/prs.xsf+xml":{"source":"iana","compressible":true},"application/pskc+xml":{"source":"iana","compressible":true,"extensions":["pskcxml"]},"application/pvd+json":{"source":"iana","compressible":true},"application/qsig":{"source":"iana"},"application/raml+yaml":{"compressible":true,"extensions":["raml"]},"application/raptorfec":{"source":"iana"},"application/rdap+json":{"source":"iana","compressible":true},"application/rdf+xml":{"source":"iana","compressible":true,"extensions":["rdf","owl"]},"application/reginfo+xml":{"source":"iana","compressible":true,"extensions":["rif"]},"application/relax-ng-compact-syntax":{"source":"iana","extensions":["rnc"]},"application/remote-printing":{"source":"iana"},"application/reputon+json":{"source":"iana","compressible":true},"application/resource-lists+xml":{"source":"iana","compressible":true,"extensions":["rl"]},"application/resource-lists-diff+xml":{"source":"iana","compressible":true,"extensions":["rld"]},"application/rfc+xml":{"source":"iana","compressible":true},"application/riscos":{"source":"iana"},"application/rlmi+xml":{"source":"iana","compressible":true},"application/rls-services+xml":{"source":"iana","compressible":true,"extensions":["rs"]},"application/route-apd+xml":{"source":"iana","compressible":true,"extensions":["rapd"]},"application/route-s-tsid+xml":{"source":"iana","compressible":true,"extensions":["sls"]},"application/route-usd+xml":{"source":"iana","compressible":true,"extensions":["rusd"]},"application/rpki-ghostbusters":{"source":"iana","extensions":["gbr"]},"application/rpki-manifest":{"source":"iana","extensions":["mft"]},"application/rpki-publication":{"source":"iana"},"application/rpki-roa":{"source":"iana","extensions":["roa"]},"application/rpki-updown":{"source":"iana"},"application/rsd+xml":{"source":"apache","compressible":true,"extensions":["rsd"]},"application/rss+xml":{"source":"apache","compressible":true,"extensions":["rss"]},"application/rtf":{"source":"iana","compressible":true,"extensions":["rtf"]},"application/rtploopback":{"source":"iana"},"application/rtx":{"source":"iana"},"application/samlassertion+xml":{"source":"iana","compressible":true},"application/samlmetadata+xml":{"source":"iana","compressible":true},"application/sarif+json":{"source":"iana","compressible":true},"application/sarif-external-properties+json":{"source":"iana","compressible":true},"application/sbe":{"source":"iana"},"application/sbml+xml":{"source":"iana","compressible":true,"extensions":["sbml"]},"application/scaip+xml":{"source":"iana","compressible":true},"application/scim+json":{"source":"iana","compressible":true},"application/scvp-cv-request":{"source":"iana","extensions":["scq"]},"application/scvp-cv-response":{"source":"iana","extensions":["scs"]},"application/scvp-vp-request":{"source":"iana","extensions":["spq"]},"application/scvp-vp-response":{"source":"iana","extensions":["spp"]},"application/sdp":{"source":"iana","extensions":["sdp"]},"application/secevent+jwt":{"source":"iana"},"application/senml+cbor":{"source":"iana"},"application/senml+json":{"source":"iana","compressible":true},"application/senml+xml":{"source":"iana","compressible":true,"extensions":["senmlx"]},"application/senml-etch+cbor":{"source":"iana"},"application/senml-etch+json":{"source":"iana","compressible":true},"application/senml-exi":{"source":"iana"},"application/sensml+cbor":{"source":"iana"},"application/sensml+json":{"source":"iana","compressible":true},"application/sensml+xml":{"source":"iana","compressible":true,"extensions":["sensmlx"]},"application/sensml-exi":{"source":"iana"},"application/sep+xml":{"source":"iana","compressible":true},"application/sep-exi":{"source":"iana"},"application/session-info":{"source":"iana"},"application/set-payment":{"source":"iana"},"application/set-payment-initiation":{"source":"iana","extensions":["setpay"]},"application/set-registration":{"source":"iana"},"application/set-registration-initiation":{"source":"iana","extensions":["setreg"]},"application/sgml":{"source":"iana"},"application/sgml-open-catalog":{"source":"iana"},"application/shf+xml":{"source":"iana","compressible":true,"extensions":["shf"]},"application/sieve":{"source":"iana","extensions":["siv","sieve"]},"application/simple-filter+xml":{"source":"iana","compressible":true},"application/simple-message-summary":{"source":"iana"},"application/simplesymbolcontainer":{"source":"iana"},"application/sipc":{"source":"iana"},"application/slate":{"source":"iana"},"application/smil":{"source":"iana"},"application/smil+xml":{"source":"iana","compressible":true,"extensions":["smi","smil"]},"application/smpte336m":{"source":"iana"},"application/soap+fastinfoset":{"source":"iana"},"application/soap+xml":{"source":"iana","compressible":true},"application/sparql-query":{"source":"iana","extensions":["rq"]},"application/sparql-results+xml":{"source":"iana","compressible":true,"extensions":["srx"]},"application/spdx+json":{"source":"iana","compressible":true},"application/spirits-event+xml":{"source":"iana","compressible":true},"application/sql":{"source":"iana"},"application/srgs":{"source":"iana","extensions":["gram"]},"application/srgs+xml":{"source":"iana","compressible":true,"extensions":["grxml"]},"application/sru+xml":{"source":"iana","compressible":true,"extensions":["sru"]},"application/ssdl+xml":{"source":"apache","compressible":true,"extensions":["ssdl"]},"application/ssml+xml":{"source":"iana","compressible":true,"extensions":["ssml"]},"application/stix+json":{"source":"iana","compressible":true},"application/swid+xml":{"source":"iana","compressible":true,"extensions":["swidtag"]},"application/tamp-apex-update":{"source":"iana"},"application/tamp-apex-update-confirm":{"source":"iana"},"application/tamp-community-update":{"source":"iana"},"application/tamp-community-update-confirm":{"source":"iana"},"application/tamp-error":{"source":"iana"},"application/tamp-sequence-adjust":{"source":"iana"},"application/tamp-sequence-adjust-confirm":{"source":"iana"},"application/tamp-status-query":{"source":"iana"},"application/tamp-status-response":{"source":"iana"},"application/tamp-update":{"source":"iana"},"application/tamp-update-confirm":{"source":"iana"},"application/tar":{"compressible":true},"application/taxii+json":{"source":"iana","compressible":true},"application/td+json":{"source":"iana","compressible":true},"application/tei+xml":{"source":"iana","compressible":true,"extensions":["tei","teicorpus"]},"application/tetra_isi":{"source":"iana"},"application/thraud+xml":{"source":"iana","compressible":true,"extensions":["tfi"]},"application/timestamp-query":{"source":"iana"},"application/timestamp-reply":{"source":"iana"},"application/timestamped-data":{"source":"iana","extensions":["tsd"]},"application/tlsrpt+gzip":{"source":"iana"},"application/tlsrpt+json":{"source":"iana","compressible":true},"application/tnauthlist":{"source":"iana"},"application/token-introspection+jwt":{"source":"iana"},"application/toml":{"compressible":true,"extensions":["toml"]},"application/trickle-ice-sdpfrag":{"source":"iana"},"application/trig":{"source":"iana","extensions":["trig"]},"application/ttml+xml":{"source":"iana","compressible":true,"extensions":["ttml"]},"application/tve-trigger":{"source":"iana"},"application/tzif":{"source":"iana"},"application/tzif-leap":{"source":"iana"},"application/ubjson":{"compressible":false,"extensions":["ubj"]},"application/ulpfec":{"source":"iana"},"application/urc-grpsheet+xml":{"source":"iana","compressible":true},"application/urc-ressheet+xml":{"source":"iana","compressible":true,"extensions":["rsheet"]},"application/urc-targetdesc+xml":{"source":"iana","compressible":true,"extensions":["td"]},"application/urc-uisocketdesc+xml":{"source":"iana","compressible":true},"application/vcard+json":{"source":"iana","compressible":true},"application/vcard+xml":{"source":"iana","compressible":true},"application/vemmi":{"source":"iana"},"application/vividence.scriptfile":{"source":"apache"},"application/vnd.1000minds.decision-model+xml":{"source":"iana","compressible":true,"extensions":["1km"]},"application/vnd.3gpp-prose+xml":{"source":"iana","compressible":true},"application/vnd.3gpp-prose-pc3ch+xml":{"source":"iana","compressible":true},"application/vnd.3gpp-v2x-local-service-information":{"source":"iana"},"application/vnd.3gpp.5gnas":{"source":"iana"},"application/vnd.3gpp.access-transfer-events+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.bsf+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.gmop+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.gtpc":{"source":"iana"},"application/vnd.3gpp.interworking-data":{"source":"iana"},"application/vnd.3gpp.lpp":{"source":"iana"},"application/vnd.3gpp.mc-signalling-ear":{"source":"iana"},"application/vnd.3gpp.mcdata-affiliation-command+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcdata-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcdata-payload":{"source":"iana"},"application/vnd.3gpp.mcdata-service-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcdata-signalling":{"source":"iana"},"application/vnd.3gpp.mcdata-ue-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcdata-user-profile+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-affiliation-command+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-floor-request+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-location-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-mbms-usage-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-service-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-signed+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-ue-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-ue-init-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-user-profile+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-affiliation-command+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-affiliation-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-location-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-mbms-usage-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-service-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-transmission-request+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-ue-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-user-profile+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mid-call+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.ngap":{"source":"iana"},"application/vnd.3gpp.pfcp":{"source":"iana"},"application/vnd.3gpp.pic-bw-large":{"source":"iana","extensions":["plb"]},"application/vnd.3gpp.pic-bw-small":{"source":"iana","extensions":["psb"]},"application/vnd.3gpp.pic-bw-var":{"source":"iana","extensions":["pvb"]},"application/vnd.3gpp.s1ap":{"source":"iana"},"application/vnd.3gpp.sms":{"source":"iana"},"application/vnd.3gpp.sms+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.srvcc-ext+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.srvcc-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.state-and-event-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.ussd+xml":{"source":"iana","compressible":true},"application/vnd.3gpp2.bcmcsinfo+xml":{"source":"iana","compressible":true},"application/vnd.3gpp2.sms":{"source":"iana"},"application/vnd.3gpp2.tcap":{"source":"iana","extensions":["tcap"]},"application/vnd.3lightssoftware.imagescal":{"source":"iana"},"application/vnd.3m.post-it-notes":{"source":"iana","extensions":["pwn"]},"application/vnd.accpac.simply.aso":{"source":"iana","extensions":["aso"]},"application/vnd.accpac.simply.imp":{"source":"iana","extensions":["imp"]},"application/vnd.acucobol":{"source":"iana","extensions":["acu"]},"application/vnd.acucorp":{"source":"iana","extensions":["atc","acutc"]},"application/vnd.adobe.air-application-installer-package+zip":{"source":"apache","compressible":false,"extensions":["air"]},"application/vnd.adobe.flash.movie":{"source":"iana"},"application/vnd.adobe.formscentral.fcdt":{"source":"iana","extensions":["fcdt"]},"application/vnd.adobe.fxp":{"source":"iana","extensions":["fxp","fxpl"]},"application/vnd.adobe.partial-upload":{"source":"iana"},"application/vnd.adobe.xdp+xml":{"source":"iana","compressible":true,"extensions":["xdp"]},"application/vnd.adobe.xfdf":{"source":"iana","extensions":["xfdf"]},"application/vnd.aether.imp":{"source":"iana"},"application/vnd.afpc.afplinedata":{"source":"iana"},"application/vnd.afpc.afplinedata-pagedef":{"source":"iana"},"application/vnd.afpc.cmoca-cmresource":{"source":"iana"},"application/vnd.afpc.foca-charset":{"source":"iana"},"application/vnd.afpc.foca-codedfont":{"source":"iana"},"application/vnd.afpc.foca-codepage":{"source":"iana"},"application/vnd.afpc.modca":{"source":"iana"},"application/vnd.afpc.modca-cmtable":{"source":"iana"},"application/vnd.afpc.modca-formdef":{"source":"iana"},"application/vnd.afpc.modca-mediummap":{"source":"iana"},"application/vnd.afpc.modca-objectcontainer":{"source":"iana"},"application/vnd.afpc.modca-overlay":{"source":"iana"},"application/vnd.afpc.modca-pagesegment":{"source":"iana"},"application/vnd.age":{"source":"iana","extensions":["age"]},"application/vnd.ah-barcode":{"source":"iana"},"application/vnd.ahead.space":{"source":"iana","extensions":["ahead"]},"application/vnd.airzip.filesecure.azf":{"source":"iana","extensions":["azf"]},"application/vnd.airzip.filesecure.azs":{"source":"iana","extensions":["azs"]},"application/vnd.amadeus+json":{"source":"iana","compressible":true},"application/vnd.amazon.ebook":{"source":"apache","extensions":["azw"]},"application/vnd.amazon.mobi8-ebook":{"source":"iana"},"application/vnd.americandynamics.acc":{"source":"iana","extensions":["acc"]},"application/vnd.amiga.ami":{"source":"iana","extensions":["ami"]},"application/vnd.amundsen.maze+xml":{"source":"iana","compressible":true},"application/vnd.android.ota":{"source":"iana"},"application/vnd.android.package-archive":{"source":"apache","compressible":false,"extensions":["apk"]},"application/vnd.anki":{"source":"iana"},"application/vnd.anser-web-certificate-issue-initiation":{"source":"iana","extensions":["cii"]},"application/vnd.anser-web-funds-transfer-initiation":{"source":"apache","extensions":["fti"]},"application/vnd.antix.game-component":{"source":"iana","extensions":["atx"]},"application/vnd.apache.arrow.file":{"source":"iana"},"application/vnd.apache.arrow.stream":{"source":"iana"},"application/vnd.apache.thrift.binary":{"source":"iana"},"application/vnd.apache.thrift.compact":{"source":"iana"},"application/vnd.apache.thrift.json":{"source":"iana"},"application/vnd.api+json":{"source":"iana","compressible":true},"application/vnd.aplextor.warrp+json":{"source":"iana","compressible":true},"application/vnd.apothekende.reservation+json":{"source":"iana","compressible":true},"application/vnd.apple.installer+xml":{"source":"iana","compressible":true,"extensions":["mpkg"]},"application/vnd.apple.keynote":{"source":"iana","extensions":["key"]},"application/vnd.apple.mpegurl":{"source":"iana","extensions":["m3u8"]},"application/vnd.apple.numbers":{"source":"iana","extensions":["numbers"]},"application/vnd.apple.pages":{"source":"iana","extensions":["pages"]},"application/vnd.apple.pkpass":{"compressible":false,"extensions":["pkpass"]},"application/vnd.arastra.swi":{"source":"iana"},"application/vnd.aristanetworks.swi":{"source":"iana","extensions":["swi"]},"application/vnd.artisan+json":{"source":"iana","compressible":true},"application/vnd.artsquare":{"source":"iana"},"application/vnd.astraea-software.iota":{"source":"iana","extensions":["iota"]},"application/vnd.audiograph":{"source":"iana","extensions":["aep"]},"application/vnd.autopackage":{"source":"iana"},"application/vnd.avalon+json":{"source":"iana","compressible":true},"application/vnd.avistar+xml":{"source":"iana","compressible":true},"application/vnd.balsamiq.bmml+xml":{"source":"iana","compressible":true,"extensions":["bmml"]},"application/vnd.balsamiq.bmpr":{"source":"iana"},"application/vnd.banana-accounting":{"source":"iana"},"application/vnd.bbf.usp.error":{"source":"iana"},"application/vnd.bbf.usp.msg":{"source":"iana"},"application/vnd.bbf.usp.msg+json":{"source":"iana","compressible":true},"application/vnd.bekitzur-stech+json":{"source":"iana","compressible":true},"application/vnd.bint.med-content":{"source":"iana"},"application/vnd.biopax.rdf+xml":{"source":"iana","compressible":true},"application/vnd.blink-idb-value-wrapper":{"source":"iana"},"application/vnd.blueice.multipass":{"source":"iana","extensions":["mpm"]},"application/vnd.bluetooth.ep.oob":{"source":"iana"},"application/vnd.bluetooth.le.oob":{"source":"iana"},"application/vnd.bmi":{"source":"iana","extensions":["bmi"]},"application/vnd.bpf":{"source":"iana"},"application/vnd.bpf3":{"source":"iana"},"application/vnd.businessobjects":{"source":"iana","extensions":["rep"]},"application/vnd.byu.uapi+json":{"source":"iana","compressible":true},"application/vnd.cab-jscript":{"source":"iana"},"application/vnd.canon-cpdl":{"source":"iana"},"application/vnd.canon-lips":{"source":"iana"},"application/vnd.capasystems-pg+json":{"source":"iana","compressible":true},"application/vnd.cendio.thinlinc.clientconf":{"source":"iana"},"application/vnd.century-systems.tcp_stream":{"source":"iana"},"application/vnd.chemdraw+xml":{"source":"iana","compressible":true,"extensions":["cdxml"]},"application/vnd.chess-pgn":{"source":"iana"},"application/vnd.chipnuts.karaoke-mmd":{"source":"iana","extensions":["mmd"]},"application/vnd.ciedi":{"source":"iana"},"application/vnd.cinderella":{"source":"iana","extensions":["cdy"]},"application/vnd.cirpack.isdn-ext":{"source":"iana"},"application/vnd.citationstyles.style+xml":{"source":"iana","compressible":true,"extensions":["csl"]},"application/vnd.claymore":{"source":"iana","extensions":["cla"]},"application/vnd.cloanto.rp9":{"source":"iana","extensions":["rp9"]},"application/vnd.clonk.c4group":{"source":"iana","extensions":["c4g","c4d","c4f","c4p","c4u"]},"application/vnd.cluetrust.cartomobile-config":{"source":"iana","extensions":["c11amc"]},"application/vnd.cluetrust.cartomobile-config-pkg":{"source":"iana","extensions":["c11amz"]},"application/vnd.coffeescript":{"source":"iana"},"application/vnd.collabio.xodocuments.document":{"source":"iana"},"application/vnd.collabio.xodocuments.document-template":{"source":"iana"},"application/vnd.collabio.xodocuments.presentation":{"source":"iana"},"application/vnd.collabio.xodocuments.presentation-template":{"source":"iana"},"application/vnd.collabio.xodocuments.spreadsheet":{"source":"iana"},"application/vnd.collabio.xodocuments.spreadsheet-template":{"source":"iana"},"application/vnd.collection+json":{"source":"iana","compressible":true},"application/vnd.collection.doc+json":{"source":"iana","compressible":true},"application/vnd.collection.next+json":{"source":"iana","compressible":true},"application/vnd.comicbook+zip":{"source":"iana","compressible":false},"application/vnd.comicbook-rar":{"source":"iana"},"application/vnd.commerce-battelle":{"source":"iana"},"application/vnd.commonspace":{"source":"iana","extensions":["csp"]},"application/vnd.contact.cmsg":{"source":"iana","extensions":["cdbcmsg"]},"application/vnd.coreos.ignition+json":{"source":"iana","compressible":true},"application/vnd.cosmocaller":{"source":"iana","extensions":["cmc"]},"application/vnd.crick.clicker":{"source":"iana","extensions":["clkx"]},"application/vnd.crick.clicker.keyboard":{"source":"iana","extensions":["clkk"]},"application/vnd.crick.clicker.palette":{"source":"iana","extensions":["clkp"]},"application/vnd.crick.clicker.template":{"source":"iana","extensions":["clkt"]},"application/vnd.crick.clicker.wordbank":{"source":"iana","extensions":["clkw"]},"application/vnd.criticaltools.wbs+xml":{"source":"iana","compressible":true,"extensions":["wbs"]},"application/vnd.cryptii.pipe+json":{"source":"iana","compressible":true},"application/vnd.crypto-shade-file":{"source":"iana"},"application/vnd.cryptomator.encrypted":{"source":"iana"},"application/vnd.cryptomator.vault":{"source":"iana"},"application/vnd.ctc-posml":{"source":"iana","extensions":["pml"]},"application/vnd.ctct.ws+xml":{"source":"iana","compressible":true},"application/vnd.cups-pdf":{"source":"iana"},"application/vnd.cups-postscript":{"source":"iana"},"application/vnd.cups-ppd":{"source":"iana","extensions":["ppd"]},"application/vnd.cups-raster":{"source":"iana"},"application/vnd.cups-raw":{"source":"iana"},"application/vnd.curl":{"source":"iana"},"application/vnd.curl.car":{"source":"apache","extensions":["car"]},"application/vnd.curl.pcurl":{"source":"apache","extensions":["pcurl"]},"application/vnd.cyan.dean.root+xml":{"source":"iana","compressible":true},"application/vnd.cybank":{"source":"iana"},"application/vnd.cyclonedx+json":{"source":"iana","compressible":true},"application/vnd.cyclonedx+xml":{"source":"iana","compressible":true},"application/vnd.d2l.coursepackage1p0+zip":{"source":"iana","compressible":false},"application/vnd.d3m-dataset":{"source":"iana"},"application/vnd.d3m-problem":{"source":"iana"},"application/vnd.dart":{"source":"iana","compressible":true,"extensions":["dart"]},"application/vnd.data-vision.rdz":{"source":"iana","extensions":["rdz"]},"application/vnd.datapackage+json":{"source":"iana","compressible":true},"application/vnd.dataresource+json":{"source":"iana","compressible":true},"application/vnd.dbf":{"source":"iana","extensions":["dbf"]},"application/vnd.debian.binary-package":{"source":"iana"},"application/vnd.dece.data":{"source":"iana","extensions":["uvf","uvvf","uvd","uvvd"]},"application/vnd.dece.ttml+xml":{"source":"iana","compressible":true,"extensions":["uvt","uvvt"]},"application/vnd.dece.unspecified":{"source":"iana","extensions":["uvx","uvvx"]},"application/vnd.dece.zip":{"source":"iana","extensions":["uvz","uvvz"]},"application/vnd.denovo.fcselayout-link":{"source":"iana","extensions":["fe_launch"]},"application/vnd.desmume.movie":{"source":"iana"},"application/vnd.dir-bi.plate-dl-nosuffix":{"source":"iana"},"application/vnd.dm.delegation+xml":{"source":"iana","compressible":true},"application/vnd.dna":{"source":"iana","extensions":["dna"]},"application/vnd.document+json":{"source":"iana","compressible":true},"application/vnd.dolby.mlp":{"source":"apache","extensions":["mlp"]},"application/vnd.dolby.mobile.1":{"source":"iana"},"application/vnd.dolby.mobile.2":{"source":"iana"},"application/vnd.doremir.scorecloud-binary-document":{"source":"iana"},"application/vnd.dpgraph":{"source":"iana","extensions":["dpg"]},"application/vnd.dreamfactory":{"source":"iana","extensions":["dfac"]},"application/vnd.drive+json":{"source":"iana","compressible":true},"application/vnd.ds-keypoint":{"source":"apache","extensions":["kpxx"]},"application/vnd.dtg.local":{"source":"iana"},"application/vnd.dtg.local.flash":{"source":"iana"},"application/vnd.dtg.local.html":{"source":"iana"},"application/vnd.dvb.ait":{"source":"iana","extensions":["ait"]},"application/vnd.dvb.dvbisl+xml":{"source":"iana","compressible":true},"application/vnd.dvb.dvbj":{"source":"iana"},"application/vnd.dvb.esgcontainer":{"source":"iana"},"application/vnd.dvb.ipdcdftnotifaccess":{"source":"iana"},"application/vnd.dvb.ipdcesgaccess":{"source":"iana"},"application/vnd.dvb.ipdcesgaccess2":{"source":"iana"},"application/vnd.dvb.ipdcesgpdd":{"source":"iana"},"application/vnd.dvb.ipdcroaming":{"source":"iana"},"application/vnd.dvb.iptv.alfec-base":{"source":"iana"},"application/vnd.dvb.iptv.alfec-enhancement":{"source":"iana"},"application/vnd.dvb.notif-aggregate-root+xml":{"source":"iana","compressible":true},"application/vnd.dvb.notif-container+xml":{"source":"iana","compressible":true},"application/vnd.dvb.notif-generic+xml":{"source":"iana","compressible":true},"application/vnd.dvb.notif-ia-msglist+xml":{"source":"iana","compressible":true},"application/vnd.dvb.notif-ia-registration-request+xml":{"source":"iana","compressible":true},"application/vnd.dvb.notif-ia-registration-response+xml":{"source":"iana","compressible":true},"application/vnd.dvb.notif-init+xml":{"source":"iana","compressible":true},"application/vnd.dvb.pfr":{"source":"iana"},"application/vnd.dvb.service":{"source":"iana","extensions":["svc"]},"application/vnd.dxr":{"source":"iana"},"application/vnd.dynageo":{"source":"iana","extensions":["geo"]},"application/vnd.dzr":{"source":"iana"},"application/vnd.easykaraoke.cdgdownload":{"source":"iana"},"application/vnd.ecdis-update":{"source":"iana"},"application/vnd.ecip.rlp":{"source":"iana"},"application/vnd.eclipse.ditto+json":{"source":"iana","compressible":true},"application/vnd.ecowin.chart":{"source":"iana","extensions":["mag"]},"application/vnd.ecowin.filerequest":{"source":"iana"},"application/vnd.ecowin.fileupdate":{"source":"iana"},"application/vnd.ecowin.series":{"source":"iana"},"application/vnd.ecowin.seriesrequest":{"source":"iana"},"application/vnd.ecowin.seriesupdate":{"source":"iana"},"application/vnd.efi.img":{"source":"iana"},"application/vnd.efi.iso":{"source":"iana"},"application/vnd.emclient.accessrequest+xml":{"source":"iana","compressible":true},"application/vnd.enliven":{"source":"iana","extensions":["nml"]},"application/vnd.enphase.envoy":{"source":"iana"},"application/vnd.eprints.data+xml":{"source":"iana","compressible":true},"application/vnd.epson.esf":{"source":"iana","extensions":["esf"]},"application/vnd.epson.msf":{"source":"iana","extensions":["msf"]},"application/vnd.epson.quickanime":{"source":"iana","extensions":["qam"]},"application/vnd.epson.salt":{"source":"iana","extensions":["slt"]},"application/vnd.epson.ssf":{"source":"iana","extensions":["ssf"]},"application/vnd.ericsson.quickcall":{"source":"iana"},"application/vnd.espass-espass+zip":{"source":"iana","compressible":false},"application/vnd.eszigno3+xml":{"source":"iana","compressible":true,"extensions":["es3","et3"]},"application/vnd.etsi.aoc+xml":{"source":"iana","compressible":true},"application/vnd.etsi.asic-e+zip":{"source":"iana","compressible":false},"application/vnd.etsi.asic-s+zip":{"source":"iana","compressible":false},"application/vnd.etsi.cug+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvcommand+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvdiscovery+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvprofile+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvsad-bc+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvsad-cod+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvsad-npvr+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvservice+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvsync+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvueprofile+xml":{"source":"iana","compressible":true},"application/vnd.etsi.mcid+xml":{"source":"iana","compressible":true},"application/vnd.etsi.mheg5":{"source":"iana"},"application/vnd.etsi.overload-control-policy-dataset+xml":{"source":"iana","compressible":true},"application/vnd.etsi.pstn+xml":{"source":"iana","compressible":true},"application/vnd.etsi.sci+xml":{"source":"iana","compressible":true},"application/vnd.etsi.simservs+xml":{"source":"iana","compressible":true},"application/vnd.etsi.timestamp-token":{"source":"iana"},"application/vnd.etsi.tsl+xml":{"source":"iana","compressible":true},"application/vnd.etsi.tsl.der":{"source":"iana"},"application/vnd.eu.kasparian.car+json":{"source":"iana","compressible":true},"application/vnd.eudora.data":{"source":"iana"},"application/vnd.evolv.ecig.profile":{"source":"iana"},"application/vnd.evolv.ecig.settings":{"source":"iana"},"application/vnd.evolv.ecig.theme":{"source":"iana"},"application/vnd.exstream-empower+zip":{"source":"iana","compressible":false},"application/vnd.exstream-package":{"source":"iana"},"application/vnd.ezpix-album":{"source":"iana","extensions":["ez2"]},"application/vnd.ezpix-package":{"source":"iana","extensions":["ez3"]},"application/vnd.f-secure.mobile":{"source":"iana"},"application/vnd.familysearch.gedcom+zip":{"source":"iana","compressible":false},"application/vnd.fastcopy-disk-image":{"source":"iana"},"application/vnd.fdf":{"source":"iana","extensions":["fdf"]},"application/vnd.fdsn.mseed":{"source":"iana","extensions":["mseed"]},"application/vnd.fdsn.seed":{"source":"iana","extensions":["seed","dataless"]},"application/vnd.ffsns":{"source":"iana"},"application/vnd.ficlab.flb+zip":{"source":"iana","compressible":false},"application/vnd.filmit.zfc":{"source":"iana"},"application/vnd.fints":{"source":"iana"},"application/vnd.firemonkeys.cloudcell":{"source":"iana"},"application/vnd.flographit":{"source":"iana","extensions":["gph"]},"application/vnd.fluxtime.clip":{"source":"iana","extensions":["ftc"]},"application/vnd.font-fontforge-sfd":{"source":"iana"},"application/vnd.framemaker":{"source":"iana","extensions":["fm","frame","maker","book"]},"application/vnd.frogans.fnc":{"source":"iana","extensions":["fnc"]},"application/vnd.frogans.ltf":{"source":"iana","extensions":["ltf"]},"application/vnd.fsc.weblaunch":{"source":"iana","extensions":["fsc"]},"application/vnd.fujifilm.fb.docuworks":{"source":"iana"},"application/vnd.fujifilm.fb.docuworks.binder":{"source":"iana"},"application/vnd.fujifilm.fb.docuworks.container":{"source":"iana"},"application/vnd.fujifilm.fb.jfi+xml":{"source":"iana","compressible":true},"application/vnd.fujitsu.oasys":{"source":"iana","extensions":["oas"]},"application/vnd.fujitsu.oasys2":{"source":"iana","extensions":["oa2"]},"application/vnd.fujitsu.oasys3":{"source":"iana","extensions":["oa3"]},"application/vnd.fujitsu.oasysgp":{"source":"iana","extensions":["fg5"]},"application/vnd.fujitsu.oasysprs":{"source":"iana","extensions":["bh2"]},"application/vnd.fujixerox.art-ex":{"source":"iana"},"application/vnd.fujixerox.art4":{"source":"iana"},"application/vnd.fujixerox.ddd":{"source":"iana","extensions":["ddd"]},"application/vnd.fujixerox.docuworks":{"source":"iana","extensions":["xdw"]},"application/vnd.fujixerox.docuworks.binder":{"source":"iana","extensions":["xbd"]},"application/vnd.fujixerox.docuworks.container":{"source":"iana"},"application/vnd.fujixerox.hbpl":{"source":"iana"},"application/vnd.fut-misnet":{"source":"iana"},"application/vnd.futoin+cbor":{"source":"iana"},"application/vnd.futoin+json":{"source":"iana","compressible":true},"application/vnd.fuzzysheet":{"source":"iana","extensions":["fzs"]},"application/vnd.genomatix.tuxedo":{"source":"iana","extensions":["txd"]},"application/vnd.gentics.grd+json":{"source":"iana","compressible":true},"application/vnd.geo+json":{"source":"iana","compressible":true},"application/vnd.geocube+xml":{"source":"iana","compressible":true},"application/vnd.geogebra.file":{"source":"iana","extensions":["ggb"]},"application/vnd.geogebra.slides":{"source":"iana"},"application/vnd.geogebra.tool":{"source":"iana","extensions":["ggt"]},"application/vnd.geometry-explorer":{"source":"iana","extensions":["gex","gre"]},"application/vnd.geonext":{"source":"iana","extensions":["gxt"]},"application/vnd.geoplan":{"source":"iana","extensions":["g2w"]},"application/vnd.geospace":{"source":"iana","extensions":["g3w"]},"application/vnd.gerber":{"source":"iana"},"application/vnd.globalplatform.card-content-mgt":{"source":"iana"},"application/vnd.globalplatform.card-content-mgt-response":{"source":"iana"},"application/vnd.gmx":{"source":"iana","extensions":["gmx"]},"application/vnd.google-apps.document":{"compressible":false,"extensions":["gdoc"]},"application/vnd.google-apps.presentation":{"compressible":false,"extensions":["gslides"]},"application/vnd.google-apps.spreadsheet":{"compressible":false,"extensions":["gsheet"]},"application/vnd.google-earth.kml+xml":{"source":"iana","compressible":true,"extensions":["kml"]},"application/vnd.google-earth.kmz":{"source":"iana","compressible":false,"extensions":["kmz"]},"application/vnd.gov.sk.e-form+xml":{"source":"iana","compressible":true},"application/vnd.gov.sk.e-form+zip":{"source":"iana","compressible":false},"application/vnd.gov.sk.xmldatacontainer+xml":{"source":"iana","compressible":true},"application/vnd.grafeq":{"source":"iana","extensions":["gqf","gqs"]},"application/vnd.gridmp":{"source":"iana"},"application/vnd.groove-account":{"source":"iana","extensions":["gac"]},"application/vnd.groove-help":{"source":"iana","extensions":["ghf"]},"application/vnd.groove-identity-message":{"source":"iana","extensions":["gim"]},"application/vnd.groove-injector":{"source":"iana","extensions":["grv"]},"application/vnd.groove-tool-message":{"source":"iana","extensions":["gtm"]},"application/vnd.groove-tool-template":{"source":"iana","extensions":["tpl"]},"application/vnd.groove-vcard":{"source":"iana","extensions":["vcg"]},"application/vnd.hal+json":{"source":"iana","compressible":true},"application/vnd.hal+xml":{"source":"iana","compressible":true,"extensions":["hal"]},"application/vnd.handheld-entertainment+xml":{"source":"iana","compressible":true,"extensions":["zmm"]},"application/vnd.hbci":{"source":"iana","extensions":["hbci"]},"application/vnd.hc+json":{"source":"iana","compressible":true},"application/vnd.hcl-bireports":{"source":"iana"},"application/vnd.hdt":{"source":"iana"},"application/vnd.heroku+json":{"source":"iana","compressible":true},"application/vnd.hhe.lesson-player":{"source":"iana","extensions":["les"]},"application/vnd.hl7cda+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/vnd.hl7v2+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/vnd.hp-hpgl":{"source":"iana","extensions":["hpgl"]},"application/vnd.hp-hpid":{"source":"iana","extensions":["hpid"]},"application/vnd.hp-hps":{"source":"iana","extensions":["hps"]},"application/vnd.hp-jlyt":{"source":"iana","extensions":["jlt"]},"application/vnd.hp-pcl":{"source":"iana","extensions":["pcl"]},"application/vnd.hp-pclxl":{"source":"iana","extensions":["pclxl"]},"application/vnd.httphone":{"source":"iana"},"application/vnd.hydrostatix.sof-data":{"source":"iana","extensions":["sfd-hdstx"]},"application/vnd.hyper+json":{"source":"iana","compressible":true},"application/vnd.hyper-item+json":{"source":"iana","compressible":true},"application/vnd.hyperdrive+json":{"source":"iana","compressible":true},"application/vnd.hzn-3d-crossword":{"source":"iana"},"application/vnd.ibm.afplinedata":{"source":"iana"},"application/vnd.ibm.electronic-media":{"source":"iana"},"application/vnd.ibm.minipay":{"source":"iana","extensions":["mpy"]},"application/vnd.ibm.modcap":{"source":"iana","extensions":["afp","listafp","list3820"]},"application/vnd.ibm.rights-management":{"source":"iana","extensions":["irm"]},"application/vnd.ibm.secure-container":{"source":"iana","extensions":["sc"]},"application/vnd.iccprofile":{"source":"iana","extensions":["icc","icm"]},"application/vnd.ieee.1905":{"source":"iana"},"application/vnd.igloader":{"source":"iana","extensions":["igl"]},"application/vnd.imagemeter.folder+zip":{"source":"iana","compressible":false},"application/vnd.imagemeter.image+zip":{"source":"iana","compressible":false},"application/vnd.immervision-ivp":{"source":"iana","extensions":["ivp"]},"application/vnd.immervision-ivu":{"source":"iana","extensions":["ivu"]},"application/vnd.ims.imsccv1p1":{"source":"iana"},"application/vnd.ims.imsccv1p2":{"source":"iana"},"application/vnd.ims.imsccv1p3":{"source":"iana"},"application/vnd.ims.lis.v2.result+json":{"source":"iana","compressible":true},"application/vnd.ims.lti.v2.toolconsumerprofile+json":{"source":"iana","compressible":true},"application/vnd.ims.lti.v2.toolproxy+json":{"source":"iana","compressible":true},"application/vnd.ims.lti.v2.toolproxy.id+json":{"source":"iana","compressible":true},"application/vnd.ims.lti.v2.toolsettings+json":{"source":"iana","compressible":true},"application/vnd.ims.lti.v2.toolsettings.simple+json":{"source":"iana","compressible":true},"application/vnd.informedcontrol.rms+xml":{"source":"iana","compressible":true},"application/vnd.informix-visionary":{"source":"iana"},"application/vnd.infotech.project":{"source":"iana"},"application/vnd.infotech.project+xml":{"source":"iana","compressible":true},"application/vnd.innopath.wamp.notification":{"source":"iana"},"application/vnd.insors.igm":{"source":"iana","extensions":["igm"]},"application/vnd.intercon.formnet":{"source":"iana","extensions":["xpw","xpx"]},"application/vnd.intergeo":{"source":"iana","extensions":["i2g"]},"application/vnd.intertrust.digibox":{"source":"iana"},"application/vnd.intertrust.nncp":{"source":"iana"},"application/vnd.intu.qbo":{"source":"iana","extensions":["qbo"]},"application/vnd.intu.qfx":{"source":"iana","extensions":["qfx"]},"application/vnd.iptc.g2.catalogitem+xml":{"source":"iana","compressible":true},"application/vnd.iptc.g2.conceptitem+xml":{"source":"iana","compressible":true},"application/vnd.iptc.g2.knowledgeitem+xml":{"source":"iana","compressible":true},"application/vnd.iptc.g2.newsitem+xml":{"source":"iana","compressible":true},"application/vnd.iptc.g2.newsmessage+xml":{"source":"iana","compressible":true},"application/vnd.iptc.g2.packageitem+xml":{"source":"iana","compressible":true},"application/vnd.iptc.g2.planningitem+xml":{"source":"iana","compressible":true},"application/vnd.ipunplugged.rcprofile":{"source":"iana","extensions":["rcprofile"]},"application/vnd.irepository.package+xml":{"source":"iana","compressible":true,"extensions":["irp"]},"application/vnd.is-xpr":{"source":"iana","extensions":["xpr"]},"application/vnd.isac.fcs":{"source":"iana","extensions":["fcs"]},"application/vnd.iso11783-10+zip":{"source":"iana","compressible":false},"application/vnd.jam":{"source":"iana","extensions":["jam"]},"application/vnd.japannet-directory-service":{"source":"iana"},"application/vnd.japannet-jpnstore-wakeup":{"source":"iana"},"application/vnd.japannet-payment-wakeup":{"source":"iana"},"application/vnd.japannet-registration":{"source":"iana"},"application/vnd.japannet-registration-wakeup":{"source":"iana"},"application/vnd.japannet-setstore-wakeup":{"source":"iana"},"application/vnd.japannet-verification":{"source":"iana"},"application/vnd.japannet-verification-wakeup":{"source":"iana"},"application/vnd.jcp.javame.midlet-rms":{"source":"iana","extensions":["rms"]},"application/vnd.jisp":{"source":"iana","extensions":["jisp"]},"application/vnd.joost.joda-archive":{"source":"iana","extensions":["joda"]},"application/vnd.jsk.isdn-ngn":{"source":"iana"},"application/vnd.kahootz":{"source":"iana","extensions":["ktz","ktr"]},"application/vnd.kde.karbon":{"source":"iana","extensions":["karbon"]},"application/vnd.kde.kchart":{"source":"iana","extensions":["chrt"]},"application/vnd.kde.kformula":{"source":"iana","extensions":["kfo"]},"application/vnd.kde.kivio":{"source":"iana","extensions":["flw"]},"application/vnd.kde.kontour":{"source":"iana","extensions":["kon"]},"application/vnd.kde.kpresenter":{"source":"iana","extensions":["kpr","kpt"]},"application/vnd.kde.kspread":{"source":"iana","extensions":["ksp"]},"application/vnd.kde.kword":{"source":"iana","extensions":["kwd","kwt"]},"application/vnd.kenameaapp":{"source":"iana","extensions":["htke"]},"application/vnd.kidspiration":{"source":"iana","extensions":["kia"]},"application/vnd.kinar":{"source":"iana","extensions":["kne","knp"]},"application/vnd.koan":{"source":"iana","extensions":["skp","skd","skt","skm"]},"application/vnd.kodak-descriptor":{"source":"iana","extensions":["sse"]},"application/vnd.las":{"source":"iana"},"application/vnd.las.las+json":{"source":"iana","compressible":true},"application/vnd.las.las+xml":{"source":"iana","compressible":true,"extensions":["lasxml"]},"application/vnd.laszip":{"source":"iana"},"application/vnd.leap+json":{"source":"iana","compressible":true},"application/vnd.liberty-request+xml":{"source":"iana","compressible":true},"application/vnd.llamagraphics.life-balance.desktop":{"source":"iana","extensions":["lbd"]},"application/vnd.llamagraphics.life-balance.exchange+xml":{"source":"iana","compressible":true,"extensions":["lbe"]},"application/vnd.logipipe.circuit+zip":{"source":"iana","compressible":false},"application/vnd.loom":{"source":"iana"},"application/vnd.lotus-1-2-3":{"source":"iana","extensions":["123"]},"application/vnd.lotus-approach":{"source":"iana","extensions":["apr"]},"application/vnd.lotus-freelance":{"source":"iana","extensions":["pre"]},"application/vnd.lotus-notes":{"source":"iana","extensions":["nsf"]},"application/vnd.lotus-organizer":{"source":"iana","extensions":["org"]},"application/vnd.lotus-screencam":{"source":"iana","extensions":["scm"]},"application/vnd.lotus-wordpro":{"source":"iana","extensions":["lwp"]},"application/vnd.macports.portpkg":{"source":"iana","extensions":["portpkg"]},"application/vnd.mapbox-vector-tile":{"source":"iana","extensions":["mvt"]},"application/vnd.marlin.drm.actiontoken+xml":{"source":"iana","compressible":true},"application/vnd.marlin.drm.conftoken+xml":{"source":"iana","compressible":true},"application/vnd.marlin.drm.license+xml":{"source":"iana","compressible":true},"application/vnd.marlin.drm.mdcf":{"source":"iana"},"application/vnd.mason+json":{"source":"iana","compressible":true},"application/vnd.maxar.archive.3tz+zip":{"source":"iana","compressible":false},"application/vnd.maxmind.maxmind-db":{"source":"iana"},"application/vnd.mcd":{"source":"iana","extensions":["mcd"]},"application/vnd.medcalcdata":{"source":"iana","extensions":["mc1"]},"application/vnd.mediastation.cdkey":{"source":"iana","extensions":["cdkey"]},"application/vnd.meridian-slingshot":{"source":"iana"},"application/vnd.mfer":{"source":"iana","extensions":["mwf"]},"application/vnd.mfmp":{"source":"iana","extensions":["mfm"]},"application/vnd.micro+json":{"source":"iana","compressible":true},"application/vnd.micrografx.flo":{"source":"iana","extensions":["flo"]},"application/vnd.micrografx.igx":{"source":"iana","extensions":["igx"]},"application/vnd.microsoft.portable-executable":{"source":"iana"},"application/vnd.microsoft.windows.thumbnail-cache":{"source":"iana"},"application/vnd.miele+json":{"source":"iana","compressible":true},"application/vnd.mif":{"source":"iana","extensions":["mif"]},"application/vnd.minisoft-hp3000-save":{"source":"iana"},"application/vnd.mitsubishi.misty-guard.trustweb":{"source":"iana"},"application/vnd.mobius.daf":{"source":"iana","extensions":["daf"]},"application/vnd.mobius.dis":{"source":"iana","extensions":["dis"]},"application/vnd.mobius.mbk":{"source":"iana","extensions":["mbk"]},"application/vnd.mobius.mqy":{"source":"iana","extensions":["mqy"]},"application/vnd.mobius.msl":{"source":"iana","extensions":["msl"]},"application/vnd.mobius.plc":{"source":"iana","extensions":["plc"]},"application/vnd.mobius.txf":{"source":"iana","extensions":["txf"]},"application/vnd.mophun.application":{"source":"iana","extensions":["mpn"]},"application/vnd.mophun.certificate":{"source":"iana","extensions":["mpc"]},"application/vnd.motorola.flexsuite":{"source":"iana"},"application/vnd.motorola.flexsuite.adsi":{"source":"iana"},"application/vnd.motorola.flexsuite.fis":{"source":"iana"},"application/vnd.motorola.flexsuite.gotap":{"source":"iana"},"application/vnd.motorola.flexsuite.kmr":{"source":"iana"},"application/vnd.motorola.flexsuite.ttc":{"source":"iana"},"application/vnd.motorola.flexsuite.wem":{"source":"iana"},"application/vnd.motorola.iprm":{"source":"iana"},"application/vnd.mozilla.xul+xml":{"source":"iana","compressible":true,"extensions":["xul"]},"application/vnd.ms-3mfdocument":{"source":"iana"},"application/vnd.ms-artgalry":{"source":"iana","extensions":["cil"]},"application/vnd.ms-asf":{"source":"iana"},"application/vnd.ms-cab-compressed":{"source":"iana","extensions":["cab"]},"application/vnd.ms-color.iccprofile":{"source":"apache"},"application/vnd.ms-excel":{"source":"iana","compressible":false,"extensions":["xls","xlm","xla","xlc","xlt","xlw"]},"application/vnd.ms-excel.addin.macroenabled.12":{"source":"iana","extensions":["xlam"]},"application/vnd.ms-excel.sheet.binary.macroenabled.12":{"source":"iana","extensions":["xlsb"]},"application/vnd.ms-excel.sheet.macroenabled.12":{"source":"iana","extensions":["xlsm"]},"application/vnd.ms-excel.template.macroenabled.12":{"source":"iana","extensions":["xltm"]},"application/vnd.ms-fontobject":{"source":"iana","compressible":true,"extensions":["eot"]},"application/vnd.ms-htmlhelp":{"source":"iana","extensions":["chm"]},"application/vnd.ms-ims":{"source":"iana","extensions":["ims"]},"application/vnd.ms-lrm":{"source":"iana","extensions":["lrm"]},"application/vnd.ms-office.activex+xml":{"source":"iana","compressible":true},"application/vnd.ms-officetheme":{"source":"iana","extensions":["thmx"]},"application/vnd.ms-opentype":{"source":"apache","compressible":true},"application/vnd.ms-outlook":{"compressible":false,"extensions":["msg"]},"application/vnd.ms-package.obfuscated-opentype":{"source":"apache"},"application/vnd.ms-pki.seccat":{"source":"apache","extensions":["cat"]},"application/vnd.ms-pki.stl":{"source":"apache","extensions":["stl"]},"application/vnd.ms-playready.initiator+xml":{"source":"iana","compressible":true},"application/vnd.ms-powerpoint":{"source":"iana","compressible":false,"extensions":["ppt","pps","pot"]},"application/vnd.ms-powerpoint.addin.macroenabled.12":{"source":"iana","extensions":["ppam"]},"application/vnd.ms-powerpoint.presentation.macroenabled.12":{"source":"iana","extensions":["pptm"]},"application/vnd.ms-powerpoint.slide.macroenabled.12":{"source":"iana","extensions":["sldm"]},"application/vnd.ms-powerpoint.slideshow.macroenabled.12":{"source":"iana","extensions":["ppsm"]},"application/vnd.ms-powerpoint.template.macroenabled.12":{"source":"iana","extensions":["potm"]},"application/vnd.ms-printdevicecapabilities+xml":{"source":"iana","compressible":true},"application/vnd.ms-printing.printticket+xml":{"source":"apache","compressible":true},"application/vnd.ms-printschematicket+xml":{"source":"iana","compressible":true},"application/vnd.ms-project":{"source":"iana","extensions":["mpp","mpt"]},"application/vnd.ms-tnef":{"source":"iana"},"application/vnd.ms-windows.devicepairing":{"source":"iana"},"application/vnd.ms-windows.nwprinting.oob":{"source":"iana"},"application/vnd.ms-windows.printerpairing":{"source":"iana"},"application/vnd.ms-windows.wsd.oob":{"source":"iana"},"application/vnd.ms-wmdrm.lic-chlg-req":{"source":"iana"},"application/vnd.ms-wmdrm.lic-resp":{"source":"iana"},"application/vnd.ms-wmdrm.meter-chlg-req":{"source":"iana"},"application/vnd.ms-wmdrm.meter-resp":{"source":"iana"},"application/vnd.ms-word.document.macroenabled.12":{"source":"iana","extensions":["docm"]},"application/vnd.ms-word.template.macroenabled.12":{"source":"iana","extensions":["dotm"]},"application/vnd.ms-works":{"source":"iana","extensions":["wps","wks","wcm","wdb"]},"application/vnd.ms-wpl":{"source":"iana","extensions":["wpl"]},"application/vnd.ms-xpsdocument":{"source":"iana","compressible":false,"extensions":["xps"]},"application/vnd.msa-disk-image":{"source":"iana"},"application/vnd.mseq":{"source":"iana","extensions":["mseq"]},"application/vnd.msign":{"source":"iana"},"application/vnd.multiad.creator":{"source":"iana"},"application/vnd.multiad.creator.cif":{"source":"iana"},"application/vnd.music-niff":{"source":"iana"},"application/vnd.musician":{"source":"iana","extensions":["mus"]},"application/vnd.muvee.style":{"source":"iana","extensions":["msty"]},"application/vnd.mynfc":{"source":"iana","extensions":["taglet"]},"application/vnd.nacamar.ybrid+json":{"source":"iana","compressible":true},"application/vnd.ncd.control":{"source":"iana"},"application/vnd.ncd.reference":{"source":"iana"},"application/vnd.nearst.inv+json":{"source":"iana","compressible":true},"application/vnd.nebumind.line":{"source":"iana"},"application/vnd.nervana":{"source":"iana"},"application/vnd.netfpx":{"source":"iana"},"application/vnd.neurolanguage.nlu":{"source":"iana","extensions":["nlu"]},"application/vnd.nimn":{"source":"iana"},"application/vnd.nintendo.nitro.rom":{"source":"iana"},"application/vnd.nintendo.snes.rom":{"source":"iana"},"application/vnd.nitf":{"source":"iana","extensions":["ntf","nitf"]},"application/vnd.noblenet-directory":{"source":"iana","extensions":["nnd"]},"application/vnd.noblenet-sealer":{"source":"iana","extensions":["nns"]},"application/vnd.noblenet-web":{"source":"iana","extensions":["nnw"]},"application/vnd.nokia.catalogs":{"source":"iana"},"application/vnd.nokia.conml+wbxml":{"source":"iana"},"application/vnd.nokia.conml+xml":{"source":"iana","compressible":true},"application/vnd.nokia.iptv.config+xml":{"source":"iana","compressible":true},"application/vnd.nokia.isds-radio-presets":{"source":"iana"},"application/vnd.nokia.landmark+wbxml":{"source":"iana"},"application/vnd.nokia.landmark+xml":{"source":"iana","compressible":true},"application/vnd.nokia.landmarkcollection+xml":{"source":"iana","compressible":true},"application/vnd.nokia.n-gage.ac+xml":{"source":"iana","compressible":true,"extensions":["ac"]},"application/vnd.nokia.n-gage.data":{"source":"iana","extensions":["ngdat"]},"application/vnd.nokia.n-gage.symbian.install":{"source":"iana","extensions":["n-gage"]},"application/vnd.nokia.ncd":{"source":"iana"},"application/vnd.nokia.pcd+wbxml":{"source":"iana"},"application/vnd.nokia.pcd+xml":{"source":"iana","compressible":true},"application/vnd.nokia.radio-preset":{"source":"iana","extensions":["rpst"]},"application/vnd.nokia.radio-presets":{"source":"iana","extensions":["rpss"]},"application/vnd.novadigm.edm":{"source":"iana","extensions":["edm"]},"application/vnd.novadigm.edx":{"source":"iana","extensions":["edx"]},"application/vnd.novadigm.ext":{"source":"iana","extensions":["ext"]},"application/vnd.ntt-local.content-share":{"source":"iana"},"application/vnd.ntt-local.file-transfer":{"source":"iana"},"application/vnd.ntt-local.ogw_remote-access":{"source":"iana"},"application/vnd.ntt-local.sip-ta_remote":{"source":"iana"},"application/vnd.ntt-local.sip-ta_tcp_stream":{"source":"iana"},"application/vnd.oasis.opendocument.chart":{"source":"iana","extensions":["odc"]},"application/vnd.oasis.opendocument.chart-template":{"source":"iana","extensions":["otc"]},"application/vnd.oasis.opendocument.database":{"source":"iana","extensions":["odb"]},"application/vnd.oasis.opendocument.formula":{"source":"iana","extensions":["odf"]},"application/vnd.oasis.opendocument.formula-template":{"source":"iana","extensions":["odft"]},"application/vnd.oasis.opendocument.graphics":{"source":"iana","compressible":false,"extensions":["odg"]},"application/vnd.oasis.opendocument.graphics-template":{"source":"iana","extensions":["otg"]},"application/vnd.oasis.opendocument.image":{"source":"iana","extensions":["odi"]},"application/vnd.oasis.opendocument.image-template":{"source":"iana","extensions":["oti"]},"application/vnd.oasis.opendocument.presentation":{"source":"iana","compressible":false,"extensions":["odp"]},"application/vnd.oasis.opendocument.presentation-template":{"source":"iana","extensions":["otp"]},"application/vnd.oasis.opendocument.spreadsheet":{"source":"iana","compressible":false,"extensions":["ods"]},"application/vnd.oasis.opendocument.spreadsheet-template":{"source":"iana","extensions":["ots"]},"application/vnd.oasis.opendocument.text":{"source":"iana","compressible":false,"extensions":["odt"]},"application/vnd.oasis.opendocument.text-master":{"source":"iana","extensions":["odm"]},"application/vnd.oasis.opendocument.text-template":{"source":"iana","extensions":["ott"]},"application/vnd.oasis.opendocument.text-web":{"source":"iana","extensions":["oth"]},"application/vnd.obn":{"source":"iana"},"application/vnd.ocf+cbor":{"source":"iana"},"application/vnd.oci.image.manifest.v1+json":{"source":"iana","compressible":true},"application/vnd.oftn.l10n+json":{"source":"iana","compressible":true},"application/vnd.oipf.contentaccessdownload+xml":{"source":"iana","compressible":true},"application/vnd.oipf.contentaccessstreaming+xml":{"source":"iana","compressible":true},"application/vnd.oipf.cspg-hexbinary":{"source":"iana"},"application/vnd.oipf.dae.svg+xml":{"source":"iana","compressible":true},"application/vnd.oipf.dae.xhtml+xml":{"source":"iana","compressible":true},"application/vnd.oipf.mippvcontrolmessage+xml":{"source":"iana","compressible":true},"application/vnd.oipf.pae.gem":{"source":"iana"},"application/vnd.oipf.spdiscovery+xml":{"source":"iana","compressible":true},"application/vnd.oipf.spdlist+xml":{"source":"iana","compressible":true},"application/vnd.oipf.ueprofile+xml":{"source":"iana","compressible":true},"application/vnd.oipf.userprofile+xml":{"source":"iana","compressible":true},"application/vnd.olpc-sugar":{"source":"iana","extensions":["xo"]},"application/vnd.oma-scws-config":{"source":"iana"},"application/vnd.oma-scws-http-request":{"source":"iana"},"application/vnd.oma-scws-http-response":{"source":"iana"},"application/vnd.oma.bcast.associated-procedure-parameter+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.drm-trigger+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.imd+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.ltkm":{"source":"iana"},"application/vnd.oma.bcast.notification+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.provisioningtrigger":{"source":"iana"},"application/vnd.oma.bcast.sgboot":{"source":"iana"},"application/vnd.oma.bcast.sgdd+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.sgdu":{"source":"iana"},"application/vnd.oma.bcast.simple-symbol-container":{"source":"iana"},"application/vnd.oma.bcast.smartcard-trigger+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.sprov+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.stkm":{"source":"iana"},"application/vnd.oma.cab-address-book+xml":{"source":"iana","compressible":true},"application/vnd.oma.cab-feature-handler+xml":{"source":"iana","compressible":true},"application/vnd.oma.cab-pcc+xml":{"source":"iana","compressible":true},"application/vnd.oma.cab-subs-invite+xml":{"source":"iana","compressible":true},"application/vnd.oma.cab-user-prefs+xml":{"source":"iana","compressible":true},"application/vnd.oma.dcd":{"source":"iana"},"application/vnd.oma.dcdc":{"source":"iana"},"application/vnd.oma.dd2+xml":{"source":"iana","compressible":true,"extensions":["dd2"]},"application/vnd.oma.drm.risd+xml":{"source":"iana","compressible":true},"application/vnd.oma.group-usage-list+xml":{"source":"iana","compressible":true},"application/vnd.oma.lwm2m+cbor":{"source":"iana"},"application/vnd.oma.lwm2m+json":{"source":"iana","compressible":true},"application/vnd.oma.lwm2m+tlv":{"source":"iana"},"application/vnd.oma.pal+xml":{"source":"iana","compressible":true},"application/vnd.oma.poc.detailed-progress-report+xml":{"source":"iana","compressible":true},"application/vnd.oma.poc.final-report+xml":{"source":"iana","compressible":true},"application/vnd.oma.poc.groups+xml":{"source":"iana","compressible":true},"application/vnd.oma.poc.invocation-descriptor+xml":{"source":"iana","compressible":true},"application/vnd.oma.poc.optimized-progress-report+xml":{"source":"iana","compressible":true},"application/vnd.oma.push":{"source":"iana"},"application/vnd.oma.scidm.messages+xml":{"source":"iana","compressible":true},"application/vnd.oma.xcap-directory+xml":{"source":"iana","compressible":true},"application/vnd.omads-email+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/vnd.omads-file+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/vnd.omads-folder+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/vnd.omaloc-supl-init":{"source":"iana"},"application/vnd.onepager":{"source":"iana"},"application/vnd.onepagertamp":{"source":"iana"},"application/vnd.onepagertamx":{"source":"iana"},"application/vnd.onepagertat":{"source":"iana"},"application/vnd.onepagertatp":{"source":"iana"},"application/vnd.onepagertatx":{"source":"iana"},"application/vnd.openblox.game+xml":{"source":"iana","compressible":true,"extensions":["obgx"]},"application/vnd.openblox.game-binary":{"source":"iana"},"application/vnd.openeye.oeb":{"source":"iana"},"application/vnd.openofficeorg.extension":{"source":"apache","extensions":["oxt"]},"application/vnd.openstreetmap.data+xml":{"source":"iana","compressible":true,"extensions":["osm"]},"application/vnd.opentimestamps.ots":{"source":"iana"},"application/vnd.openxmlformats-officedocument.custom-properties+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.customxmlproperties+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawing+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawingml.chart+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawingml.diagramcolors+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawingml.diagramdata+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawingml.diagramlayout+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawingml.diagramstyle+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.extended-properties+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.commentauthors+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.comments+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.handoutmaster+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.notesmaster+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.notesslide+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.presentation":{"source":"iana","compressible":false,"extensions":["pptx"]},"application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.presprops+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.slide":{"source":"iana","extensions":["sldx"]},"application/vnd.openxmlformats-officedocument.presentationml.slide+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.slidelayout+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.slidemaster+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.slideshow":{"source":"iana","extensions":["ppsx"]},"application/vnd.openxmlformats-officedocument.presentationml.slideshow.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.slideupdateinfo+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.tablestyles+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.tags+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.template":{"source":"iana","extensions":["potx"]},"application/vnd.openxmlformats-officedocument.presentationml.template.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.viewprops+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.calcchain+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.connections+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.externallink+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcachedefinition+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcacherecords+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.pivottable+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.querytable+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.revisionheaders+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.revisionlog+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.sharedstrings+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":{"source":"iana","compressible":false,"extensions":["xlsx"]},"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.sheetmetadata+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.tablesinglecells+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.template":{"source":"iana","extensions":["xltx"]},"application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.usernames+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.volatiledependencies+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.theme+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.themeoverride+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.vmldrawing":{"source":"iana"},"application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.document":{"source":"iana","compressible":false,"extensions":["docx"]},"application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.fonttable+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.template":{"source":"iana","extensions":["dotx"]},"application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.websettings+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-package.core-properties+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-package.digital-signature-xmlsignature+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-package.relationships+xml":{"source":"iana","compressible":true},"application/vnd.oracle.resource+json":{"source":"iana","compressible":true},"application/vnd.orange.indata":{"source":"iana"},"application/vnd.osa.netdeploy":{"source":"iana"},"application/vnd.osgeo.mapguide.package":{"source":"iana","extensions":["mgp"]},"application/vnd.osgi.bundle":{"source":"iana"},"application/vnd.osgi.dp":{"source":"iana","extensions":["dp"]},"application/vnd.osgi.subsystem":{"source":"iana","extensions":["esa"]},"application/vnd.otps.ct-kip+xml":{"source":"iana","compressible":true},"application/vnd.oxli.countgraph":{"source":"iana"},"application/vnd.pagerduty+json":{"source":"iana","compressible":true},"application/vnd.palm":{"source":"iana","extensions":["pdb","pqa","oprc"]},"application/vnd.panoply":{"source":"iana"},"application/vnd.paos.xml":{"source":"iana"},"application/vnd.patentdive":{"source":"iana"},"application/vnd.patientecommsdoc":{"source":"iana"},"application/vnd.pawaafile":{"source":"iana","extensions":["paw"]},"application/vnd.pcos":{"source":"iana"},"application/vnd.pg.format":{"source":"iana","extensions":["str"]},"application/vnd.pg.osasli":{"source":"iana","extensions":["ei6"]},"application/vnd.piaccess.application-licence":{"source":"iana"},"application/vnd.picsel":{"source":"iana","extensions":["efif"]},"application/vnd.pmi.widget":{"source":"iana","extensions":["wg"]},"application/vnd.poc.group-advertisement+xml":{"source":"iana","compressible":true},"application/vnd.pocketlearn":{"source":"iana","extensions":["plf"]},"application/vnd.powerbuilder6":{"source":"iana","extensions":["pbd"]},"application/vnd.powerbuilder6-s":{"source":"iana"},"application/vnd.powerbuilder7":{"source":"iana"},"application/vnd.powerbuilder7-s":{"source":"iana"},"application/vnd.powerbuilder75":{"source":"iana"},"application/vnd.powerbuilder75-s":{"source":"iana"},"application/vnd.preminet":{"source":"iana"},"application/vnd.previewsystems.box":{"source":"iana","extensions":["box"]},"application/vnd.proteus.magazine":{"source":"iana","extensions":["mgz"]},"application/vnd.psfs":{"source":"iana"},"application/vnd.publishare-delta-tree":{"source":"iana","extensions":["qps"]},"application/vnd.pvi.ptid1":{"source":"iana","extensions":["ptid"]},"application/vnd.pwg-multiplexed":{"source":"iana"},"application/vnd.pwg-xhtml-print+xml":{"source":"iana","compressible":true},"application/vnd.qualcomm.brew-app-res":{"source":"iana"},"application/vnd.quarantainenet":{"source":"iana"},"application/vnd.quark.quarkxpress":{"source":"iana","extensions":["qxd","qxt","qwd","qwt","qxl","qxb"]},"application/vnd.quobject-quoxdocument":{"source":"iana"},"application/vnd.radisys.moml+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-audit+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-audit-conf+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-audit-conn+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-audit-dialog+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-audit-stream+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-conf+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog-base+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog-fax-detect+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog-fax-sendrecv+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog-group+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog-speech+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog-transform+xml":{"source":"iana","compressible":true},"application/vnd.rainstor.data":{"source":"iana"},"application/vnd.rapid":{"source":"iana"},"application/vnd.rar":{"source":"iana","extensions":["rar"]},"application/vnd.realvnc.bed":{"source":"iana","extensions":["bed"]},"application/vnd.recordare.musicxml":{"source":"iana","extensions":["mxl"]},"application/vnd.recordare.musicxml+xml":{"source":"iana","compressible":true,"extensions":["musicxml"]},"application/vnd.renlearn.rlprint":{"source":"iana"},"application/vnd.resilient.logic":{"source":"iana"},"application/vnd.restful+json":{"source":"iana","compressible":true},"application/vnd.rig.cryptonote":{"source":"iana","extensions":["cryptonote"]},"application/vnd.rim.cod":{"source":"apache","extensions":["cod"]},"application/vnd.rn-realmedia":{"source":"apache","extensions":["rm"]},"application/vnd.rn-realmedia-vbr":{"source":"apache","extensions":["rmvb"]},"application/vnd.route66.link66+xml":{"source":"iana","compressible":true,"extensions":["link66"]},"application/vnd.rs-274x":{"source":"iana"},"application/vnd.ruckus.download":{"source":"iana"},"application/vnd.s3sms":{"source":"iana"},"application/vnd.sailingtracker.track":{"source":"iana","extensions":["st"]},"application/vnd.sar":{"source":"iana"},"application/vnd.sbm.cid":{"source":"iana"},"application/vnd.sbm.mid2":{"source":"iana"},"application/vnd.scribus":{"source":"iana"},"application/vnd.sealed.3df":{"source":"iana"},"application/vnd.sealed.csf":{"source":"iana"},"application/vnd.sealed.doc":{"source":"iana"},"application/vnd.sealed.eml":{"source":"iana"},"application/vnd.sealed.mht":{"source":"iana"},"application/vnd.sealed.net":{"source":"iana"},"application/vnd.sealed.ppt":{"source":"iana"},"application/vnd.sealed.tiff":{"source":"iana"},"application/vnd.sealed.xls":{"source":"iana"},"application/vnd.sealedmedia.softseal.html":{"source":"iana"},"application/vnd.sealedmedia.softseal.pdf":{"source":"iana"},"application/vnd.seemail":{"source":"iana","extensions":["see"]},"application/vnd.seis+json":{"source":"iana","compressible":true},"application/vnd.sema":{"source":"iana","extensions":["sema"]},"application/vnd.semd":{"source":"iana","extensions":["semd"]},"application/vnd.semf":{"source":"iana","extensions":["semf"]},"application/vnd.shade-save-file":{"source":"iana"},"application/vnd.shana.informed.formdata":{"source":"iana","extensions":["ifm"]},"application/vnd.shana.informed.formtemplate":{"source":"iana","extensions":["itp"]},"application/vnd.shana.informed.interchange":{"source":"iana","extensions":["iif"]},"application/vnd.shana.informed.package":{"source":"iana","extensions":["ipk"]},"application/vnd.shootproof+json":{"source":"iana","compressible":true},"application/vnd.shopkick+json":{"source":"iana","compressible":true},"application/vnd.shp":{"source":"iana"},"application/vnd.shx":{"source":"iana"},"application/vnd.sigrok.session":{"source":"iana"},"application/vnd.simtech-mindmapper":{"source":"iana","extensions":["twd","twds"]},"application/vnd.siren+json":{"source":"iana","compressible":true},"application/vnd.smaf":{"source":"iana","extensions":["mmf"]},"application/vnd.smart.notebook":{"source":"iana"},"application/vnd.smart.teacher":{"source":"iana","extensions":["teacher"]},"application/vnd.snesdev-page-table":{"source":"iana"},"application/vnd.software602.filler.form+xml":{"source":"iana","compressible":true,"extensions":["fo"]},"application/vnd.software602.filler.form-xml-zip":{"source":"iana"},"application/vnd.solent.sdkm+xml":{"source":"iana","compressible":true,"extensions":["sdkm","sdkd"]},"application/vnd.spotfire.dxp":{"source":"iana","extensions":["dxp"]},"application/vnd.spotfire.sfs":{"source":"iana","extensions":["sfs"]},"application/vnd.sqlite3":{"source":"iana"},"application/vnd.sss-cod":{"source":"iana"},"application/vnd.sss-dtf":{"source":"iana"},"application/vnd.sss-ntf":{"source":"iana"},"application/vnd.stardivision.calc":{"source":"apache","extensions":["sdc"]},"application/vnd.stardivision.draw":{"source":"apache","extensions":["sda"]},"application/vnd.stardivision.impress":{"source":"apache","extensions":["sdd"]},"application/vnd.stardivision.math":{"source":"apache","extensions":["smf"]},"application/vnd.stardivision.writer":{"source":"apache","extensions":["sdw","vor"]},"application/vnd.stardivision.writer-global":{"source":"apache","extensions":["sgl"]},"application/vnd.stepmania.package":{"source":"iana","extensions":["smzip"]},"application/vnd.stepmania.stepchart":{"source":"iana","extensions":["sm"]},"application/vnd.street-stream":{"source":"iana"},"application/vnd.sun.wadl+xml":{"source":"iana","compressible":true,"extensions":["wadl"]},"application/vnd.sun.xml.calc":{"source":"apache","extensions":["sxc"]},"application/vnd.sun.xml.calc.template":{"source":"apache","extensions":["stc"]},"application/vnd.sun.xml.draw":{"source":"apache","extensions":["sxd"]},"application/vnd.sun.xml.draw.template":{"source":"apache","extensions":["std"]},"application/vnd.sun.xml.impress":{"source":"apache","extensions":["sxi"]},"application/vnd.sun.xml.impress.template":{"source":"apache","extensions":["sti"]},"application/vnd.sun.xml.math":{"source":"apache","extensions":["sxm"]},"application/vnd.sun.xml.writer":{"source":"apache","extensions":["sxw"]},"application/vnd.sun.xml.writer.global":{"source":"apache","extensions":["sxg"]},"application/vnd.sun.xml.writer.template":{"source":"apache","extensions":["stw"]},"application/vnd.sus-calendar":{"source":"iana","extensions":["sus","susp"]},"application/vnd.svd":{"source":"iana","extensions":["svd"]},"application/vnd.swiftview-ics":{"source":"iana"},"application/vnd.sycle+xml":{"source":"iana","compressible":true},"application/vnd.syft+json":{"source":"iana","compressible":true},"application/vnd.symbian.install":{"source":"apache","extensions":["sis","sisx"]},"application/vnd.syncml+xml":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["xsm"]},"application/vnd.syncml.dm+wbxml":{"source":"iana","charset":"UTF-8","extensions":["bdm"]},"application/vnd.syncml.dm+xml":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["xdm"]},"application/vnd.syncml.dm.notification":{"source":"iana"},"application/vnd.syncml.dmddf+wbxml":{"source":"iana"},"application/vnd.syncml.dmddf+xml":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["ddf"]},"application/vnd.syncml.dmtnds+wbxml":{"source":"iana"},"application/vnd.syncml.dmtnds+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/vnd.syncml.ds.notification":{"source":"iana"},"application/vnd.tableschema+json":{"source":"iana","compressible":true},"application/vnd.tao.intent-module-archive":{"source":"iana","extensions":["tao"]},"application/vnd.tcpdump.pcap":{"source":"iana","extensions":["pcap","cap","dmp"]},"application/vnd.think-cell.ppttc+json":{"source":"iana","compressible":true},"application/vnd.tmd.mediaflex.api+xml":{"source":"iana","compressible":true},"application/vnd.tml":{"source":"iana"},"application/vnd.tmobile-livetv":{"source":"iana","extensions":["tmo"]},"application/vnd.tri.onesource":{"source":"iana"},"application/vnd.trid.tpt":{"source":"iana","extensions":["tpt"]},"application/vnd.triscape.mxs":{"source":"iana","extensions":["mxs"]},"application/vnd.trueapp":{"source":"iana","extensions":["tra"]},"application/vnd.truedoc":{"source":"iana"},"application/vnd.ubisoft.webplayer":{"source":"iana"},"application/vnd.ufdl":{"source":"iana","extensions":["ufd","ufdl"]},"application/vnd.uiq.theme":{"source":"iana","extensions":["utz"]},"application/vnd.umajin":{"source":"iana","extensions":["umj"]},"application/vnd.unity":{"source":"iana","extensions":["unityweb"]},"application/vnd.uoml+xml":{"source":"iana","compressible":true,"extensions":["uoml"]},"application/vnd.uplanet.alert":{"source":"iana"},"application/vnd.uplanet.alert-wbxml":{"source":"iana"},"application/vnd.uplanet.bearer-choice":{"source":"iana"},"application/vnd.uplanet.bearer-choice-wbxml":{"source":"iana"},"application/vnd.uplanet.cacheop":{"source":"iana"},"application/vnd.uplanet.cacheop-wbxml":{"source":"iana"},"application/vnd.uplanet.channel":{"source":"iana"},"application/vnd.uplanet.channel-wbxml":{"source":"iana"},"application/vnd.uplanet.list":{"source":"iana"},"application/vnd.uplanet.list-wbxml":{"source":"iana"},"application/vnd.uplanet.listcmd":{"source":"iana"},"application/vnd.uplanet.listcmd-wbxml":{"source":"iana"},"application/vnd.uplanet.signal":{"source":"iana"},"application/vnd.uri-map":{"source":"iana"},"application/vnd.valve.source.material":{"source":"iana"},"application/vnd.vcx":{"source":"iana","extensions":["vcx"]},"application/vnd.vd-study":{"source":"iana"},"application/vnd.vectorworks":{"source":"iana"},"application/vnd.vel+json":{"source":"iana","compressible":true},"application/vnd.verimatrix.vcas":{"source":"iana"},"application/vnd.veritone.aion+json":{"source":"iana","compressible":true},"application/vnd.veryant.thin":{"source":"iana"},"application/vnd.ves.encrypted":{"source":"iana"},"application/vnd.vidsoft.vidconference":{"source":"iana"},"application/vnd.visio":{"source":"iana","extensions":["vsd","vst","vss","vsw"]},"application/vnd.visionary":{"source":"iana","extensions":["vis"]},"application/vnd.vividence.scriptfile":{"source":"iana"},"application/vnd.vsf":{"source":"iana","extensions":["vsf"]},"application/vnd.wap.sic":{"source":"iana"},"application/vnd.wap.slc":{"source":"iana"},"application/vnd.wap.wbxml":{"source":"iana","charset":"UTF-8","extensions":["wbxml"]},"application/vnd.wap.wmlc":{"source":"iana","extensions":["wmlc"]},"application/vnd.wap.wmlscriptc":{"source":"iana","extensions":["wmlsc"]},"application/vnd.webturbo":{"source":"iana","extensions":["wtb"]},"application/vnd.wfa.dpp":{"source":"iana"},"application/vnd.wfa.p2p":{"source":"iana"},"application/vnd.wfa.wsc":{"source":"iana"},"application/vnd.windows.devicepairing":{"source":"iana"},"application/vnd.wmc":{"source":"iana"},"application/vnd.wmf.bootstrap":{"source":"iana"},"application/vnd.wolfram.mathematica":{"source":"iana"},"application/vnd.wolfram.mathematica.package":{"source":"iana"},"application/vnd.wolfram.player":{"source":"iana","extensions":["nbp"]},"application/vnd.wordperfect":{"source":"iana","extensions":["wpd"]},"application/vnd.wqd":{"source":"iana","extensions":["wqd"]},"application/vnd.wrq-hp3000-labelled":{"source":"iana"},"application/vnd.wt.stf":{"source":"iana","extensions":["stf"]},"application/vnd.wv.csp+wbxml":{"source":"iana"},"application/vnd.wv.csp+xml":{"source":"iana","compressible":true},"application/vnd.wv.ssp+xml":{"source":"iana","compressible":true},"application/vnd.xacml+json":{"source":"iana","compressible":true},"application/vnd.xara":{"source":"iana","extensions":["xar"]},"application/vnd.xfdl":{"source":"iana","extensions":["xfdl"]},"application/vnd.xfdl.webform":{"source":"iana"},"application/vnd.xmi+xml":{"source":"iana","compressible":true},"application/vnd.xmpie.cpkg":{"source":"iana"},"application/vnd.xmpie.dpkg":{"source":"iana"},"application/vnd.xmpie.plan":{"source":"iana"},"application/vnd.xmpie.ppkg":{"source":"iana"},"application/vnd.xmpie.xlim":{"source":"iana"},"application/vnd.yamaha.hv-dic":{"source":"iana","extensions":["hvd"]},"application/vnd.yamaha.hv-script":{"source":"iana","extensions":["hvs"]},"application/vnd.yamaha.hv-voice":{"source":"iana","extensions":["hvp"]},"application/vnd.yamaha.openscoreformat":{"source":"iana","extensions":["osf"]},"application/vnd.yamaha.openscoreformat.osfpvg+xml":{"source":"iana","compressible":true,"extensions":["osfpvg"]},"application/vnd.yamaha.remote-setup":{"source":"iana"},"application/vnd.yamaha.smaf-audio":{"source":"iana","extensions":["saf"]},"application/vnd.yamaha.smaf-phrase":{"source":"iana","extensions":["spf"]},"application/vnd.yamaha.through-ngn":{"source":"iana"},"application/vnd.yamaha.tunnel-udpencap":{"source":"iana"},"application/vnd.yaoweme":{"source":"iana"},"application/vnd.yellowriver-custom-menu":{"source":"iana","extensions":["cmp"]},"application/vnd.youtube.yt":{"source":"iana"},"application/vnd.zul":{"source":"iana","extensions":["zir","zirz"]},"application/vnd.zzazz.deck+xml":{"source":"iana","compressible":true,"extensions":["zaz"]},"application/voicexml+xml":{"source":"iana","compressible":true,"extensions":["vxml"]},"application/voucher-cms+json":{"source":"iana","compressible":true},"application/vq-rtcpxr":{"source":"iana"},"application/wasm":{"source":"iana","compressible":true,"extensions":["wasm"]},"application/watcherinfo+xml":{"source":"iana","compressible":true,"extensions":["wif"]},"application/webpush-options+json":{"source":"iana","compressible":true},"application/whoispp-query":{"source":"iana"},"application/whoispp-response":{"source":"iana"},"application/widget":{"source":"iana","extensions":["wgt"]},"application/winhlp":{"source":"apache","extensions":["hlp"]},"application/wita":{"source":"iana"},"application/wordperfect5.1":{"source":"iana"},"application/wsdl+xml":{"source":"iana","compressible":true,"extensions":["wsdl"]},"application/wspolicy+xml":{"source":"iana","compressible":true,"extensions":["wspolicy"]},"application/x-7z-compressed":{"source":"apache","compressible":false,"extensions":["7z"]},"application/x-abiword":{"source":"apache","extensions":["abw"]},"application/x-ace-compressed":{"source":"apache","extensions":["ace"]},"application/x-amf":{"source":"apache"},"application/x-apple-diskimage":{"source":"apache","extensions":["dmg"]},"application/x-arj":{"compressible":false,"extensions":["arj"]},"application/x-authorware-bin":{"source":"apache","extensions":["aab","x32","u32","vox"]},"application/x-authorware-map":{"source":"apache","extensions":["aam"]},"application/x-authorware-seg":{"source":"apache","extensions":["aas"]},"application/x-bcpio":{"source":"apache","extensions":["bcpio"]},"application/x-bdoc":{"compressible":false,"extensions":["bdoc"]},"application/x-bittorrent":{"source":"apache","extensions":["torrent"]},"application/x-blorb":{"source":"apache","extensions":["blb","blorb"]},"application/x-bzip":{"source":"apache","compressible":false,"extensions":["bz"]},"application/x-bzip2":{"source":"apache","compressible":false,"extensions":["bz2","boz"]},"application/x-cbr":{"source":"apache","extensions":["cbr","cba","cbt","cbz","cb7"]},"application/x-cdlink":{"source":"apache","extensions":["vcd"]},"application/x-cfs-compressed":{"source":"apache","extensions":["cfs"]},"application/x-chat":{"source":"apache","extensions":["chat"]},"application/x-chess-pgn":{"source":"apache","extensions":["pgn"]},"application/x-chrome-extension":{"extensions":["crx"]},"application/x-cocoa":{"source":"nginx","extensions":["cco"]},"application/x-compress":{"source":"apache"},"application/x-conference":{"source":"apache","extensions":["nsc"]},"application/x-cpio":{"source":"apache","extensions":["cpio"]},"application/x-csh":{"source":"apache","extensions":["csh"]},"application/x-deb":{"compressible":false},"application/x-debian-package":{"source":"apache","extensions":["deb","udeb"]},"application/x-dgc-compressed":{"source":"apache","extensions":["dgc"]},"application/x-director":{"source":"apache","extensions":["dir","dcr","dxr","cst","cct","cxt","w3d","fgd","swa"]},"application/x-doom":{"source":"apache","extensions":["wad"]},"application/x-dtbncx+xml":{"source":"apache","compressible":true,"extensions":["ncx"]},"application/x-dtbook+xml":{"source":"apache","compressible":true,"extensions":["dtb"]},"application/x-dtbresource+xml":{"source":"apache","compressible":true,"extensions":["res"]},"application/x-dvi":{"source":"apache","compressible":false,"extensions":["dvi"]},"application/x-envoy":{"source":"apache","extensions":["evy"]},"application/x-eva":{"source":"apache","extensions":["eva"]},"application/x-font-bdf":{"source":"apache","extensions":["bdf"]},"application/x-font-dos":{"source":"apache"},"application/x-font-framemaker":{"source":"apache"},"application/x-font-ghostscript":{"source":"apache","extensions":["gsf"]},"application/x-font-libgrx":{"source":"apache"},"application/x-font-linux-psf":{"source":"apache","extensions":["psf"]},"application/x-font-pcf":{"source":"apache","extensions":["pcf"]},"application/x-font-snf":{"source":"apache","extensions":["snf"]},"application/x-font-speedo":{"source":"apache"},"application/x-font-sunos-news":{"source":"apache"},"application/x-font-type1":{"source":"apache","extensions":["pfa","pfb","pfm","afm"]},"application/x-font-vfont":{"source":"apache"},"application/x-freearc":{"source":"apache","extensions":["arc"]},"application/x-futuresplash":{"source":"apache","extensions":["spl"]},"application/x-gca-compressed":{"source":"apache","extensions":["gca"]},"application/x-glulx":{"source":"apache","extensions":["ulx"]},"application/x-gnumeric":{"source":"apache","extensions":["gnumeric"]},"application/x-gramps-xml":{"source":"apache","extensions":["gramps"]},"application/x-gtar":{"source":"apache","extensions":["gtar"]},"application/x-gzip":{"source":"apache"},"application/x-hdf":{"source":"apache","extensions":["hdf"]},"application/x-httpd-php":{"compressible":true,"extensions":["php"]},"application/x-install-instructions":{"source":"apache","extensions":["install"]},"application/x-iso9660-image":{"source":"apache","extensions":["iso"]},"application/x-iwork-keynote-sffkey":{"extensions":["key"]},"application/x-iwork-numbers-sffnumbers":{"extensions":["numbers"]},"application/x-iwork-pages-sffpages":{"extensions":["pages"]},"application/x-java-archive-diff":{"source":"nginx","extensions":["jardiff"]},"application/x-java-jnlp-file":{"source":"apache","compressible":false,"extensions":["jnlp"]},"application/x-javascript":{"compressible":true},"application/x-keepass2":{"extensions":["kdbx"]},"application/x-latex":{"source":"apache","compressible":false,"extensions":["latex"]},"application/x-lua-bytecode":{"extensions":["luac"]},"application/x-lzh-compressed":{"source":"apache","extensions":["lzh","lha"]},"application/x-makeself":{"source":"nginx","extensions":["run"]},"application/x-mie":{"source":"apache","extensions":["mie"]},"application/x-mobipocket-ebook":{"source":"apache","extensions":["prc","mobi"]},"application/x-mpegurl":{"compressible":false},"application/x-ms-application":{"source":"apache","extensions":["application"]},"application/x-ms-shortcut":{"source":"apache","extensions":["lnk"]},"application/x-ms-wmd":{"source":"apache","extensions":["wmd"]},"application/x-ms-wmz":{"source":"apache","extensions":["wmz"]},"application/x-ms-xbap":{"source":"apache","extensions":["xbap"]},"application/x-msaccess":{"source":"apache","extensions":["mdb"]},"application/x-msbinder":{"source":"apache","extensions":["obd"]},"application/x-mscardfile":{"source":"apache","extensions":["crd"]},"application/x-msclip":{"source":"apache","extensions":["clp"]},"application/x-msdos-program":{"extensions":["exe"]},"application/x-msdownload":{"source":"apache","extensions":["exe","dll","com","bat","msi"]},"application/x-msmediaview":{"source":"apache","extensions":["mvb","m13","m14"]},"application/x-msmetafile":{"source":"apache","extensions":["wmf","wmz","emf","emz"]},"application/x-msmoney":{"source":"apache","extensions":["mny"]},"application/x-mspublisher":{"source":"apache","extensions":["pub"]},"application/x-msschedule":{"source":"apache","extensions":["scd"]},"application/x-msterminal":{"source":"apache","extensions":["trm"]},"application/x-mswrite":{"source":"apache","extensions":["wri"]},"application/x-netcdf":{"source":"apache","extensions":["nc","cdf"]},"application/x-ns-proxy-autoconfig":{"compressible":true,"extensions":["pac"]},"application/x-nzb":{"source":"apache","extensions":["nzb"]},"application/x-perl":{"source":"nginx","extensions":["pl","pm"]},"application/x-pilot":{"source":"nginx","extensions":["prc","pdb"]},"application/x-pkcs12":{"source":"apache","compressible":false,"extensions":["p12","pfx"]},"application/x-pkcs7-certificates":{"source":"apache","extensions":["p7b","spc"]},"application/x-pkcs7-certreqresp":{"source":"apache","extensions":["p7r"]},"application/x-pki-message":{"source":"iana"},"application/x-rar-compressed":{"source":"apache","compressible":false,"extensions":["rar"]},"application/x-redhat-package-manager":{"source":"nginx","extensions":["rpm"]},"application/x-research-info-systems":{"source":"apache","extensions":["ris"]},"application/x-sea":{"source":"nginx","extensions":["sea"]},"application/x-sh":{"source":"apache","compressible":true,"extensions":["sh"]},"application/x-shar":{"source":"apache","extensions":["shar"]},"application/x-shockwave-flash":{"source":"apache","compressible":false,"extensions":["swf"]},"application/x-silverlight-app":{"source":"apache","extensions":["xap"]},"application/x-sql":{"source":"apache","extensions":["sql"]},"application/x-stuffit":{"source":"apache","compressible":false,"extensions":["sit"]},"application/x-stuffitx":{"source":"apache","extensions":["sitx"]},"application/x-subrip":{"source":"apache","extensions":["srt"]},"application/x-sv4cpio":{"source":"apache","extensions":["sv4cpio"]},"application/x-sv4crc":{"source":"apache","extensions":["sv4crc"]},"application/x-t3vm-image":{"source":"apache","extensions":["t3"]},"application/x-tads":{"source":"apache","extensions":["gam"]},"application/x-tar":{"source":"apache","compressible":true,"extensions":["tar"]},"application/x-tcl":{"source":"apache","extensions":["tcl","tk"]},"application/x-tex":{"source":"apache","extensions":["tex"]},"application/x-tex-tfm":{"source":"apache","extensions":["tfm"]},"application/x-texinfo":{"source":"apache","extensions":["texinfo","texi"]},"application/x-tgif":{"source":"apache","extensions":["obj"]},"application/x-ustar":{"source":"apache","extensions":["ustar"]},"application/x-virtualbox-hdd":{"compressible":true,"extensions":["hdd"]},"application/x-virtualbox-ova":{"compressible":true,"extensions":["ova"]},"application/x-virtualbox-ovf":{"compressible":true,"extensions":["ovf"]},"application/x-virtualbox-vbox":{"compressible":true,"extensions":["vbox"]},"application/x-virtualbox-vbox-extpack":{"compressible":false,"extensions":["vbox-extpack"]},"application/x-virtualbox-vdi":{"compressible":true,"extensions":["vdi"]},"application/x-virtualbox-vhd":{"compressible":true,"extensions":["vhd"]},"application/x-virtualbox-vmdk":{"compressible":true,"extensions":["vmdk"]},"application/x-wais-source":{"source":"apache","extensions":["src"]},"application/x-web-app-manifest+json":{"compressible":true,"extensions":["webapp"]},"application/x-www-form-urlencoded":{"source":"iana","compressible":true},"application/x-x509-ca-cert":{"source":"iana","extensions":["der","crt","pem"]},"application/x-x509-ca-ra-cert":{"source":"iana"},"application/x-x509-next-ca-cert":{"source":"iana"},"application/x-xfig":{"source":"apache","extensions":["fig"]},"application/x-xliff+xml":{"source":"apache","compressible":true,"extensions":["xlf"]},"application/x-xpinstall":{"source":"apache","compressible":false,"extensions":["xpi"]},"application/x-xz":{"source":"apache","extensions":["xz"]},"application/x-zmachine":{"source":"apache","extensions":["z1","z2","z3","z4","z5","z6","z7","z8"]},"application/x400-bp":{"source":"iana"},"application/xacml+xml":{"source":"iana","compressible":true},"application/xaml+xml":{"source":"apache","compressible":true,"extensions":["xaml"]},"application/xcap-att+xml":{"source":"iana","compressible":true,"extensions":["xav"]},"application/xcap-caps+xml":{"source":"iana","compressible":true,"extensions":["xca"]},"application/xcap-diff+xml":{"source":"iana","compressible":true,"extensions":["xdf"]},"application/xcap-el+xml":{"source":"iana","compressible":true,"extensions":["xel"]},"application/xcap-error+xml":{"source":"iana","compressible":true},"application/xcap-ns+xml":{"source":"iana","compressible":true,"extensions":["xns"]},"application/xcon-conference-info+xml":{"source":"iana","compressible":true},"application/xcon-conference-info-diff+xml":{"source":"iana","compressible":true},"application/xenc+xml":{"source":"iana","compressible":true,"extensions":["xenc"]},"application/xhtml+xml":{"source":"iana","compressible":true,"extensions":["xhtml","xht"]},"application/xhtml-voice+xml":{"source":"apache","compressible":true},"application/xliff+xml":{"source":"iana","compressible":true,"extensions":["xlf"]},"application/xml":{"source":"iana","compressible":true,"extensions":["xml","xsl","xsd","rng"]},"application/xml-dtd":{"source":"iana","compressible":true,"extensions":["dtd"]},"application/xml-external-parsed-entity":{"source":"iana"},"application/xml-patch+xml":{"source":"iana","compressible":true},"application/xmpp+xml":{"source":"iana","compressible":true},"application/xop+xml":{"source":"iana","compressible":true,"extensions":["xop"]},"application/xproc+xml":{"source":"apache","compressible":true,"extensions":["xpl"]},"application/xslt+xml":{"source":"iana","compressible":true,"extensions":["xsl","xslt"]},"application/xspf+xml":{"source":"apache","compressible":true,"extensions":["xspf"]},"application/xv+xml":{"source":"iana","compressible":true,"extensions":["mxml","xhvml","xvml","xvm"]},"application/yang":{"source":"iana","extensions":["yang"]},"application/yang-data+json":{"source":"iana","compressible":true},"application/yang-data+xml":{"source":"iana","compressible":true},"application/yang-patch+json":{"source":"iana","compressible":true},"application/yang-patch+xml":{"source":"iana","compressible":true},"application/yin+xml":{"source":"iana","compressible":true,"extensions":["yin"]},"application/zip":{"source":"iana","compressible":false,"extensions":["zip"]},"application/zlib":{"source":"iana"},"application/zstd":{"source":"iana"},"audio/1d-interleaved-parityfec":{"source":"iana"},"audio/32kadpcm":{"source":"iana"},"audio/3gpp":{"source":"iana","compressible":false,"extensions":["3gpp"]},"audio/3gpp2":{"source":"iana"},"audio/aac":{"source":"iana"},"audio/ac3":{"source":"iana"},"audio/adpcm":{"source":"apache","extensions":["adp"]},"audio/amr":{"source":"iana","extensions":["amr"]},"audio/amr-wb":{"source":"iana"},"audio/amr-wb+":{"source":"iana"},"audio/aptx":{"source":"iana"},"audio/asc":{"source":"iana"},"audio/atrac-advanced-lossless":{"source":"iana"},"audio/atrac-x":{"source":"iana"},"audio/atrac3":{"source":"iana"},"audio/basic":{"source":"iana","compressible":false,"extensions":["au","snd"]},"audio/bv16":{"source":"iana"},"audio/bv32":{"source":"iana"},"audio/clearmode":{"source":"iana"},"audio/cn":{"source":"iana"},"audio/dat12":{"source":"iana"},"audio/dls":{"source":"iana"},"audio/dsr-es201108":{"source":"iana"},"audio/dsr-es202050":{"source":"iana"},"audio/dsr-es202211":{"source":"iana"},"audio/dsr-es202212":{"source":"iana"},"audio/dv":{"source":"iana"},"audio/dvi4":{"source":"iana"},"audio/eac3":{"source":"iana"},"audio/encaprtp":{"source":"iana"},"audio/evrc":{"source":"iana"},"audio/evrc-qcp":{"source":"iana"},"audio/evrc0":{"source":"iana"},"audio/evrc1":{"source":"iana"},"audio/evrcb":{"source":"iana"},"audio/evrcb0":{"source":"iana"},"audio/evrcb1":{"source":"iana"},"audio/evrcnw":{"source":"iana"},"audio/evrcnw0":{"source":"iana"},"audio/evrcnw1":{"source":"iana"},"audio/evrcwb":{"source":"iana"},"audio/evrcwb0":{"source":"iana"},"audio/evrcwb1":{"source":"iana"},"audio/evs":{"source":"iana"},"audio/flexfec":{"source":"iana"},"audio/fwdred":{"source":"iana"},"audio/g711-0":{"source":"iana"},"audio/g719":{"source":"iana"},"audio/g722":{"source":"iana"},"audio/g7221":{"source":"iana"},"audio/g723":{"source":"iana"},"audio/g726-16":{"source":"iana"},"audio/g726-24":{"source":"iana"},"audio/g726-32":{"source":"iana"},"audio/g726-40":{"source":"iana"},"audio/g728":{"source":"iana"},"audio/g729":{"source":"iana"},"audio/g7291":{"source":"iana"},"audio/g729d":{"source":"iana"},"audio/g729e":{"source":"iana"},"audio/gsm":{"source":"iana"},"audio/gsm-efr":{"source":"iana"},"audio/gsm-hr-08":{"source":"iana"},"audio/ilbc":{"source":"iana"},"audio/ip-mr_v2.5":{"source":"iana"},"audio/isac":{"source":"apache"},"audio/l16":{"source":"iana"},"audio/l20":{"source":"iana"},"audio/l24":{"source":"iana","compressible":false},"audio/l8":{"source":"iana"},"audio/lpc":{"source":"iana"},"audio/melp":{"source":"iana"},"audio/melp1200":{"source":"iana"},"audio/melp2400":{"source":"iana"},"audio/melp600":{"source":"iana"},"audio/mhas":{"source":"iana"},"audio/midi":{"source":"apache","extensions":["mid","midi","kar","rmi"]},"audio/mobile-xmf":{"source":"iana","extensions":["mxmf"]},"audio/mp3":{"compressible":false,"extensions":["mp3"]},"audio/mp4":{"source":"iana","compressible":false,"extensions":["m4a","mp4a"]},"audio/mp4a-latm":{"source":"iana"},"audio/mpa":{"source":"iana"},"audio/mpa-robust":{"source":"iana"},"audio/mpeg":{"source":"iana","compressible":false,"extensions":["mpga","mp2","mp2a","mp3","m2a","m3a"]},"audio/mpeg4-generic":{"source":"iana"},"audio/musepack":{"source":"apache"},"audio/ogg":{"source":"iana","compressible":false,"extensions":["oga","ogg","spx","opus"]},"audio/opus":{"source":"iana"},"audio/parityfec":{"source":"iana"},"audio/pcma":{"source":"iana"},"audio/pcma-wb":{"source":"iana"},"audio/pcmu":{"source":"iana"},"audio/pcmu-wb":{"source":"iana"},"audio/prs.sid":{"source":"iana"},"audio/qcelp":{"source":"iana"},"audio/raptorfec":{"source":"iana"},"audio/red":{"source":"iana"},"audio/rtp-enc-aescm128":{"source":"iana"},"audio/rtp-midi":{"source":"iana"},"audio/rtploopback":{"source":"iana"},"audio/rtx":{"source":"iana"},"audio/s3m":{"source":"apache","extensions":["s3m"]},"audio/scip":{"source":"iana"},"audio/silk":{"source":"apache","extensions":["sil"]},"audio/smv":{"source":"iana"},"audio/smv-qcp":{"source":"iana"},"audio/smv0":{"source":"iana"},"audio/sofa":{"source":"iana"},"audio/sp-midi":{"source":"iana"},"audio/speex":{"source":"iana"},"audio/t140c":{"source":"iana"},"audio/t38":{"source":"iana"},"audio/telephone-event":{"source":"iana"},"audio/tetra_acelp":{"source":"iana"},"audio/tetra_acelp_bb":{"source":"iana"},"audio/tone":{"source":"iana"},"audio/tsvcis":{"source":"iana"},"audio/uemclip":{"source":"iana"},"audio/ulpfec":{"source":"iana"},"audio/usac":{"source":"iana"},"audio/vdvi":{"source":"iana"},"audio/vmr-wb":{"source":"iana"},"audio/vnd.3gpp.iufp":{"source":"iana"},"audio/vnd.4sb":{"source":"iana"},"audio/vnd.audiokoz":{"source":"iana"},"audio/vnd.celp":{"source":"iana"},"audio/vnd.cisco.nse":{"source":"iana"},"audio/vnd.cmles.radio-events":{"source":"iana"},"audio/vnd.cns.anp1":{"source":"iana"},"audio/vnd.cns.inf1":{"source":"iana"},"audio/vnd.dece.audio":{"source":"iana","extensions":["uva","uvva"]},"audio/vnd.digital-winds":{"source":"iana","extensions":["eol"]},"audio/vnd.dlna.adts":{"source":"iana"},"audio/vnd.dolby.heaac.1":{"source":"iana"},"audio/vnd.dolby.heaac.2":{"source":"iana"},"audio/vnd.dolby.mlp":{"source":"iana"},"audio/vnd.dolby.mps":{"source":"iana"},"audio/vnd.dolby.pl2":{"source":"iana"},"audio/vnd.dolby.pl2x":{"source":"iana"},"audio/vnd.dolby.pl2z":{"source":"iana"},"audio/vnd.dolby.pulse.1":{"source":"iana"},"audio/vnd.dra":{"source":"iana","extensions":["dra"]},"audio/vnd.dts":{"source":"iana","extensions":["dts"]},"audio/vnd.dts.hd":{"source":"iana","extensions":["dtshd"]},"audio/vnd.dts.uhd":{"source":"iana"},"audio/vnd.dvb.file":{"source":"iana"},"audio/vnd.everad.plj":{"source":"iana"},"audio/vnd.hns.audio":{"source":"iana"},"audio/vnd.lucent.voice":{"source":"iana","extensions":["lvp"]},"audio/vnd.ms-playready.media.pya":{"source":"iana","extensions":["pya"]},"audio/vnd.nokia.mobile-xmf":{"source":"iana"},"audio/vnd.nortel.vbk":{"source":"iana"},"audio/vnd.nuera.ecelp4800":{"source":"iana","extensions":["ecelp4800"]},"audio/vnd.nuera.ecelp7470":{"source":"iana","extensions":["ecelp7470"]},"audio/vnd.nuera.ecelp9600":{"source":"iana","extensions":["ecelp9600"]},"audio/vnd.octel.sbc":{"source":"iana"},"audio/vnd.presonus.multitrack":{"source":"iana"},"audio/vnd.qcelp":{"source":"iana"},"audio/vnd.rhetorex.32kadpcm":{"source":"iana"},"audio/vnd.rip":{"source":"iana","extensions":["rip"]},"audio/vnd.rn-realaudio":{"compressible":false},"audio/vnd.sealedmedia.softseal.mpeg":{"source":"iana"},"audio/vnd.vmx.cvsd":{"source":"iana"},"audio/vnd.wave":{"compressible":false},"audio/vorbis":{"source":"iana","compressible":false},"audio/vorbis-config":{"source":"iana"},"audio/wav":{"compressible":false,"extensions":["wav"]},"audio/wave":{"compressible":false,"extensions":["wav"]},"audio/webm":{"source":"apache","compressible":false,"extensions":["weba"]},"audio/x-aac":{"source":"apache","compressible":false,"extensions":["aac"]},"audio/x-aiff":{"source":"apache","extensions":["aif","aiff","aifc"]},"audio/x-caf":{"source":"apache","compressible":false,"extensions":["caf"]},"audio/x-flac":{"source":"apache","extensions":["flac"]},"audio/x-m4a":{"source":"nginx","extensions":["m4a"]},"audio/x-matroska":{"source":"apache","extensions":["mka"]},"audio/x-mpegurl":{"source":"apache","extensions":["m3u"]},"audio/x-ms-wax":{"source":"apache","extensions":["wax"]},"audio/x-ms-wma":{"source":"apache","extensions":["wma"]},"audio/x-pn-realaudio":{"source":"apache","extensions":["ram","ra"]},"audio/x-pn-realaudio-plugin":{"source":"apache","extensions":["rmp"]},"audio/x-realaudio":{"source":"nginx","extensions":["ra"]},"audio/x-tta":{"source":"apache"},"audio/x-wav":{"source":"apache","extensions":["wav"]},"audio/xm":{"source":"apache","extensions":["xm"]},"chemical/x-cdx":{"source":"apache","extensions":["cdx"]},"chemical/x-cif":{"source":"apache","extensions":["cif"]},"chemical/x-cmdf":{"source":"apache","extensions":["cmdf"]},"chemical/x-cml":{"source":"apache","extensions":["cml"]},"chemical/x-csml":{"source":"apache","extensions":["csml"]},"chemical/x-pdb":{"source":"apache"},"chemical/x-xyz":{"source":"apache","extensions":["xyz"]},"font/collection":{"source":"iana","extensions":["ttc"]},"font/otf":{"source":"iana","compressible":true,"extensions":["otf"]},"font/sfnt":{"source":"iana"},"font/ttf":{"source":"iana","compressible":true,"extensions":["ttf"]},"font/woff":{"source":"iana","extensions":["woff"]},"font/woff2":{"source":"iana","extensions":["woff2"]},"image/aces":{"source":"iana","extensions":["exr"]},"image/apng":{"compressible":false,"extensions":["apng"]},"image/avci":{"source":"iana","extensions":["avci"]},"image/avcs":{"source":"iana","extensions":["avcs"]},"image/avif":{"source":"iana","compressible":false,"extensions":["avif"]},"image/bmp":{"source":"iana","compressible":true,"extensions":["bmp"]},"image/cgm":{"source":"iana","extensions":["cgm"]},"image/dicom-rle":{"source":"iana","extensions":["drle"]},"image/emf":{"source":"iana","extensions":["emf"]},"image/fits":{"source":"iana","extensions":["fits"]},"image/g3fax":{"source":"iana","extensions":["g3"]},"image/gif":{"source":"iana","compressible":false,"extensions":["gif"]},"image/heic":{"source":"iana","extensions":["heic"]},"image/heic-sequence":{"source":"iana","extensions":["heics"]},"image/heif":{"source":"iana","extensions":["heif"]},"image/heif-sequence":{"source":"iana","extensions":["heifs"]},"image/hej2k":{"source":"iana","extensions":["hej2"]},"image/hsj2":{"source":"iana","extensions":["hsj2"]},"image/ief":{"source":"iana","extensions":["ief"]},"image/jls":{"source":"iana","extensions":["jls"]},"image/jp2":{"source":"iana","compressible":false,"extensions":["jp2","jpg2"]},"image/jpeg":{"source":"iana","compressible":false,"extensions":["jpeg","jpg","jpe"]},"image/jph":{"source":"iana","extensions":["jph"]},"image/jphc":{"source":"iana","extensions":["jhc"]},"image/jpm":{"source":"iana","compressible":false,"extensions":["jpm"]},"image/jpx":{"source":"iana","compressible":false,"extensions":["jpx","jpf"]},"image/jxr":{"source":"iana","extensions":["jxr"]},"image/jxra":{"source":"iana","extensions":["jxra"]},"image/jxrs":{"source":"iana","extensions":["jxrs"]},"image/jxs":{"source":"iana","extensions":["jxs"]},"image/jxsc":{"source":"iana","extensions":["jxsc"]},"image/jxsi":{"source":"iana","extensions":["jxsi"]},"image/jxss":{"source":"iana","extensions":["jxss"]},"image/ktx":{"source":"iana","extensions":["ktx"]},"image/ktx2":{"source":"iana","extensions":["ktx2"]},"image/naplps":{"source":"iana"},"image/pjpeg":{"compressible":false},"image/png":{"source":"iana","compressible":false,"extensions":["png"]},"image/prs.btif":{"source":"iana","extensions":["btif"]},"image/prs.pti":{"source":"iana","extensions":["pti"]},"image/pwg-raster":{"source":"iana"},"image/sgi":{"source":"apache","extensions":["sgi"]},"image/svg+xml":{"source":"iana","compressible":true,"extensions":["svg","svgz"]},"image/t38":{"source":"iana","extensions":["t38"]},"image/tiff":{"source":"iana","compressible":false,"extensions":["tif","tiff"]},"image/tiff-fx":{"source":"iana","extensions":["tfx"]},"image/vnd.adobe.photoshop":{"source":"iana","compressible":true,"extensions":["psd"]},"image/vnd.airzip.accelerator.azv":{"source":"iana","extensions":["azv"]},"image/vnd.cns.inf2":{"source":"iana"},"image/vnd.dece.graphic":{"source":"iana","extensions":["uvi","uvvi","uvg","uvvg"]},"image/vnd.djvu":{"source":"iana","extensions":["djvu","djv"]},"image/vnd.dvb.subtitle":{"source":"iana","extensions":["sub"]},"image/vnd.dwg":{"source":"iana","extensions":["dwg"]},"image/vnd.dxf":{"source":"iana","extensions":["dxf"]},"image/vnd.fastbidsheet":{"source":"iana","extensions":["fbs"]},"image/vnd.fpx":{"source":"iana","extensions":["fpx"]},"image/vnd.fst":{"source":"iana","extensions":["fst"]},"image/vnd.fujixerox.edmics-mmr":{"source":"iana","extensions":["mmr"]},"image/vnd.fujixerox.edmics-rlc":{"source":"iana","extensions":["rlc"]},"image/vnd.globalgraphics.pgb":{"source":"iana"},"image/vnd.microsoft.icon":{"source":"iana","compressible":true,"extensions":["ico"]},"image/vnd.mix":{"source":"iana"},"image/vnd.mozilla.apng":{"source":"iana"},"image/vnd.ms-dds":{"compressible":true,"extensions":["dds"]},"image/vnd.ms-modi":{"source":"iana","extensions":["mdi"]},"image/vnd.ms-photo":{"source":"apache","extensions":["wdp"]},"image/vnd.net-fpx":{"source":"iana","extensions":["npx"]},"image/vnd.pco.b16":{"source":"iana","extensions":["b16"]},"image/vnd.radiance":{"source":"iana"},"image/vnd.sealed.png":{"source":"iana"},"image/vnd.sealedmedia.softseal.gif":{"source":"iana"},"image/vnd.sealedmedia.softseal.jpg":{"source":"iana"},"image/vnd.svf":{"source":"iana"},"image/vnd.tencent.tap":{"source":"iana","extensions":["tap"]},"image/vnd.valve.source.texture":{"source":"iana","extensions":["vtf"]},"image/vnd.wap.wbmp":{"source":"iana","extensions":["wbmp"]},"image/vnd.xiff":{"source":"iana","extensions":["xif"]},"image/vnd.zbrush.pcx":{"source":"iana","extensions":["pcx"]},"image/webp":{"source":"apache","extensions":["webp"]},"image/wmf":{"source":"iana","extensions":["wmf"]},"image/x-3ds":{"source":"apache","extensions":["3ds"]},"image/x-cmu-raster":{"source":"apache","extensions":["ras"]},"image/x-cmx":{"source":"apache","extensions":["cmx"]},"image/x-freehand":{"source":"apache","extensions":["fh","fhc","fh4","fh5","fh7"]},"image/x-icon":{"source":"apache","compressible":true,"extensions":["ico"]},"image/x-jng":{"source":"nginx","extensions":["jng"]},"image/x-mrsid-image":{"source":"apache","extensions":["sid"]},"image/x-ms-bmp":{"source":"nginx","compressible":true,"extensions":["bmp"]},"image/x-pcx":{"source":"apache","extensions":["pcx"]},"image/x-pict":{"source":"apache","extensions":["pic","pct"]},"image/x-portable-anymap":{"source":"apache","extensions":["pnm"]},"image/x-portable-bitmap":{"source":"apache","extensions":["pbm"]},"image/x-portable-graymap":{"source":"apache","extensions":["pgm"]},"image/x-portable-pixmap":{"source":"apache","extensions":["ppm"]},"image/x-rgb":{"source":"apache","extensions":["rgb"]},"image/x-tga":{"source":"apache","extensions":["tga"]},"image/x-xbitmap":{"source":"apache","extensions":["xbm"]},"image/x-xcf":{"compressible":false},"image/x-xpixmap":{"source":"apache","extensions":["xpm"]},"image/x-xwindowdump":{"source":"apache","extensions":["xwd"]},"message/cpim":{"source":"iana"},"message/delivery-status":{"source":"iana"},"message/disposition-notification":{"source":"iana","extensions":["disposition-notification"]},"message/external-body":{"source":"iana"},"message/feedback-report":{"source":"iana"},"message/global":{"source":"iana","extensions":["u8msg"]},"message/global-delivery-status":{"source":"iana","extensions":["u8dsn"]},"message/global-disposition-notification":{"source":"iana","extensions":["u8mdn"]},"message/global-headers":{"source":"iana","extensions":["u8hdr"]},"message/http":{"source":"iana","compressible":false},"message/imdn+xml":{"source":"iana","compressible":true},"message/news":{"source":"iana"},"message/partial":{"source":"iana","compressible":false},"message/rfc822":{"source":"iana","compressible":true,"extensions":["eml","mime"]},"message/s-http":{"source":"iana"},"message/sip":{"source":"iana"},"message/sipfrag":{"source":"iana"},"message/tracking-status":{"source":"iana"},"message/vnd.si.simp":{"source":"iana"},"message/vnd.wfa.wsc":{"source":"iana","extensions":["wsc"]},"model/3mf":{"source":"iana","extensions":["3mf"]},"model/e57":{"source":"iana"},"model/gltf+json":{"source":"iana","compressible":true,"extensions":["gltf"]},"model/gltf-binary":{"source":"iana","compressible":true,"extensions":["glb"]},"model/iges":{"source":"iana","compressible":false,"extensions":["igs","iges"]},"model/mesh":{"source":"iana","compressible":false,"extensions":["msh","mesh","silo"]},"model/mtl":{"source":"iana","extensions":["mtl"]},"model/obj":{"source":"iana","extensions":["obj"]},"model/step":{"source":"iana"},"model/step+xml":{"source":"iana","compressible":true,"extensions":["stpx"]},"model/step+zip":{"source":"iana","compressible":false,"extensions":["stpz"]},"model/step-xml+zip":{"source":"iana","compressible":false,"extensions":["stpxz"]},"model/stl":{"source":"iana","extensions":["stl"]},"model/vnd.collada+xml":{"source":"iana","compressible":true,"extensions":["dae"]},"model/vnd.dwf":{"source":"iana","extensions":["dwf"]},"model/vnd.flatland.3dml":{"source":"iana"},"model/vnd.gdl":{"source":"iana","extensions":["gdl"]},"model/vnd.gs-gdl":{"source":"apache"},"model/vnd.gs.gdl":{"source":"iana"},"model/vnd.gtw":{"source":"iana","extensions":["gtw"]},"model/vnd.moml+xml":{"source":"iana","compressible":true},"model/vnd.mts":{"source":"iana","extensions":["mts"]},"model/vnd.opengex":{"source":"iana","extensions":["ogex"]},"model/vnd.parasolid.transmit.binary":{"source":"iana","extensions":["x_b"]},"model/vnd.parasolid.transmit.text":{"source":"iana","extensions":["x_t"]},"model/vnd.pytha.pyox":{"source":"iana"},"model/vnd.rosette.annotated-data-model":{"source":"iana"},"model/vnd.sap.vds":{"source":"iana","extensions":["vds"]},"model/vnd.usdz+zip":{"source":"iana","compressible":false,"extensions":["usdz"]},"model/vnd.valve.source.compiled-map":{"source":"iana","extensions":["bsp"]},"model/vnd.vtu":{"source":"iana","extensions":["vtu"]},"model/vrml":{"source":"iana","compressible":false,"extensions":["wrl","vrml"]},"model/x3d+binary":{"source":"apache","compressible":false,"extensions":["x3db","x3dbz"]},"model/x3d+fastinfoset":{"source":"iana","extensions":["x3db"]},"model/x3d+vrml":{"source":"apache","compressible":false,"extensions":["x3dv","x3dvz"]},"model/x3d+xml":{"source":"iana","compressible":true,"extensions":["x3d","x3dz"]},"model/x3d-vrml":{"source":"iana","extensions":["x3dv"]},"multipart/alternative":{"source":"iana","compressible":false},"multipart/appledouble":{"source":"iana"},"multipart/byteranges":{"source":"iana"},"multipart/digest":{"source":"iana"},"multipart/encrypted":{"source":"iana","compressible":false},"multipart/form-data":{"source":"iana","compressible":false},"multipart/header-set":{"source":"iana"},"multipart/mixed":{"source":"iana"},"multipart/multilingual":{"source":"iana"},"multipart/parallel":{"source":"iana"},"multipart/related":{"source":"iana","compressible":false},"multipart/report":{"source":"iana"},"multipart/signed":{"source":"iana","compressible":false},"multipart/vnd.bint.med-plus":{"source":"iana"},"multipart/voice-message":{"source":"iana"},"multipart/x-mixed-replace":{"source":"iana"},"text/1d-interleaved-parityfec":{"source":"iana"},"text/cache-manifest":{"source":"iana","compressible":true,"extensions":["appcache","manifest"]},"text/calendar":{"source":"iana","extensions":["ics","ifb"]},"text/calender":{"compressible":true},"text/cmd":{"compressible":true},"text/coffeescript":{"extensions":["coffee","litcoffee"]},"text/cql":{"source":"iana"},"text/cql-expression":{"source":"iana"},"text/cql-identifier":{"source":"iana"},"text/css":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["css"]},"text/csv":{"source":"iana","compressible":true,"extensions":["csv"]},"text/csv-schema":{"source":"iana"},"text/directory":{"source":"iana"},"text/dns":{"source":"iana"},"text/ecmascript":{"source":"iana"},"text/encaprtp":{"source":"iana"},"text/enriched":{"source":"iana"},"text/fhirpath":{"source":"iana"},"text/flexfec":{"source":"iana"},"text/fwdred":{"source":"iana"},"text/gff3":{"source":"iana"},"text/grammar-ref-list":{"source":"iana"},"text/html":{"source":"iana","compressible":true,"extensions":["html","htm","shtml"]},"text/jade":{"extensions":["jade"]},"text/javascript":{"source":"iana","compressible":true},"text/jcr-cnd":{"source":"iana"},"text/jsx":{"compressible":true,"extensions":["jsx"]},"text/less":{"compressible":true,"extensions":["less"]},"text/markdown":{"source":"iana","compressible":true,"extensions":["markdown","md"]},"text/mathml":{"source":"nginx","extensions":["mml"]},"text/mdx":{"compressible":true,"extensions":["mdx"]},"text/mizar":{"source":"iana"},"text/n3":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["n3"]},"text/parameters":{"source":"iana","charset":"UTF-8"},"text/parityfec":{"source":"iana"},"text/plain":{"source":"iana","compressible":true,"extensions":["txt","text","conf","def","list","log","in","ini"]},"text/provenance-notation":{"source":"iana","charset":"UTF-8"},"text/prs.fallenstein.rst":{"source":"iana"},"text/prs.lines.tag":{"source":"iana","extensions":["dsc"]},"text/prs.prop.logic":{"source":"iana"},"text/raptorfec":{"source":"iana"},"text/red":{"source":"iana"},"text/rfc822-headers":{"source":"iana"},"text/richtext":{"source":"iana","compressible":true,"extensions":["rtx"]},"text/rtf":{"source":"iana","compressible":true,"extensions":["rtf"]},"text/rtp-enc-aescm128":{"source":"iana"},"text/rtploopback":{"source":"iana"},"text/rtx":{"source":"iana"},"text/sgml":{"source":"iana","extensions":["sgml","sgm"]},"text/shaclc":{"source":"iana"},"text/shex":{"source":"iana","extensions":["shex"]},"text/slim":{"extensions":["slim","slm"]},"text/spdx":{"source":"iana","extensions":["spdx"]},"text/strings":{"source":"iana"},"text/stylus":{"extensions":["stylus","styl"]},"text/t140":{"source":"iana"},"text/tab-separated-values":{"source":"iana","compressible":true,"extensions":["tsv"]},"text/troff":{"source":"iana","extensions":["t","tr","roff","man","me","ms"]},"text/turtle":{"source":"iana","charset":"UTF-8","extensions":["ttl"]},"text/ulpfec":{"source":"iana"},"text/uri-list":{"source":"iana","compressible":true,"extensions":["uri","uris","urls"]},"text/vcard":{"source":"iana","compressible":true,"extensions":["vcard"]},"text/vnd.a":{"source":"iana"},"text/vnd.abc":{"source":"iana"},"text/vnd.ascii-art":{"source":"iana"},"text/vnd.curl":{"source":"iana","extensions":["curl"]},"text/vnd.curl.dcurl":{"source":"apache","extensions":["dcurl"]},"text/vnd.curl.mcurl":{"source":"apache","extensions":["mcurl"]},"text/vnd.curl.scurl":{"source":"apache","extensions":["scurl"]},"text/vnd.debian.copyright":{"source":"iana","charset":"UTF-8"},"text/vnd.dmclientscript":{"source":"iana"},"text/vnd.dvb.subtitle":{"source":"iana","extensions":["sub"]},"text/vnd.esmertec.theme-descriptor":{"source":"iana","charset":"UTF-8"},"text/vnd.familysearch.gedcom":{"source":"iana","extensions":["ged"]},"text/vnd.ficlab.flt":{"source":"iana"},"text/vnd.fly":{"source":"iana","extensions":["fly"]},"text/vnd.fmi.flexstor":{"source":"iana","extensions":["flx"]},"text/vnd.gml":{"source":"iana"},"text/vnd.graphviz":{"source":"iana","extensions":["gv"]},"text/vnd.hans":{"source":"iana"},"text/vnd.hgl":{"source":"iana"},"text/vnd.in3d.3dml":{"source":"iana","extensions":["3dml"]},"text/vnd.in3d.spot":{"source":"iana","extensions":["spot"]},"text/vnd.iptc.newsml":{"source":"iana"},"text/vnd.iptc.nitf":{"source":"iana"},"text/vnd.latex-z":{"source":"iana"},"text/vnd.motorola.reflex":{"source":"iana"},"text/vnd.ms-mediapackage":{"source":"iana"},"text/vnd.net2phone.commcenter.command":{"source":"iana"},"text/vnd.radisys.msml-basic-layout":{"source":"iana"},"text/vnd.senx.warpscript":{"source":"iana"},"text/vnd.si.uricatalogue":{"source":"iana"},"text/vnd.sosi":{"source":"iana"},"text/vnd.sun.j2me.app-descriptor":{"source":"iana","charset":"UTF-8","extensions":["jad"]},"text/vnd.trolltech.linguist":{"source":"iana","charset":"UTF-8"},"text/vnd.wap.si":{"source":"iana"},"text/vnd.wap.sl":{"source":"iana"},"text/vnd.wap.wml":{"source":"iana","extensions":["wml"]},"text/vnd.wap.wmlscript":{"source":"iana","extensions":["wmls"]},"text/vtt":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["vtt"]},"text/x-asm":{"source":"apache","extensions":["s","asm"]},"text/x-c":{"source":"apache","extensions":["c","cc","cxx","cpp","h","hh","dic"]},"text/x-component":{"source":"nginx","extensions":["htc"]},"text/x-fortran":{"source":"apache","extensions":["f","for","f77","f90"]},"text/x-gwt-rpc":{"compressible":true},"text/x-handlebars-template":{"extensions":["hbs"]},"text/x-java-source":{"source":"apache","extensions":["java"]},"text/x-jquery-tmpl":{"compressible":true},"text/x-lua":{"extensions":["lua"]},"text/x-markdown":{"compressible":true,"extensions":["mkd"]},"text/x-nfo":{"source":"apache","extensions":["nfo"]},"text/x-opml":{"source":"apache","extensions":["opml"]},"text/x-org":{"compressible":true,"extensions":["org"]},"text/x-pascal":{"source":"apache","extensions":["p","pas"]},"text/x-processing":{"compressible":true,"extensions":["pde"]},"text/x-sass":{"extensions":["sass"]},"text/x-scss":{"extensions":["scss"]},"text/x-setext":{"source":"apache","extensions":["etx"]},"text/x-sfv":{"source":"apache","extensions":["sfv"]},"text/x-suse-ymp":{"compressible":true,"extensions":["ymp"]},"text/x-uuencode":{"source":"apache","extensions":["uu"]},"text/x-vcalendar":{"source":"apache","extensions":["vcs"]},"text/x-vcard":{"source":"apache","extensions":["vcf"]},"text/xml":{"source":"iana","compressible":true,"extensions":["xml"]},"text/xml-external-parsed-entity":{"source":"iana"},"text/yaml":{"compressible":true,"extensions":["yaml","yml"]},"video/1d-interleaved-parityfec":{"source":"iana"},"video/3gpp":{"source":"iana","extensions":["3gp","3gpp"]},"video/3gpp-tt":{"source":"iana"},"video/3gpp2":{"source":"iana","extensions":["3g2"]},"video/av1":{"source":"iana"},"video/bmpeg":{"source":"iana"},"video/bt656":{"source":"iana"},"video/celb":{"source":"iana"},"video/dv":{"source":"iana"},"video/encaprtp":{"source":"iana"},"video/ffv1":{"source":"iana"},"video/flexfec":{"source":"iana"},"video/h261":{"source":"iana","extensions":["h261"]},"video/h263":{"source":"iana","extensions":["h263"]},"video/h263-1998":{"source":"iana"},"video/h263-2000":{"source":"iana"},"video/h264":{"source":"iana","extensions":["h264"]},"video/h264-rcdo":{"source":"iana"},"video/h264-svc":{"source":"iana"},"video/h265":{"source":"iana"},"video/iso.segment":{"source":"iana","extensions":["m4s"]},"video/jpeg":{"source":"iana","extensions":["jpgv"]},"video/jpeg2000":{"source":"iana"},"video/jpm":{"source":"apache","extensions":["jpm","jpgm"]},"video/jxsv":{"source":"iana"},"video/mj2":{"source":"iana","extensions":["mj2","mjp2"]},"video/mp1s":{"source":"iana"},"video/mp2p":{"source":"iana"},"video/mp2t":{"source":"iana","extensions":["ts"]},"video/mp4":{"source":"iana","compressible":false,"extensions":["mp4","mp4v","mpg4"]},"video/mp4v-es":{"source":"iana"},"video/mpeg":{"source":"iana","compressible":false,"extensions":["mpeg","mpg","mpe","m1v","m2v"]},"video/mpeg4-generic":{"source":"iana"},"video/mpv":{"source":"iana"},"video/nv":{"source":"iana"},"video/ogg":{"source":"iana","compressible":false,"extensions":["ogv"]},"video/parityfec":{"source":"iana"},"video/pointer":{"source":"iana"},"video/quicktime":{"source":"iana","compressible":false,"extensions":["qt","mov"]},"video/raptorfec":{"source":"iana"},"video/raw":{"source":"iana"},"video/rtp-enc-aescm128":{"source":"iana"},"video/rtploopback":{"source":"iana"},"video/rtx":{"source":"iana"},"video/scip":{"source":"iana"},"video/smpte291":{"source":"iana"},"video/smpte292m":{"source":"iana"},"video/ulpfec":{"source":"iana"},"video/vc1":{"source":"iana"},"video/vc2":{"source":"iana"},"video/vnd.cctv":{"source":"iana"},"video/vnd.dece.hd":{"source":"iana","extensions":["uvh","uvvh"]},"video/vnd.dece.mobile":{"source":"iana","extensions":["uvm","uvvm"]},"video/vnd.dece.mp4":{"source":"iana"},"video/vnd.dece.pd":{"source":"iana","extensions":["uvp","uvvp"]},"video/vnd.dece.sd":{"source":"iana","extensions":["uvs","uvvs"]},"video/vnd.dece.video":{"source":"iana","extensions":["uvv","uvvv"]},"video/vnd.directv.mpeg":{"source":"iana"},"video/vnd.directv.mpeg-tts":{"source":"iana"},"video/vnd.dlna.mpeg-tts":{"source":"iana"},"video/vnd.dvb.file":{"source":"iana","extensions":["dvb"]},"video/vnd.fvt":{"source":"iana","extensions":["fvt"]},"video/vnd.hns.video":{"source":"iana"},"video/vnd.iptvforum.1dparityfec-1010":{"source":"iana"},"video/vnd.iptvforum.1dparityfec-2005":{"source":"iana"},"video/vnd.iptvforum.2dparityfec-1010":{"source":"iana"},"video/vnd.iptvforum.2dparityfec-2005":{"source":"iana"},"video/vnd.iptvforum.ttsavc":{"source":"iana"},"video/vnd.iptvforum.ttsmpeg2":{"source":"iana"},"video/vnd.motorola.video":{"source":"iana"},"video/vnd.motorola.videop":{"source":"iana"},"video/vnd.mpegurl":{"source":"iana","extensions":["mxu","m4u"]},"video/vnd.ms-playready.media.pyv":{"source":"iana","extensions":["pyv"]},"video/vnd.nokia.interleaved-multimedia":{"source":"iana"},"video/vnd.nokia.mp4vr":{"source":"iana"},"video/vnd.nokia.videovoip":{"source":"iana"},"video/vnd.objectvideo":{"source":"iana"},"video/vnd.radgamettools.bink":{"source":"iana"},"video/vnd.radgamettools.smacker":{"source":"iana"},"video/vnd.sealed.mpeg1":{"source":"iana"},"video/vnd.sealed.mpeg4":{"source":"iana"},"video/vnd.sealed.swf":{"source":"iana"},"video/vnd.sealedmedia.softseal.mov":{"source":"iana"},"video/vnd.uvvu.mp4":{"source":"iana","extensions":["uvu","uvvu"]},"video/vnd.vivo":{"source":"iana","extensions":["viv"]},"video/vnd.youtube.yt":{"source":"iana"},"video/vp8":{"source":"iana"},"video/vp9":{"source":"iana"},"video/webm":{"source":"apache","compressible":false,"extensions":["webm"]},"video/x-f4v":{"source":"apache","extensions":["f4v"]},"video/x-fli":{"source":"apache","extensions":["fli"]},"video/x-flv":{"source":"apache","compressible":false,"extensions":["flv"]},"video/x-m4v":{"source":"apache","extensions":["m4v"]},"video/x-matroska":{"source":"apache","compressible":false,"extensions":["mkv","mk3d","mks"]},"video/x-mng":{"source":"apache","extensions":["mng"]},"video/x-ms-asf":{"source":"apache","extensions":["asf","asx"]},"video/x-ms-vob":{"source":"apache","extensions":["vob"]},"video/x-ms-wm":{"source":"apache","extensions":["wm"]},"video/x-ms-wmv":{"source":"apache","compressible":false,"extensions":["wmv"]},"video/x-ms-wmx":{"source":"apache","extensions":["wmx"]},"video/x-ms-wvx":{"source":"apache","extensions":["wvx"]},"video/x-msvideo":{"source":"apache","extensions":["avi"]},"video/x-sgi-movie":{"source":"apache","extensions":["movie"]},"video/x-smv":{"source":"apache","extensions":["smv"]},"x-conference/x-cooltalk":{"source":"apache","extensions":["ice"]},"x-shader/x-fragment":{"compressible":true},"x-shader/x-vertex":{"compressible":true}}')
        }
    };
    var __webpack_module_cache__ = {};

    function __nccwpck_require__(e) {
        var t = __webpack_module_cache__[e];
        if (t !== undefined) {
            return t.exports
        }
        var n = __webpack_module_cache__[e] = {exports: {}};
        var i = true;
        try {
            __webpack_modules__[e](n, n.exports, __nccwpck_require__);
            i = false
        } finally {
            if (i) delete __webpack_module_cache__[e]
        }
        return n.exports
    }

    if (typeof __nccwpck_require__ !== "undefined") __nccwpck_require__.ab = __dirname + "/";
    module.exports = __nccwpck_require__;
})();
