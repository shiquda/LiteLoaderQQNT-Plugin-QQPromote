/*
 * @Date: 2024-01-22 20:33:56
 * @LastEditors: Night-stars-1 nujj1042633805@gmail.com
 * @LastEditTime: 2024-01-23 23:13:12
 */
const fs = require("fs");
const path = require("path");

const pluginDataPath = LiteLoader.plugins.qqpromote.path.data;
const settingsPath = path.join(pluginDataPath, "settings.json");
const emojiPath = path.join(pluginDataPath, "emoji");
const remotesPath = path.join(emojiPath, "remotes.txt");
const defaultSettings = {
    "setting": {
        repeat_msg: false,
        repeat_msg_time: false,
        translate: false,
        show_time: false,
        show_time_up: false,
        rpmsg_location: false,
        replaceArk: false,
        not_updata: false,
        link_preview: false,
        chatgpt: false,
        chatgpt_add_reply: false,
        chatgpt_location: false,
        chatgpt_key: "",
        chatgpt_url: "https://gpt.srap.link/v1/chat/completions",
        sidebar_list: {},
        messagebar_list: {},
        upbar_list: {},
        reply_at: false,
        reply_at_click: false,
        auto_ptt2Text: false,
        auto_login: false,
        call_barring: false,
        friendsinfo: false,
        resetLogin: false,
        display_style: false,
        local_emoji: false,
        qrcode: false,
        emoji_folder: emojiPath,
        translate_type: "腾讯翻译",
        time_color: "rgba(0,0,0,.5)",
        translate_SECRET_ID: '',
        translate_SECRET_KEY: '',
        translate_baidu_appid: '',
        translate_baidu_key: ''
    }
}

// 设置文件判断
if (!fs.existsSync(emojiPath)) {
    fs.mkdirSync(emojiPath, { recursive: true });
}
if (!fs.existsSync(remotesPath)) {
    fs.writeFileSync(remotesPath, "");
}
if (!fs.existsSync(settingsPath)) {
    fs.writeFileSync(settingsPath, JSON.stringify(defaultSettings, null, 4));
} else {
    const data = fs.readFileSync(settingsPath, "utf-8");
    const config = checkAndCompleteKeys(JSON.parse(data), defaultSettings, "setting");
    fs.writeFileSync(settingsPath, JSON.stringify(config, null, 4), "utf-8");
}

function checkAndCompleteKeys(json1, json2, check_key) {
    const keys1 = Object.keys(json1[check_key]);
    const keys2 = Object.keys(json2[check_key]);

    for (const key of keys2) {
        if (!keys1.includes(key)) {
            json1[check_key][key] = json2[check_key][key]; // 补全缺少的 key
        }
    }
    
    return json1;
}

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

/**
 * 获取远程表情
 * @returns 
 */
function getRemote(){
    if (!fs.existsSync(remotesPath)) return [];
    const stickerUrls = fs.readFileSync(remotesPath).toString("utf8").split("\r\n");
    return stickerUrls[0] == ''? []:stickerUrls;
}

/**
 * 获取表情
 * @returns 
 */
function getEmojis(){
    try {
        const data = fs.readdirSync(emojiPath, { withFileTypes: true })
            .filter(dirent => dirent.isFile() && dirent.name !== 'remotes.txt')
            .map(dirent => path.join(emojiPath, dirent.name));
        const remote_data = getRemote()
        return data.concat(remote_data);
    } catch (error) {
        output(error);
        return [];
    }
}


module.exports = {
    replaceArk,
    getEmojis,
    output
}