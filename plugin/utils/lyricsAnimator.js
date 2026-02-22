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

module.exports = {
    LyricsAnimator,
    estimateTextWidth,
};