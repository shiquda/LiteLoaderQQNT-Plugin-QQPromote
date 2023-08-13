/*
 * @Author: Night-stars-1 nujj1042633805@gmail.com
 * @Date: 2023-08-12 15:41:47
 * @LastEditors: Night-stars-1 nujj1042633805@gmail.com
 * @LastEditTime: 2023-08-13 17:40:23
 * @Description: 
 * 
 * Copyright (c) 2023 by Night-stars-1, All Rights Reserved. 
 */
// 腾讯云TMT
const { ipcMain } = require("electron");
const { get_authorization } = require(`./tencent_tmt.js`);
const axios = require('axios');
const fs = require("fs");
const path = require("path");

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
                alert(error);
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
                alert(error);
            }
        }
    )
}

function output(...args) {
    console.log("\x1b[32m[QQ增强]\x1b[0m", ...args);
}

module.exports = {
    onLoad
}