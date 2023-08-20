/*
 * @Author: Night-stars-1 nujj1042633805@gmail.com
 * @Date: 2023-08-12 15:41:47
 * @LastEditors: Night-stars-1 nujj1042633805@gmail.com
 * @LastEditTime: 2023-08-20 13:53:35
 * @Description: 
 * 
 * Copyright (c) 2023 by Night-stars-1, All Rights Reserved. 
 */
// 腾讯云TMT
const { ipcMain, dialog } = require("electron");
const { tencent_tmt } = require(`./tencent_tmt.js`);
const { baidu_fanyi } = require(`./baidu_fanyi.js`);
const axios = require('axios');
const fs = require("fs");
const path = require("path");
const ogs = require("open-graph-scraper");

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

function onLoad(plugin, liteloader) {
    const pluginDataPath = plugin.path.data;
    const settingsPath = path.join(pluginDataPath, "settings.json");
    const defaultSettings = {
        "setting": {
            repeatmsg: false,
            translate: false,
            show_time: false,
            rpmsg_location: false,
            replaceArk: false,
            not_updata: false,
            link_preview: false,
            chatgpt: false,
            chatgpt_location: false,
            chatgpt_key: "",
            reply_at: false,
            translate_type: "腾讯翻译",
            time_color: "rgba(0,0,0,.5)",
            translate_SECRET_ID: '',
            translate_SECRET_KEY: '',
            translate_baidu_appid: '',
            translate_baidu_key: ''
        }
    }
    // 设置文件判断
    if (!fs.existsSync(pluginDataPath)) {
        fs.mkdirSync(pluginDataPath, { recursive: true });
    }
    if (!fs.existsSync(settingsPath)) {
        fs.writeFileSync(settingsPath, JSON.stringify(defaultSettings, null, 4));
    } else {
        const data = fs.readFileSync(settingsPath, "utf-8");
        const config = checkAndCompleteKeys(JSON.parse(data), defaultSettings, "setting");
        fs.writeFileSync(settingsPath, JSON.stringify(config, null, 4), "utf-8");
    }

    // 获取设置
    ipcMain.handle(
        "LiteLoader.qqpromote.getSettings",
        (event) => {
            try {
                const data = fs.readFileSync(settingsPath, "utf-8");
                return JSON.parse(data);
            } catch (error) {
                console.log(error);
                return {};
            }
        }
    );

    // 保存设置
    ipcMain.handle(
        "LiteLoader.qqpromote.setSettings",
        (event, content) => {
            try {
                new_config = typeof content == "string"? JSON.stringify(JSON.parse(content), null, 4):JSON.stringify(content, null, 4)
                fs.writeFileSync(settingsPath, new_config, "utf-8");
            } catch (error) {
                output(error);
            }
        }
    )
    // 翻译
    ipcMain.handle(
        "LiteLoader.qqpromote.translate",
        async (event, text, data) => {
            try {
                const SECRET_ID = data.translate_SECRET_ID
                const SECRET_KEY = data.translate_SECRET_KEY
                const type = data.translate_type
                if (type == "百度翻译") {
                    const appid = data.translate_baidu_appid
                    const key = data.translate_baidu_key
                    return await baidu_fanyi(text, appid, key)
                } else if (type == "腾讯翻译") {
                    return await tencent_tmt(text, SECRET_ID, SECRET_KEY)
                }
            } catch (error) {
                output(error);
            }
        }
    )
    // ogs
    ipcMain.handle(
        "LiteLoader.qqpromote.ogs",
        async (event, url) => {
            try {
                const options = { url: url };
                return await ogs(options)
            } catch (error) {
                return false
            }
        }
    )
    // img_base64
    ipcMain.handle(
        "LiteLoader.qqpromote.get_imgbase64",
        async (event, url, config) => {
            try {
                const response = await axios.get(url, config);
                const img_data = response.data;
                const base64_data = Buffer.from(img_data).toString('base64');
                const base64ImageUrl = `data:image/jpeg;base64,${base64_data}`;
                return base64ImageUrl
            } catch (error) {
                return false
            }
        }
    )
    // chatgpt
    ipcMain.handle(
        "LiteLoader.qqpromote.chatgpt",
        async (event, content, OPENAI_API_KEY) => {
            try {
                const response = await axios.post(
                    'https://gpt.srap.link/v1/chat/completions',
                    {
                        'model': 'gpt-3.5-turbo',
                        'messages': [
                        {
                            'role': 'user',
                            'content': content
                        }
                        ],
                        'temperature': 0.7
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + OPENAI_API_KEY
                        }
                    }
                );
                return response?.data?.choices?.[0]?.message?.content
            } catch (error) {
                return false
            }
        }
    )
}

function onBrowserWindowCreated(window, plugin) {
    const pluginDataPath = plugin.path.data;
    const settingsPath = path.join(pluginDataPath, "settings.json");
    const data = JSON.parse(fs.readFileSync(settingsPath, "utf-8"));

    // 复写并监听ipc通信内容
    const original_send =
        (window.webContents.__qqntim_original_object && window.webContents.__qqntim_original_object.send) ||
        window.webContents.send;

    const patched_send = function (channel, ...args) {
        // 替换历史消息中的小程序卡片
        if (args?.[1]?.msgList?.length > 0 && data.setting.replaceArk) {
            const msgList = args?.[1]?.msgList;
            msgList.forEach((msgItem) => {
                let msg_seq = msgItem.msgSeq;
                msgItem.elements.forEach((msgElements) => {
                    if (msgElements.arkElement && msgElements.arkElement.bytesData) {
                        const json = JSON.parse(msgElements.arkElement.bytesData);
                        if (json?.meta?.detail_1?.appid) {
                            msgElements.arkElement.bytesData = replaceArk(json, msg_seq);
                        }
                    }
                });
            });
        } else if (args?.[1]?.[0]?.cmdName === "nodeIKernelUnitedConfigListener/onUnitedConfigUpdate" && data.setting.not_updata) {
            args[1][0].payload.configData.content = ""
            args[1][0].payload.configData.isSwitchOn = false
        } else if (args?.[1]?.configData?.content?.length > 0) {
            const content = JSON.parse(args[1].configData.content)
            if (Array.isArray(content) && !(content.findIndex((item) => item.label === "空间"))) {
                if (Array.isArray(data.setting.sidebar_list)) {
                    data.setting.sidebar_list = {}
                }
                const new_content = []
                content.forEach((item) => {
                    if (!(item.label in data.setting.sidebar_list)) {
                        data.setting.sidebar_list[item.label] = false
                    }
                    if (!data.setting.sidebar_list[item.label]){
                        new_content.push(item)
                    }
                })
                args[1].configData.content = JSON.stringify(new_content)
                fs.writeFileSync(settingsPath, JSON.stringify(data, null, 4), "utf-8");
            }
        }

        return original_send.call(window.webContents, channel, ...args);
    };

    if (window.webContents.__qqntim_original_object) {
        window.webContents.__qqntim_original_object.send = patched_send;
    } else {
        window.webContents.send = patched_send;
    }
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

module.exports = {
    onLoad,
    onBrowserWindowCreated
}