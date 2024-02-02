const { ipcMain, shell } = require("electron");
const { tencent_tmt } = require(`./tencent_tmt.js`);
const { baidu_fanyi } = require(`./baidu_fanyi.js`);
const { output, getAmr } = require(`./utils.js`);
const { setUrlData, getUrlData } = require(`./urlCacha.js`);
const axios = require('axios');
const fs = require("fs");
const path = require("path");
const ogs = require("open-graph-scraper");

function setSettings(settingsPath, content) {
    const new_config = typeof content == "string"? JSON.stringify(JSON.parse(content), null, 4):JSON.stringify(content, null, 4)
    fs.writeFileSync(settingsPath, new_config, "utf-8");
}

function onLoad() {
    const pluginDataPath = LiteLoader.plugins.qqpromote.path.data;
    const settingsPath = path.join(pluginDataPath, "settings.json");

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
    // 打开文件夹
    ipcMain.handle(
        "LiteLoader.qqpromote.openFolder", 
        (event, localPath) => {
            const openPath = path.normalize(localPath);
            shell.openPath(openPath);
        }
    );
    // 文字转语言
    ipcMain.handle(
        "LiteLoader.qqpromote.getAmrPath", 
        async (event, text) => {
            try{
                return await getAmr(text)
            } catch(error) {
                return false
            }
        }
    );
}

module.exports = {
    setSettings,
    onLoad
}