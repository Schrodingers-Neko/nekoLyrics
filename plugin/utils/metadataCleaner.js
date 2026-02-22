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

module.exports = MetadataCleaner;
