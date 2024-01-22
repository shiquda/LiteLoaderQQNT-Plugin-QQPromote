const { ipcMain } = require("electron");
const { tencent_tmt } = require(`./tencent_tmt.js`);
const { baidu_fanyi } = require(`./baidu_fanyi.js`);
const { output } = require(`./utils.js`);
const { setUrlData, getUrlData } = require(`./urlCacha.js`);
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

function setSettings(settingsPath, content) {
    const new_config = typeof content == "string"? JSON.stringify(JSON.parse(content), null, 4):JSON.stringify(content, null, 4)
    fs.writeFileSync(settingsPath, new_config, "utf-8");
}

function onLoad() {
    const pluginDataPath = LiteLoader.plugins.qqpromote.path.data;
    const settingsPath = path.join(pluginDataPath, "settings.json");
    const defaultSettings = {
        "setting": {
            repeatmsg: false,
            translate: false,
            show_time: false,
            show_time_up: false,
            rpmsg_location: false,
            replaceArk: false,
            not_updata: false,
            link_preview: false,
            chatgpt: false,
            chatgpt_location: false,
            chatgpt_key: "",
            chatgpt_url: "https://gpt.srap.link/v1/chat/completions",
            sidebar_list: {},
            messagebar_list: {},
            reply_at: false,
            reply_at_click: false,
            auto_ptt2Text: false,
            auto_login: false,
            call_barring: false,
            friendsinfo: false,
            resetLogin: false,
            display_style: false,
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
                setSettings(settingsPath, content)
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
            let data = {};
            try {
                data = await getUrlData(url)
                if (!data) {
                    const options = { url: url };
                    data = (await ogs(options)).result;
                    setUrlData(url, data)
                }
                return data
            } catch (error) {
                output(error)
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
        async (event, content, data) => {
            try {
                const response = await axios.post(
                    data.chatgpt_url,
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
                            'Authorization': 'Bearer ' + data.chatgpt_key
                        }
                    }
                );
                output(response?.data)
                return response?.data?.choices?.[0]?.message?.content
            } catch (error) {
                output(error)
                return false
            }
        }
    )
}

module.exports = {
    setSettings,
    onLoad
}