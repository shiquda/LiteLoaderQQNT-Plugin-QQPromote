/*
 * @Author: Night-stars-1 nujj1042633805@gmail.com
 * @Date: 2023-08-07 21:07:34
 * @LastEditors: Night-stars-1 nujj1042633805@gmail.com
 * @LastEditTime: 2023-08-08 18:09:17
 * @Description: 
 * 
 * Copyright (c) 2023 by Night-stars-1, All Rights Reserved. 
 */

const separatorHTML = `
<div class="q-context-menu-separator" role="separator"></div>
`
const repeatmsgHTML = `
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

function output(...args) {
    console.log("\x1b[32m[重读姬-渲染]\x1b[0m", ...args);
}

function addrepeatmsg_menu(event, target, msgIds) {
    // ["text-normal", "ark-view-message", "image-content", "text-link", "message-content"].includes(classList[0])
    if (!qContextMenu.innerText.includes("+1")) {
        qContextMenu.style.setProperty('--q-contextmenu-max-height', 'calc(40vh - 16px)');
        // 插入分隔线
        qContextMenu.insertAdjacentHTML('beforeend', separatorHTML)
        qContextMenu.insertAdjacentHTML('beforeend', repeatmsgHTML)
        const repeatmsg = qContextMenu.querySelector('#repeatmsg')
        repeatmsg.addEventListener('click', async () => {
            const peer = await window.LLAPI.getPeer()
            await window.LLAPI.forwardMessage(peer, peer, [msgIds])
            // 关闭右键菜单
            qContextMenu.remove()
        })
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
        if (!(LiteLoader?.plugins?.LLAPI?.manifest?.version >= "1.0.3")) {
            Swal.fire('LLAPI版本过低，请安装最新版', '该提示并非QQ官方提示，请不要发给官方群', 'warning');
        }
        clearInterval(Interval);
    }, 1000);
    window.LLAPI.on("context-msg-menu", addrepeatmsg_menu)
}


export {
    onLoad
}