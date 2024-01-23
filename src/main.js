/*
 * @Author: Night-stars-1 nujj1042633805@gmail.com
 * @Date: 2023-08-12 15:41:47
 * @LastEditors: Night-stars-1 nujj1042633805@gmail.com
 * @LastEditTime: 2024-01-23 21:22:00
 * @Description: 
 * 
 * Copyright (c) 2023 by Night-stars-1, All Rights Reserved. 
 */
const fs = require("fs");
const path = require("path");
const { onLoad, setSettings } = require("./main/onLoad.js");
const { output, replaceArk, getEmojis } = require("./main/utils.js");

let emojiCallbackId = "";

function onBrowserWindowCreated(window) {
    const pluginDataPath = LiteLoader.plugins.qqpromote.path.data;
    const settingsPath = path.join(pluginDataPath, "settings.json");
    const emojis = getEmojis();

    // 复写并监听ipc通信内容
    const original_send = window.webContents.send;

    const patched_send = function (channel, ...args) {
        const data = JSON.parse(fs.readFileSync(settingsPath, "utf-8"));
        // 替换历史消息中的小程序卡片
        if (args?.[1]?.msgList?.length > 0 && data.setting.replaceArk) {
            // 替换小程序卡片
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
            // 屏蔽更新
            args[1][0].payload.configData.content = ""
            args[1][0].payload.configData.isSwitchOn = false
        } else if (args?.[1]?.configData?.content?.length > 0) {
            // 侧边栏管理
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
                setSettings(settingsPath, data)
            }
        } else if (args?.[1]?.[0]?.cmdName === "onOpenParamChange" && data.setting.call_barring) {
            // 禁止通话
            if (args?.[1][0]?.payload?.avSdkData) {
                args = null
            }
        } else if (args[0].callbackId === emojiCallbackId) {
            // 收藏表情
            localEmojiInfoList = emojis.map(item => ({
                uin: '',
                emoId: 0,
                emoPath: item,
                isExist: true,
                resId: '',
                url: item,
                md5: '',
                emoOriginalPath: '',
                thumbPath: '',
                RomaingType: '',
                isAPNG: false,
                isMarkFace: false,
                eId: '',
                epId: '0',
                ocrWord: '',
                modifyWord: '',
                exposeNum: 0,
                clickNum: 0,
                desc: '本地表情' 
            }));
            args[1].emojiInfoList = localEmojiInfoList.concat(args[1].emojiInfoList)
        }
        return original_send.call(window.webContents, channel, ...args);
    };

    window.webContents.send = patched_send;

    function ipc_message(_, status, name, ...args) {
        if (name !== "___!log" && args[0][1] && args[0][1][0] != "info") {
            const event = args[0][0];
            const data = args[0][1];
            if (data && data[0] == "nodeIKernelMsgService/fetchFavEmojiList") {
                if (data[1].resId === "") {
                    emojiCallbackId = event.callbackId
                }
            }
        }
    }
    const ipc_message_proxy = window.webContents._events["-ipc-message"]?.[0] || window.webContents._events["-ipc-message"];
    
    const proxyEvents = new Proxy(ipc_message_proxy, {
        // 拦截函数调用
        apply(target, thisArg, argumentsList) {
            ipc_message(...argumentsList);
            return target.apply(thisArg, argumentsList);
        }
    });
    if (window.webContents._events["-ipc-message"][0]) {
        window.webContents._events["-ipc-message"][0] = proxyEvents
    } else {
        window.webContents._events["-ipc-message"] = proxyEvents
    }
}

onLoad()

module.exports = {
    onBrowserWindowCreated
}