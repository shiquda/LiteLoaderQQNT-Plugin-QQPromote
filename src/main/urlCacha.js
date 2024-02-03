/*
 * @Date: 2024-01-23 01:14:13
 * @LastEditors: Night-stars-1 nujj1042633805@gmail.com
 * @LastEditTime: 2024-02-03 18:19:30
 */
const fs = require("fs");
const { LowSync, JSONFileSync } = require('@commonify/lowdb');
const pluginDataPath = LiteLoader.plugins.qqpromote.path.data;

// 设置文件判断
if (!fs.existsSync(pluginDataPath)) {
    fs.mkdirSync(pluginDataPath, { recursive: true });
}

const adapter = new JSONFileSync(`${pluginDataPath}/db.json`)
const db = new LowSync(adapter)
db.read()
if (!db.data) {
    db.data = {
        verison: "1.0.0",
    }
    db.write() 
} else if (!db.data.verison || db.data?.verison < "1.0.0"){
    output("数据库版本过低，正在升级")
    db.data = {
        verison: "1.0.0",
    }
    db.write()
    output("数据库升级完成")
}

async function setUrlData(url, data) {
    db.data[url] = data;
    db.write()
}

async function getUrlData(url) {
    db.read()
    return db.data[url]
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