const axios = require("axios");
const MetadataCleaner = require("./metadataCleaner");
const {log} = require("./plugin"); // Assuming 'plugin' contains the log object.

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

module.exports = HybridSearch;
