const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const dir = "./cache";

function getMd5(data) {
    var md5 = crypto.createHash("md5");
    return md5.update(data).digest("hex");
}

function getfilePath(song) {
    // Ensuring we use consistent properties for the hash
    return path.join(dir, getMd5(song.name + song.author + (song.bundleIdentifier || "")));
}

class LyricsCache {
    static init() {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
    }

    static getSongLyrics(song) {
        if (!song.name) return null;
        const filePath = getfilePath(song);
        if (!fs.existsSync(filePath)) {
            return null;
        }
        try {
            const data = fs.readFileSync(filePath, "utf8");
            if (!data || data.trim() === "{}" || data.trim() === "") {
                fs.unlinkSync(filePath); // Delete empty/corrupt cache
                return null;
            }
            const parsed = JSON.parse(data);
            return parsed.lyrics === null ? null : parsed;
        } catch (_e) {
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            return null;
        }
    }

    static setSongLyrics(song, lyrics) {
        const dataToSave = {"lyrics": lyrics?.lyrics?.trim() ?? "null"}; // cache empty results
        const filePath = getfilePath(song);
        const data = JSON.stringify(dataToSave);
        fs.writeFileSync(filePath, data);
    }

    static getSongLyricsOffset(song) {
        const filePath = getfilePath(song) + ".offset";
        if (!fs.existsSync(filePath)) {
            return null;
        }
        try {
            const data = fs.readFileSync(filePath, "utf8");
            return parseInt(data);
        } catch (_e) {
            return null;
        }
    }

    static setSongLyricsOffset(song, offset) {
        const filePath = getfilePath(song) + ".offset";
        fs.writeFileSync(filePath, offset.toString());
    }
}

module.exports = {
    lyricsCache: LyricsCache
};
