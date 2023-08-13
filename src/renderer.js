/*
 * @Author: Night-stars-1 nujj1042633805@gmail.com
 * @Date: 2023-08-07 21:07:34
 * @LastEditors: Night-stars-1 nujj1042633805@gmail.com
 * @LastEditTime: 2023-08-13 21:27:46
 * @Description: 
 * 
 * Copyright (c) 2023 by Night-stars-1, All Rights Reserved. 
 */
const separator_ele = document.createElement("div");
separator_ele.innerHTML = `
<div class="q-context-menu-separator" role="separator"></div>
`
const repeatmsg_ele = document.createElement("div");
repeatmsg_ele.innerHTML = `
<a 
 id="repeatmsg"
 class="q-context-menu-item q-context-menu-item--normal" 
 aria-disabled="false" 
 role="menuitem" 
 tabindex="-1">
  <div class="q-context-menu-item__icon q-context-menu-item__head">
    <i class="q-icon" data-v-717ec976="" style="--b4589f60: inherit; --6ef2e80d: 16px;">
        <svg t="1691421273840" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1478" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><path d="M511.6 961.4c12.1 0 22.6-4.4 31.5-13.3s13.3-19.4 13.3-31.5V558.3h358.3c12.1 0 22.6-4.4 31.5-13.3s13.3-19.4 13.3-31.5c0-12.1-4.4-22.6-13.3-31.5s-19.4-13.3-31.5-13.3H556.4V110.3c0-12.1-4.4-22.6-13.3-31.5s-19.4-13.3-31.5-13.3c-12.1 0-22.6 4.4-31.5 13.3s-13.3 19.4-13.3 31.5v358.3H108.5c-12.1 0-22.6 4.4-31.5 13.3s-13.3 19.4-13.3 31.5c0 12.1 4.4 22.6 13.3 31.5s19.4 13.3 31.5 13.3h358.3v358.3c0 12.1 4.4 22.6 13.3 31.5s19.4 13.4 31.5 13.4z" p-id="1479"></path></svg>
    </i>
  </div>
  <!---->
  <span class="q-context-menu-item__text">+1</span>
  <!---->
</a>
`
const qrcode_ele = document.createElement("div");
qrcode_ele.innerHTML = `
<a 
 id="qrcode"
 class="q-context-menu-item q-context-menu-item--normal" 
 aria-disabled="false" 
 role="menuitem" 
 tabindex="-1">
  <div class="q-context-menu-item__icon q-context-menu-item__head">
    <i class="q-icon" data-v-717ec976="" style="--b4589f60: inherit; --6ef2e80d: 16px;">
    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M0 80C0 53.5 21.5 32 48 32h96c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V80zM64 96v64h64V96H64zM0 336c0-26.5 21.5-48 48-48h96c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V336zm64 16v64h64V352H64zM304 32h96c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48H304c-26.5 0-48-21.5-48-48V80c0-26.5 21.5-48 48-48zm80 64H320v64h64V96zM256 304c0-8.8 7.2-16 16-16h64c8.8 0 16 7.2 16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s7.2-16 16-16s16 7.2 16 16v96c0 8.8-7.2 16-16 16H368c-8.8 0-16-7.2-16-16s-7.2-16-16-16s-16 7.2-16 16v64c0 8.8-7.2 16-16 16H272c-8.8 0-16-7.2-16-16V304zM368 480a16 16 0 1 1 0-32 16 16 0 1 1 0 32zm64 0a16 16 0 1 1 0-32 16 16 0 1 1 0 32z"/></svg>
    </i>
  </div>
  <!---->
  <span class="q-context-menu-item__text">识别二维码</span>
  <!---->
</a>
`

import { createApp, ref, reactive, watch } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.3.4/vue.esm-browser.prod.min.js'
let translate_hover
const setting_data = await qqpromote.getSettings()

function output(...args) {
    console.log("\x1b[32m[QQ增强-渲染]\x1b[0m", ...args);
}

async function setSettings(content) {
    await qqpromote.setSettings(JSON.stringify(content))
}

async function addrepeatmsg_menu(qContextMenu, message_element) {
    const { classList } = message_element
    const msgIds = message_element?.closest(".msg-content-container")?.closest(".message")?.__VUE__?.[0]?.props?.msgRecord.msgId;
    const qThemeValue = document.body.getAttribute('q-theme');
    //qContextMenu.style.setProperty('--q-contextmenu-max-height', 'calc(40vh - 16px)');
    const location = setting_data.setting.rpmsg_location? 'afterbegin' : 'beforeend'
    // 插入分隔线
    // qContextMenu.insertAdjacentHTML(location, separatorHTML)
    qContextMenu.insertBefore(separator_ele, qContextMenu.firstChild);
    // +1
    const repeatmsg = repeatmsg_ele.cloneNode(true);
    repeatmsg.addEventListener('click', async () => {
        const peer = await LLAPI.getPeer()
        if (classList[0] == "ptt-element__progress") {
            const msg = await LLAPI.getPreviousMessages(peer, 1, msgIds.toString())
            const elements = msg[0].elements
            await LLAPI.sendMessage(peer, elements)
        } else {
            await LLAPI.forwardMessage(peer, peer, [msgIds])
        }
        // 关闭右键菜单
        qContextMenu.remove()
    })
    if (qThemeValue == "light") {
        qContextMenu.insertBefore(repeatmsg, qContextMenu.firstChild);
        // qContextMenu.insertAdjacentHTML(location, repeatmsgLight)
    } else {
        repeatmsg.querySelector("svg").setAttribute("fill", "#ffffff")
        qContextMenu.insertBefore(repeatmsg, qContextMenu.firstChild);
    }

    // 识别二维码
    const qrcode = qrcode_ele.cloneNode(true);
    qrcode.addEventListener('click', async () => {
        const content = await decodeQR(message_element)
        Swal.fire({
            title: '识别结果',
            html: `<input id="swal-input1" class="swal2-input" value="${content}">`,
        });
        // 关闭右键菜单
        qContextMenu.remove()
    })
    if (classList?.[0] === "image-content") {
        if (qThemeValue == "light") {            
            qContextMenu.insertBefore(qrcode, qContextMenu.firstChild);
        } else {
            qrcode.querySelector("svg").setAttribute("fill", "#ffffff")
            qContextMenu.insertBefore(qrcode, qContextMenu.firstChild);
        }
    }
}

async function onLoad() {
    const script = document.createElement("script");
    script.id = "sweetalert2"
    script.defer = true;
    script.src = "https://cdn.jsdelivr.net/npm/sweetalert2@10";
    document.head.appendChild(script);
    const Interval = setInterval(() => {
        if (window.location.href.indexOf("#/main/message") == -1 && window.location.href.indexOf("#/chat/") == -1) return;
        if (!(LiteLoader?.plugins?.LLAPI?.manifest?.version >= "1.1.0")) {
            Swal.fire('LLAPI版本过低，请安装最新版', '该提示并非QQ官方提示，请不要发给官方群', 'warning');
        }
        clearInterval(Interval);
    }, 1000);
    LLAPI.add_qmenu(addrepeatmsg_menu)
    LLAPI.on("dom-up-messages", async (node) => {
        const setting_data = await qqpromote.getSettings()
        if (setting_data?.setting?.show_time) {
            const msgTime = node?.firstElementChild?.__VUE__?.[0]?.props?.msgRecord?.msgTime;
            const date = new Date(msgTime * 1000);
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const msg_content = node.querySelector(".msg-content-container")
            const time_div = document.createElement("div")
            time_div.style = `
            position:absolute;
            right:3px;
            bottom:0px;
            color: #c3e334;
            font-size: 70%;
            user-select: none;
            `
            time_div.textContent = `${hours}:${String(minutes).padStart(2, '0')}`
            msg_content.appendChild(time_div)
        }
        const msg_text = node.querySelector(".text-normal")
        if (msg_text) {
            function translate(event) {
                const text = event.target.textContent
                translate_hover = setInterval(async () => {
                    const SECRET_ID = setting_data.setting.translate_SECRET_ID
                    const SECRET_KEY = setting_data.setting.translate_SECRET_KEY
                    const translate_data = await qqpromote.translate(text, SECRET_ID, SECRET_KEY)
                    const timeEl = document.createElement("div");
                    timeEl.innerText = translate_data?.TargetText
                    event.target.closest(".message-content.mix-message__inner").appendChild(timeEl)
                    clearInterval(translate_hover);
                    msg_text.removeEventListener("mouseover", translate);
                }, 1000);
            }
            if (setting_data.setting.translate) {
                msg_text.addEventListener("mouseover", translate);
            } else {
                msg_text.removeEventListener("mouseover", translate);
            }
            
            msg_text.addEventListener("mouseout", (event) => {
                if (translate_hover) {
                    clearInterval(translate_hover);
                }
            });
            //msg_text.textContent+=" ".repeat(5)
        }
    })
}

async function onConfigView(view){
    const plugin_path = LiteLoader.plugins.qqpromote.path.plugin;
    const html_file_path = `llqqnt://local-file/${plugin_path}/src/config/view.html`;
    const css_file_path = `llqqnt://local-file/${plugin_path}/src/config/view.css`;
    const setting_data = await qqpromote.getSettings()
    // 插入设置页
    const htmlText = await (await fetch(html_file_path)).text()
    view.insertAdjacentHTML('afterbegin', htmlText)
    // 插入设置页样式
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = css_file_path
    document.head.appendChild(link)
    function setting_vue(node) {
        const htmlicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path d="M0 2.75C0 1.784.784 1 1.75 1h12.5c.966 0 1.75.784 1.75 1.75v1.5A1.75 1.75 0 0 1 14.25 6H1.75A1.75 1.75 0 0 1 0 4.25ZM1.75 7a.75.75 0 0 1 .75.75v5.5c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25v-5.5a.75.75 0 0 1 1.5 0v5.5A1.75 1.75 0 0 1 13.25 15H2.75A1.75 1.75 0 0 1 1 13.25v-5.5A.75.75 0 0 1 1.75 7Zm0-4.5a.25.25 0 0 0-.25.25v1.5c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25v-1.5a.25.25 0 0 0-.25-.25ZM6.25 8h3.5a.75.75 0 0 1 0 1.5h-3.5a.75.75 0 0 1 0-1.5Z"></path></svg>`
        node.querySelector(".q-icon.icon").insertAdjacentHTML('afterbegin', htmlicon)
        node.addEventListener("click", () => {
            if (!document.querySelector("#qqpromote")?.__vue_app__) {
                const app = createApp({
                    setup() {
                        const setting_obj = reactive(setting_data.setting)
                        watch(setting_obj, (newValue, oldValue) => {
                            setting_data.setting = newValue
                            setSettings(setting_data)
                        })
    
                        return setting_obj
                    }
                })
                app.mount('#qqpromote')
            }
        })
    }
    document.querySelectorAll(".nav-item.liteloader").forEach(node => {
        if (node.textContent === "QQ增强") {
            setting_vue(node)
        }
    })
}

function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL;
}

// thanks @xh321 https://github.com/xh321/LiteLoaderQQNT-QR-Decode
async function decodeQR(image) {
    // 调用草料二维码API
    return await fetch("https://qrdetector-api.cli.im/v1/detect_binary", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36 Edg/115.0.1901.183"
        },
        body: `image_data=${getBase64Image(image)}&remove_background=0`
    })
        .then((res) => res.json())
        .then((json) => {
            if (json.status == 1) {
                return json.data.qrcode_content;
            } else {
                throw json.message;
            }
        });
}

export {
    onLoad,
    onConfigView
}