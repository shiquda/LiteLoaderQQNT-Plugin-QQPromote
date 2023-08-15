/*
 * @Author: Night-stars-1 nujj1042633805@gmail.com
 * @Date: 2023-08-05 13:44:33
 * @LastEditors: Night-stars-1 nujj1042633805@gmail.com
 * @LastEditTime: 2023-08-15 19:13:28
 * @Description: 
 * 
 * Copyright (c) 2023 by Night-stars-1, All Rights Reserved. 
 */
// Electron 主进程 与 渲染进程 交互的桥梁
const { contextBridge, ipcRenderer } = require("electron");

// 在window对象下导出只读对象
contextBridge.exposeInMainWorld("qqpromote", {
    getSettings: () => ipcRenderer.invoke(
        "LiteLoader.qqpromote.getSettings"
    ),
    setSettings: content => ipcRenderer.invoke(
        "LiteLoader.qqpromote.setSettings",
        content
    ),
    translate: (text, SECRET_ID, SECRET_KEY) => ipcRenderer.invoke(
        "LiteLoader.qqpromote.translate",
        text, SECRET_ID, SECRET_KEY
    ),
    ogs: url => ipcRenderer.invoke(
        "LiteLoader.qqpromote.ogs",
        url
    ),
    get_imgbase64: (url, config) => ipcRenderer.invoke(
        "LiteLoader.qqpromote.get_imgbase64",
        url, config
    )
});
