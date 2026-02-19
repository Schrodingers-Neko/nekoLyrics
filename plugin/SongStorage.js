const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const dir = "./SongStorage";

function getMd5(data) {
    var md5 = crypto.createHash("md5");
    return md5.update(data).digest("hex");
}

function getSongFile(song) {
    // Ensuring we use consistent properties for the hash
    return path.join(dir, getMd5(song.name + song.author + (song.bundleIdentifier || "")));
}

class SongStorage {
    static initSongStorage() {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
    }

    static getSongLyrics(song) {
        if (!song.name) return null;
        const songfile = getSongFile(song);
        if (!fs.existsSync(songfile)) {
            return null;
        }
        try {
            const data = fs.readFileSync(songfile, "utf8");
            if (!data || data.trim() === "{}" || data.trim() === "") {
                fs.unlinkSync(songfile); // Delete empty/corrupt cache
                return null;
            }
            const parsed = JSON.parse(data);
            // Check for either 'lyrics' or the old 'lyric' property for backward compatibility
            if (!parsed.lyrics && !parsed.lyric) return null;
            return parsed;
        } catch (_e) {
            if (fs.existsSync(songfile)) fs.unlinkSync(songfile);
            return null;
        }
    }

    static setSongLyrics(song, lyrics) {
        // Validation: handle both new 'lyrics' and legacy 'lyric' property
        const lyricsText = lyrics?.lyrics || lyrics?.lyric;
        if (!lyricsText || lyricsText.trim() === "") {
            return; // Don't cache empty results
        }
        
        // Normalize to the new 'lyrics' property before saving
        const dataToSave = { lyrics: lyricsText };
        
        const songfile = getSongFile(song);
        const data = JSON.stringify(dataToSave);
        fs.writeFileSync(songfile, data);
    }

    static getSongLyricsOffset(song) {
        const songfile = getSongFile(song) + ".offset";
        if (!fs.existsSync(songfile)) {
            return null;
        }
        try {
            const data = fs.readFileSync(songfile, "utf8");
            return parseInt(data);
        } catch (_e) {
            return null;
        }
    }

    static setSongLyricsOffset(song, offset) {
        const songfile = getSongFile(song) + ".offset";
        fs.writeFileSync(songfile, offset.toString());
    }
}

module.exports = {
    SongStorage
};
