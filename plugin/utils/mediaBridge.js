const {spawn} = require("child_process");
const path = require("path");
const {log} = require("./plugin");

let TrackInfoGetter = null;
let buffer = "";

function initializeMediaBridge(currentAction, platform, dirName) {
    if (platform === "darwin") {
        TrackInfoGetter = spawn("/usr/bin/perl", [path.join(dirName, "bin", "mediaremote-adapter.pl"), path.join(dirName, "build", "MediaRemoteAdapter.framework"), "stream", "--no-diff", "--debounce=1000"]);
    } else if (platform === "win32") {
        const exePath = path.join(...[__dirname, "bin", "MediaBridge.exe"]);
        TrackInfoGetter = spawn(exePath);
    }

    if (TrackInfoGetter) {
        TrackInfoGetter.stdout.setEncoding("utf8");
        TrackInfoGetter.stdout.on("data", (data) => {
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
                        currentAction[id].getTrackInfo(t);
                    }
                }
            }
        });
        TrackInfoGetter.stderr.on("data", (data) => {
            log.error(`stderr:${data}`);
        });
        TrackInfoGetter.on("error", (err) => {
            log.error(`MediaBridge Error: ${err.message}`);
            TrackInfoGetter = null;
        });
    }
}

function killMediaBridge() {
    if (TrackInfoGetter) {
        TrackInfoGetter.kill("SIGINT");
        TrackInfoGetter = null;
    }
}

module.exports = {
    initializeMediaBridge,
    killMediaBridge
};
