/*
 * @Author: Night-stars-1 nujj1042633805@gmail.com
 * @Date: 2023-08-07 21:07:34
 * @LastEditors: Night-stars-1 nujj1042633805@gmail.com
 * @LastEditTime: 2023-08-13 18:08:05
 * @Description: 
 * 
 * Copyright (c) 2023 by Night-stars-1, All Rights Reserved. 
 */

const separatorHTML = `
<div class="q-context-menu-separator" role="separator"></div>
`
const repeatmsgLight = `
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
const repeatmsgDark = `
<a 
 id="repeatmsg"
 class="q-context-menu-item q-context-menu-item--normal" 
 aria-disabled="false" 
 role="menuitem" 
 tabindex="-1">
  <div class="q-context-menu-item__icon q-context-menu-item__head">
    <i class="q-icon" data-v-717ec976="" style="--b4589f60: inherit; --6ef2e80d: 16px;">
        <svg t="1691421273840" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1478" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><path d="M511.6 961.4c12.1 0 22.6-4.4 31.5-13.3s13.3-19.4 13.3-31.5V558.3h358.3c12.1 0 22.6-4.4 31.5-13.3s13.3-19.4 13.3-31.5c0-12.1-4.4-22.6-13.3-31.5s-19.4-13.3-31.5-13.3H556.4V110.3c0-12.1-4.4-22.6-13.3-31.5s-19.4-13.3-31.5-13.3c-12.1 0-22.6 4.4-31.5 13.3s-13.3 19.4-13.3 31.5v358.3H108.5c-12.1 0-22.6 4.4-31.5 13.3s-13.3 19.4-13.3 31.5c0 12.1 4.4 22.6 13.3 31.5s19.4 13.3 31.5 13.3h358.3v358.3c0 12.1 4.4 22.6 13.3 31.5s19.4 13.4 31.5 13.4z" p-id="1479" fill="#ffffff"></path></svg>
    </i>
  </div>
  <!---->
  <span class="q-context-menu-item__text">+1</span>
  <!---->
</a>
`

import { createApp, ref, reactive, watch } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'
let translate_hover
const setting_data = await qqpromote.getSettings()

function output(...args) {
    console.log("\x1b[32m[QQ增强-渲染]\x1b[0m", ...args);
}

async function setSettings(content) {
    await qqpromote.setSettings(JSON.stringify(content))
}

function addrepeatmsg_menu(event, target, msgIds) {
    const { classList } = target
    // ["text-normal", "ark-view-message", "image-content", "text-link", "message-content"].includes(classList[0])
    if (qContextMenu.innerText.includes("+1")) {
        //qContextMenu.style.setProperty('--q-contextmenu-max-height', 'calc(40vh - 16px)');
        const repeatmsg = qContextMenu.querySelector('#repeatmsg')
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
    }
}

async function abc(qContextMenu) {
    // 插入分隔线
    //qContextMenu.style.setProperty('--q-contextmenu-max-height', 'calc(40vh - 16px)');
    const qThemeValue = document.body.getAttribute('q-theme');
    const location = setting_data.setting.rpmsg_location? 'afterbegin' : 'beforeend'
    qContextMenu.insertAdjacentHTML(location, separatorHTML)
    if (qThemeValue == "light") {
        qContextMenu.insertAdjacentHTML(location, repeatmsgLight)
    } else {
        qContextMenu.insertAdjacentHTML(location, repeatmsgDark)
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
        if (!(LiteLoader?.plugins?.LLAPI?.manifest?.version >= "1.0.9")) {
            Swal.fire('LLAPI版本过低，请安装最新版', '该提示并非QQ官方提示，请不要发给官方群', 'warning');
        }
        clearInterval(Interval);
    }, 1000);
    LLAPI.add_qmenu(abc)
    LLAPI.on("context-msg-menu", addrepeatmsg_menu)
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

export {
    onLoad,
    onConfigView
}