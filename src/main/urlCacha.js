/*
 * @Date: 2024-01-23 01:14:13
 * @LastEditors: Night-stars-1 nujj1042633805@gmail.com
 * @LastEditTime: 2024-01-23 02:20:34
 */
const { LowSync, JSONFileSync } = require('@commonify/lowdb');
const pluginDataPath = LiteLoader.plugins.qqpromote.path.data;

const adapter = new JSONFileSync(`${pluginDataPath}/db.json`)
const db = new LowSync(adapter)
if (db.read()) {
    db.data = {}
    db.write()
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