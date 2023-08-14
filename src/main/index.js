/*
 * @Author: Night-stars-1 nujj1042633805@gmail.com
 * @Date: 2023-08-12 15:41:47
 * @LastEditors: Night-stars-1 nujj1042633805@gmail.com
 * @LastEditTime: 2023-08-15 00:43:21
 * @Description: 
 * 
 * Copyright (c) 2023 by Night-stars-1, All Rights Reserved. 
 */
// 腾讯云TMT
const { ipcMain, dialog } = require("electron");
const { get_authorization } = require(`./tencent_tmt.js`);
const axios = require('axios');
const fs = require("fs");
const path = require("path");
const ogs = require("open-graph-scraper");

async function tencent_tmt(SourceText, SECRET_ID, SECRET_KEY){
    const data = {
        'SourceText': SourceText,
        'Source': 'en',
        'Target': 'zh',
        'ProjectId': 0
    }
    const timestamp = Math.floor(Date.now() / 1000)
    const authorization = get_authorization(data, timestamp, SECRET_ID, SECRET_KEY)
    const url = 'https://tmt.tencentcloudapi.com'
    const config = {
        headers: {
            'Authorization':authorization,
            'Content-Type': 'application/json; charset=utf-8',
            'Host': 'tmt.tencentcloudapi.com',
            'X-TC-Action': 'TextTranslate',
            'X-TC-Timestamp': timestamp,
            'X-TC-Version': '2018-03-21',
            'X-TC-Region': 'ap-guangzhou'
        }
    }
    const tmt_response = await post(url, data, config)
    const tmt_data = tmt_response.data.Response
    return tmt_data
}

/**
 * @description post请求封装
 * @param {string} url 请求地址
 * @param {object} data 请求数据
 * @param {object} config 配置信息
 * @returns {Promise} Promise对象
 */
async function post(url, data, config){
    const response = await axios.post(url, data, config);
    return response
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
            translate_SECRET_ID: 'SECRET_ID',
            translate_SECRET_KEY: 'SECRET_KEY'
        }
    }
    //设置文件判断
    if (!fs.existsSync(pluginDataPath)) {
        fs.mkdirSync(pluginDataPath, { recursive: true });
    }
    if (!fs.existsSync(settingsPath)) {
        fs.writeFileSync(settingsPath, JSON.stringify(defaultSettings));
    } else {
        const data = fs.readFileSync(settingsPath, "utf-8");
        const config = checkAndCompleteKeys(JSON.parse(data), defaultSettings, "setting");
        fs.writeFileSync(settingsPath, JSON.stringify(config), "utf-8");
    }

    //获取设置
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

    //保存设置
    ipcMain.handle(
        "LiteLoader.qqpromote.setSettings",
        (event, content) => {
            try {
                new_config = typeof content == "string"? content:JSON.stringify(content)
                fs.writeFileSync(settingsPath, new_config, "utf-8");
            } catch (error) {
                output(error);
            }
        }
    )
    //翻译
    ipcMain.handle(
        "LiteLoader.qqpromote.translate",
        async (event, text, SECRET_ID, SECRET_KEY) => {
            try {
                return await tencent_tmt(text, SECRET_ID, SECRET_KEY)
            } catch (error) {
                output(error);
            }
        }
    )
    //ogs
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
                data.setting.sidebar_list=content
                fs.writeFileSync(settingsPath, JSON.stringify(data), "utf-8");
                // output(data);
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