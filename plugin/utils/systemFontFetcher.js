const {exec} = require("child_process");
const {log} = require("./plugin"); // Assuming 'plugin' contains the log object.

let cachedFonts = null;

function getSystemFonts(callback) {
    if (cachedFonts) return callback(cachedFonts);
    // platform is a global variable from main.js, which needs to be passed or imported.
    // For now, let's assume it's passed as an argument or can be imported.
    // Given 'platform' is a global from main.js, I will try to make it an import.
    // If it's truly global, ncc will likely handle it. If not, it will fail.
    const platform = process.platform; 

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

module.exports = getSystemFonts;
