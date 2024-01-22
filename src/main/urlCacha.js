const fs = require("fs");
const levelup = require('levelup');
const leveldown = require('leveldown');
const pluginDataPath = LiteLoader.plugins.qqpromote.path.data;
const db = levelup(leveldown(`${pluginDataPath}/urlCache`));

function setUrlData(url, data) {
    data = JSON.stringify(data);
    // 写入数据
    db.put(url, data, (err) => {
        if (err) {
            outputer(err);
        }
    });
}

async function getUrlData(url) {
    // 读取数据
    db.get(url, (err, value) => {
        if (err) {
            outputer(err);
            return {};
        } else {
            try {
                return JSON.parse(value.toString())
            } catch (error) {
                outputer(error);
                return {};
            }
        }
    });
}

function output(...args) {
    console.info("\x1b[32m[QQ增强-链接缓存]\x1b[0m", ...args);
}

function outputer(...args) {
    console.error("\x1b[32m[QQ增强-链接缓存]\x1b[0m", ...args);
}
module.exports = {
    setUrlData,
    getUrlData
}