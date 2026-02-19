/// <reference path="../utils/common.js" />
/// <reference path="../utils/action.js" />

// $local 是否国际化
// $back 是否自行决定回显时机
// $dom 获取文档元素 - 不是动态的都写在这里面
const $local = true,
    $back = false,
    $dom = {
        main: $(".sdpi-wrapper"),
        colorMode: $("#colorMode"),
        displayMode: $("#displayMode"),
        fontFamily: $("#fontFamily"),
        songmid: $("#songmid"),
        textColor: $("#textColor"),
        offsetValue: $("#offsetValue")
    };

const $propEvent = {
    didReceiveGlobalSettings({settings}) {},
    didReceiveSettings(data) {
        //给元素赋初始值
        $dom.displayMode.value = $settings.mode;
        $dom.colorMode.value = $settings.colorMode;
        $dom.textColor.value = $settings.color;
        $dom.fontFamily.value = $settings.fontFamily || "Arial";


        if ($settings.list && Array.isArray($settings.list)) {
            $dom.songmid.innerHTML = "";
            $settings.list.forEach((item) => {
                const singer = item.singer.join("/");
                let option = `<option value="${item.songmid}">${item.songname} - ${singer}</option>`;
                $dom.songmid.innerHTML += option;
            });
            console.log($dom.songmid.innerHTML);

            $dom.songmid.value = $settings.songmid;
        } else {
            $dom.songmid.innerHTML = "<option value=\"none\">暂无歌词</option>";
        }
    },
    sendToPropertyInspector(data) {
        if (data.event === "getFonts" && Array.isArray(data.fonts)) {
            const select = document.getElementById("fontFamily");
            const currentFont = $settings.fontFamily || "Arial";
            select.innerHTML = "";
            data.fonts.forEach(font => {
                const option = document.createElement("option");
                option.value = font;
                option.innerText = font;
                select.appendChild(option);
            });
            select.value = currentFont;
        }
    }
};

// 添加事件监听
$dom.displayMode.addEventListener("change", function () {
    $settings.mode = this.value;
});
$dom.fontFamily.addEventListener("change", function () {
    $settings.fontFamily = this.value;
});
$dom.colorMode.addEventListener("change", function () {
    $settings.colorMode = this.value;
});
$dom.textColor.addEventListener("input", function () {
    $settings.color = this.value;
});
function adjustOffset(change) {
    const input = document.getElementById("offsetValue");
    let value = parseFloat(input.value) || 0;
    value = (value + change).toFixed(1);
    input.value = value;
    $websocket.sendToPlugin({
        offsettime: parseInt(value * 1000)
    });
}
// 添加事件监听
$dom.offsetValue.addEventListener("change", function () {
    const input = document.getElementById("offsetValue");
    let value = parseFloat(input.value) || 0;
    input.value = value.toFixed(1);
    $websocket.sendToPlugin({
        offsettime: parseInt(value * 1000)
    });
});
$dom.songmid.addEventListener("change", function () {
    $settings.songmid = this.value;
    $websocket.sendToPlugin({
        songmid: this.value
    });
});
