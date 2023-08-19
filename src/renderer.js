/*
 * @Author: Night-stars-1 nujj1042633805@gmail.com
 * @Date: 2023-08-07 21:07:34
 * @LastEditors: Night-stars-1 nujj1042633805@gmail.com
 * @LastEditTime: 2023-08-16 18:06:46
 * @Description: 
 * 
 * Copyright (c) 2023 by Night-stars-1, All Rights Reserved. 
 */
const ogs = qqpromote.ogs
const get_imgbase64 = qqpromote.get_imgbase64
const chatgpt = qqpromote.chatgpt

// 自定义format用法
String.prototype.format = function(params) {
    return this.replace(/\{(\w+)\}/g, (match, key) => params[key] || match);
};
function check_only_img(children) {
    for (const child of children) {
        if (!child.classList.contains("image")) {
            return false
        }
    }
    return true
}

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
    <svg t="1691421273840" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1478" xmlns:xlink="http://www.w3.org/1999/xlink" height="1em"><path d="M511.6 961.4c12.1 0 22.6-4.4 31.5-13.3s13.3-19.4 13.3-31.5V558.3h358.3c12.1 0 22.6-4.4 31.5-13.3s13.3-19.4 13.3-31.5c0-12.1-4.4-22.6-13.3-31.5s-19.4-13.3-31.5-13.3H556.4V110.3c0-12.1-4.4-22.6-13.3-31.5s-19.4-13.3-31.5-13.3c-12.1 0-22.6 4.4-31.5 13.3s-13.3 19.4-13.3 31.5v358.3H108.5c-12.1 0-22.6 4.4-31.5 13.3s-13.3 19.4-13.3 31.5c0 12.1 4.4 22.6 13.3 31.5s19.4 13.3 31.5 13.3h358.3v358.3c0 12.1 4.4 22.6 13.3 31.5s19.4 13.4 31.5 13.4z" p-id="1479"></path></svg>
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

const chatgpt_ele = document.createElement("div");
chatgpt_ele.innerHTML = `
<a 
 id="chatgpt"
 class="q-context-menu-item q-context-menu-item--normal" 
 aria-disabled="false" 
 role="menuitem" 
 tabindex="-1">
  <div class="q-context-menu-item__icon q-context-menu-item__head">
    <i class="q-icon" data-v-717ec976="" style="--b4589f60: inherit; --6ef2e80d: 16px;">
    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M160 368c26.5 0 48 21.5 48 48v16l72.5-54.4c8.3-6.2 18.4-9.6 28.8-9.6H448c8.8 0 16-7.2 16-16V64c0-8.8-7.2-16-16-16H64c-8.8 0-16 7.2-16 16V352c0 8.8 7.2 16 16 16h96zm48 124l-.2 .2-5.1 3.8-17.1 12.8c-4.8 3.6-11.3 4.2-16.8 1.5s-8.8-8.2-8.8-14.3V474.7v-6.4V468v-4V416H112 64c-35.3 0-64-28.7-64-64V64C0 28.7 28.7 0 64 0H448c35.3 0 64 28.7 64 64V352c0 35.3-28.7 64-64 64H309.3L208 492z"/></svg>
    </i>
  </div>
  <!---->
  <span class="q-context-menu-item__text">CHATGPT</span>
  <!---->
</a>
`

const message_time = `
<span class="time tgico">
<span class="i18n" dir="auto">{time}</span>
<div class="inner tgico" title="{detail_time}">
  <span class="i18n" dir="auto">{time}</span>
</div>
</span>
`
const message_web = `
<div class="web">
  <div class="quote">
    <div class="quote-text">
      <div class="preview-resizer">
        <div class="preview media-container">
          <img class="media-photo" style="width: 100%;height: 100%;" src="{img}">
        </div>
      </div>
      <div class="title">
        <strong dir="auto">{title}</strong>
      </div>
      <div class="text" dir="auto">{text}</div>
    </div>
  </div>
</div>
`
// 插件本体的路径
const plugin_path = LiteLoader.plugins.qqpromote.path;

// 导入工具函数
const { createApp, ref, reactive, watch } = await import(`llqqnt://local-file/${plugin_path.plugin}/src/cdnjs.cloudflare.com_ajax_libs_vue_3.3.4_vue.esm-browser.prod.min.js`);
//import { createApp, ref, reactive, watch } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.3.4/vue.esm-browser.prod.min.js'
//import axios from 'https://cdnjs.cloudflare.com/ajax/libs/axios/1.4.0/esm/axios.js'

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
    const content = message_element?.innerText;
    const qThemeValue = document.body.getAttribute('q-theme');
    //qContextMenu.style.setProperty('--q-contextmenu-max-height', 'calc(40vh - 16px)');
    // +1
    if (!setting_data?.setting?.repeatmsg) {
        // 插入分隔线
        // qContextMenu.insertAdjacentHTML(location, separatorHTML)
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
            //LLAPI.add_message_list(peer, "151554515")
            // 关闭右键菜单
            qContextMenu.remove()
        })
        if (qThemeValue != "light") {
            repeatmsg.querySelector("svg").setAttribute("fill", "#ffffff")
        }
        if (setting_data.setting.rpmsg_location) {
            qContextMenu.insertBefore(repeatmsg, qContextMenu.firstChild);
        } else {
            qContextMenu.appendChild(repeatmsg);
        }
    }

    // chatgpt对话
    if (setting_data?.setting?.chatgpt) {
        const chatgpt_msg = chatgpt_ele.cloneNode(true);
        chatgpt_msg.addEventListener('click', async () => {
            const msg = await chatgpt(content, setting_data.setting.chatgpt_key)
            await LLAPI.set_message(msg)
            // 关闭右键菜单
            qContextMenu.remove()
        })
        if (qThemeValue != "light") {
            chatgpt_msg.querySelector("svg").setAttribute("fill", "#ffffff")
        }
        if (setting_data.setting.chatgpt_location) {
            qContextMenu.insertBefore(chatgpt_msg, qContextMenu.firstChild);
        } else {
            qContextMenu.appendChild(chatgpt_msg);
        }
    }

    // 识别二维码
    const qrcode = qrcode_ele.cloneNode(true);
    qrcode.addEventListener('click', async () => {
        const content = await decodeQR(message_element)
        Swal.fire({
            title: '识别结果',
            html: `<a href="http://i2.hdslb.com/bfs/archive/0b9b97ec1cbed58c3e9786ba5c6971c6691f5f06.jpg">${content}</a><input id="swal-input1" class="swal2-input" value="${content}">`,
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

async function get_link_data(url) {
    const patterns = {
        "https://www\\.bilibili\\.com/video/av(\\d+)": "https://api.bilibili.com/x/web-interface/view?aid={key}"
    };
    for (const pattern in patterns) {
        // 自定义链接消息获取
        const regex = new RegExp(pattern);
        const match = url.match(regex);
        if (match) {
            try {
                const key = match[1];
                const api_url = patterns[pattern].format({ key:key })
                const response = await fetch(api_url);
                const data = await response.json();
                const headers = {
                    'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) QQ/9.9.1-15717 Chrome/114.0.5735.243 Electron/25.3.1 Safari/537.36"
                }
                const imgbase64 = await get_imgbase64(data.data.pic, { headers, responseType: 'arraybuffer' });
                const url_data = {
                    result: {
                        ogTitle: data.data.title,
                        ogDescription: data.data.desc,
                        ogImage: [
                            {
                                url: imgbase64
                            }
                        ]
                    }
                };
                return url_data
            } catch (error) {
                return false
            }
        }
    }
    const url_data = await ogs(url)
    return url_data
}

async function onLoad() {
    const plugin_path = LiteLoader.plugins.qqpromote.path.plugin;
    const script = document.createElement("script");
    script.id = "sweetalert2"
    script.defer = true;
    script.src = "https://cdn.jsdelivr.net/npm/sweetalert2@10";
    document.head.appendChild(script);
    // CSS
    const css_file_path = `llqqnt://local-file/${plugin_path}/src/config/message.css`;
    const link_element = document.createElement("link");
    link_element.rel = "stylesheet";
    link_element.href = css_file_path;
    document.head.appendChild(link_element);
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
        // 翻译
        const msg_text = node.querySelector(".text-normal")
        if (msg_text) {
            function translate(event) {
                const text = event.target.textContent
                translate_hover = setInterval(async () => {
                    const translate_data = await qqpromote.translate(text, setting_data.setting)
                    const timeEl = document.createElement("div");
                    timeEl.innerText = translate_data?.TargetText
                    event.target.closest(".message-content.mix-message__inner").appendChild(timeEl);
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
        // 链接识别，并生成预览
        const msg_link = node.querySelector(".text-link")
        if (msg_link && setting_data?.setting?.link_preview) {
            const url = msg_link.innerText
            const url_data = await get_link_data(url)
            if (url_data) {
                const { result } = url_data; // 消息数据
                const msg_content = node.querySelector(".msg-content-container").firstElementChild
                msg_content.style.overflow = "visible";
                const web_ele1 = document.createElement("div");
                web_ele1.innerHTML = message_web.format({ url: url, img: result.ogImage?.[0]?.url, title: result.ogTitle, text: result.ogDescription})
                const web_ele = web_ele1.lastElementChild
                const img_ele = web_ele.querySelector(".media-photo")
                img_ele.onerror = function() {
                    img_ele.style.display = "none"
                };
                msg_content.appendChild(web_ele);
            }
        }
        // 消息时间
        if (setting_data?.setting?.show_time && node.querySelector(".msg-content-container")) {
            const msgTime = node?.firstElementChild?.__VUE__?.[0]?.props?.msgRecord?.msgTime;
            const msgId = node?.firstElementChild?.__VUE__?.[0]?.props?.msgRecord?.msgId;
            const date = new Date(msgTime * 1000);
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const timestamp = `${hours}:${String(minutes).padStart(2, '0')}`
            const msg_content = node.querySelector(".msg-content-container").firstElementChild
            //msg_content.style.overflow = "visible";
            const msg_time_ele1 = document.createElement("div");
            msg_time_ele1.innerHTML = message_time.format({ time: timestamp, detail_time: date.toLocaleString() })
            const msg_time_ele = msg_time_ele1.lastElementChild
            if (!check_only_img(msg_content.children)) {
                //msg_content.insertAdjacentHTML("beforeend", message_time.format({ time: timestamp, detail_time: date.toLocaleString() }));
                if (msg_content.children[0].classList.contains("ark-view-message") || msg_content.children[0].classList.contains("ark-loading")) {
                    const msg_content_ele = msg_time_ele.querySelector(".time .inner.tgico")
                    msg_content_ele.style.bottom = "15px"
                    msg_content_ele.style.right = "3px"
                }
            } else {
                msg_time_ele.style=`
                    position: absolute;
                    bottom: 5px;
                    right: 0px;
                    border-radius: 3.75rem;
                    background-color: rgb(0 0 0 / 35%);
                    padding: 0.1rem 0.3125rem;
                `
                //msg_content.insertAdjacentHTML("beforeend", message_time_img.format({ time: timestamp, detail_time: date.toLocaleString() }));
                const msg_content_ele = msg_time_ele.querySelector(".time .inner.tgico")
                //msg_content_ele.style.bottom = "auto"
                msg_content_ele.style.right = "-1px"
            }
            const time_inner_ele = msg_time_ele.querySelector(".time .inner")
            time_inner_ele.style.color = setting_data?.setting?.time_color
            msg_time_ele.addEventListener("click", async (event) => {
                if (setting_data?.setting?.repeatmsg) {
                    const peer = await LLAPI.getPeer()
                    await LLAPI.forwardMessage(peer, peer, [msgId])
                }
            })
            msg_content.appendChild(msg_time_ele);
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
                return json.message;
            }
        });
}

export {
    onLoad,
    onConfigView
}