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

module.exports = getCurrentLyrics;
