/*
 * @Date: 2024-01-22 20:33:56
 * @LastEditors: Night-stars-1 nujj1042633805@gmail.com
 * @LastEditTime: 2024-01-22 20:46:52
 */
// 卡片替换函数
function replaceArk(json, msg_seq) {
    return JSON.stringify({
        app: "com.tencent.structmsg",
        config: json.config,
        desc: "新闻",
        extra: { app_type: 1, appid: 100951776, msg_seq, uin: json.meta.detail_1.host.uin },
        meta: {
            news: {
                action: "",
                android_pkg_name: "",
                app_type: 1,
                appid: 100951776,
                ctime: json.config.ctime,
                desc: json.meta.detail_1.desc,
                jumpUrl: json.meta.detail_1.qqdocurl?.replace(/\\/g, ""),
                preview: json.meta.detail_1.preview,
                source_icon: json.meta.detail_1.icon,
                source_url: "",
                tag: json.meta.detail_1.desc,
                title: json.meta.detail_1.title,
                uin: json.meta.detail_1.host.uin,
            },
        },
        prompt: "[分享]" + json.desc,
        ver: "0.0.0.1",
        view: "news",
    });
}

function output(...args) {
    console.log("\x1b[32m[QQ增强]\x1b[0m", ...args);
}

module.exports = {
    replaceArk,
    output
}