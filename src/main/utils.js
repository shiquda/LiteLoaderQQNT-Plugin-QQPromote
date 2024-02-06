/*
 * @Date: 2024-01-22 20:33:56
 * @LastEditors: Night-stars-1 nujj1042633805@gmail.com
 * @LastEditTime: 2024-02-03 19:07:10
 */
const fs = require("fs");
const path = require("path");
const { encode, getDuration } = require('silk-wasm')

const pluginDataPath = LiteLoader.plugins.qqpromote.path.data;
const settingsPath = path.join(pluginDataPath, "settings.json");
const emojiPath = path.join(pluginDataPath, "emoji");
const pttPath = path.join(pluginDataPath, "ptt");
const remotesPath = path.join(emojiPath, "remotes.txt");
const defaultSettings = {
    setting: {
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
        chatgpt_url: "https://api.openai.com/v1/chat/completions",
        chatgpt_model: "gpt-3.5-turbo",
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
        translate_baidu_key: '',
        video_background_data: {
            url: "",
            style: {}
        },
        video_background: {
            "#/main/message": {
                name: "聊天页面",
                value: false
            },
            "#/setting/settings/common": {
                name: "设置页面",
                value: false
            },
            "#/index/2": {
                name: "频道页面",
                value: false
            }
        },
        face_prompt: false,
        face_block: {
            392: {
                name: '新年小龙',
                value: false
            },
            393: {
                name: '新年中龙',
                value: false
            },
            394: {
                name: '新年大龙',
                value: false
            }
        }
    }
}

// 设置文件判断
if (!fs.existsSync(emojiPath)) {
    fs.mkdirSync(emojiPath, { recursive: true });
}
if (!fs.existsSync(pttPath)) {
    fs.mkdirSync(pttPath, { recursive: true });
}
if (!fs.existsSync(remotesPath)) {
    fs.writeFileSync(remotesPath, "");
}
if (!fs.existsSync(settingsPath)) {
    fs.writeFileSync(settingsPath, JSON.stringify(defaultSettings, null, 4));
} else {
    const data = fs.readFileSync(settingsPath, "utf-8");
    const config = checkAndCompleteKeys(JSON.parse(data), defaultSettings);
    fs.writeFileSync(settingsPath, JSON.stringify(config, null, 4), "utf-8");
}

function checkAndCompleteKeys(json, defaultSettings) {
    const keys = Object.keys(json);
    const defaultKeys = Object.keys(defaultSettings);

    for (const defaultKey of defaultKeys) {
        if (!keys.includes(defaultKey)) {
            json[defaultKey] = defaultSettings[defaultKey]; // 补全缺少的 key
        } else if (typeof json[defaultKey] === "object" && typeof defaultSettings[defaultKey] === "object") {
            json[defaultKey] = checkAndCompleteKeys(json[defaultKey], defaultSettings[defaultKey]);
        }
    }
    
    return json;
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

async function getAmr(text) {
    const pcm = fs.readFileSync('xxx')
    const silk = await encode(pcm, 24000)
    fs.readFileSync(`${pttPath}/`, silk.data)
    return 
}

/**
 * 防抖函数，避免频繁触发
 * @param {function} func 
 * @param {number} time 
 * @returns {function}
 */
function debounce(func, time) {
    let timer = null;
    return (...args) => {
      timer && clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, time);
    };
}

module.exports = {
    replaceArk,
    getEmojis,
    output,
    getAmr,
    debounce
}
