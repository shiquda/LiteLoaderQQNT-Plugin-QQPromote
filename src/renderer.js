/*
 * @Author: Night-stars-1 nujj1042633805@gmail.com
 * @Date: 2023-08-07 21:07:34
 * @LastEditors: Night-stars-1 nujj1042633805@gmail.com
 * @LastEditTime: 2023-08-10 18:22:17
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
const qtab_sticker = `
<div class="tabs-container-item" data-v-c829fb74="" id="custom_sticker"><i class="q-icon" title="我的收藏" is-bold="true" data-v-f2dd5ac7="" data-v-c829fb74="" style="--5fa79aa1: var(--icon_primary); --6ac3901c: 24px;"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="path-for-mask-18740" fill="white"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.67368 4.75872C5.90524 2.41376 9.52333 2.41376 11.7549 4.75872L12 5.01628L12.2451 4.75872C14.4767 2.41376 18.0948 2.41376 20.3263 4.75872C22.5579 7.10368 22.5579 10.9056 20.3263 13.2506L12.7244 21.2388C12.3303 21.653 11.6697 21.653 11.2756 21.2388L3.67368 13.2506C1.44211 10.9056 1.44211 7.10368 3.67368 4.75872Z"></path></mask><path d="M11.7549 4.75872L12.8415 3.72466L12.8415 3.72466L11.7549 4.75872ZM3.67368 4.75872L4.76028 5.79278L4.76028 5.79278L3.67368 4.75872ZM12 5.01628L10.9134 6.05034L12 7.19217L13.0866 6.05034L12 5.01628ZM12.2451 4.75872L13.3317 5.79278L13.3317 5.79278L12.2451 4.75872ZM20.3263 4.75872L21.4129 3.72466L21.4129 3.72466L20.3263 4.75872ZM20.3263 13.2506L21.4129 14.2846L21.4129 14.2846L20.3263 13.2506ZM3.67368 13.2506L4.76028 12.2165L4.76028 12.2165L3.67368 13.2506ZM11.2756 21.2388L10.189 22.2728L11.2756 21.2388ZM12.8415 3.72466C10.0187 0.758447 5.40984 0.758447 2.58707 3.72466L4.76028 5.79278C6.40064 4.06907 9.02793 4.06907 10.6683 5.79278L12.8415 3.72466ZM13.0866 3.98222L12.8415 3.72466L10.6683 5.79278L10.9134 6.05034L13.0866 3.98222ZM11.1585 3.72466L10.9134 3.98222L13.0866 6.05034L13.3317 5.79278L11.1585 3.72466ZM21.4129 3.72466C18.5902 0.758447 13.9813 0.758447 11.1585 3.72466L13.3317 5.79278C14.9721 4.06907 17.5994 4.06907 19.2397 5.79278L21.4129 3.72466ZM21.4129 14.2846C24.1957 11.3605 24.1957 6.64882 21.4129 3.72466L19.2397 5.79278C20.9201 7.55855 20.9201 10.4508 19.2397 12.2165L21.4129 14.2846ZM2.58707 3.72466C-0.195689 6.64882 -0.195689 11.3605 2.58707 14.2846L4.76028 12.2165C3.07991 10.4508 3.07991 7.55855 4.76028 5.79278L2.58707 3.72466ZM13.811 22.2728L21.4129 14.2846L19.2397 12.2165L11.6378 20.2047L13.811 22.2728ZM2.58707 14.2846L10.189 22.2728L12.3622 20.2047L4.76028 12.2165L2.58707 14.2846ZM11.6378 20.2047C11.8349 19.9976 12.1651 19.9976 12.3622 20.2047L10.189 22.2728C11.1743 23.3083 12.8257 23.3083 13.811 22.2728L11.6378 20.2047Z" fill="currentColor" mask="url(#path-for-mask-18740)"></path></svg></i></div>
`

function output(...args) {
    console.log("\x1b[32m[重读姬-渲染]\x1b[0m", ...args);
}

function addrepeatmsg_menu(event, target, msgIds) {
    const { classList } = target
    // ["text-normal", "ark-view-message", "image-content", "text-link", "message-content"].includes(classList[0])
    if (qContextMenu.innerText.includes("+1")) {
        //qContextMenu.style.setProperty('--q-contextmenu-max-height', 'calc(40vh - 16px)');
        const repeatmsg = qContextMenu.querySelector('#repeatmsg')
        repeatmsg.addEventListener('click', async () => {
            const peer = await window.LLAPI.getPeer()
            if (classList[0] == "ptt-element__progress") {
                const msg = await window.LLAPI.getPreviousMessages(peer, 1, msgIds.toString())
                const elements = msg[0].elements
                await window.LLAPI.sendMessage(peer, elements)
            } else {
                await window.LLAPI.forwardMessage(peer, peer, [msgIds])
            }
            // 关闭右键菜单
            qContextMenu.remove()
        })
    }
}

function abc(qContextMenu) {
    // 插入分隔线
    qContextMenu.insertAdjacentHTML('beforeend', separatorHTML)
    qContextMenu.insertAdjacentHTML('beforeend', repeatmsgHTML)
}

async function onLoad() {
    const script = document.createElement("script");
    script.id = "sweetalert2"
    script.defer = true;
    script.src = "https://cdn.jsdelivr.net/npm/sweetalert2@10";
    document.head.appendChild(script);
    const Interval = setInterval(() => {
        if (window.location.href.indexOf("#/main/message") == -1 && window.location.href.indexOf("#/chat/") == -1) return;
        if (!(LiteLoader?.plugins?.LLAPI?.manifest?.version >= "1.0.7")) {
            Swal.fire('LLAPI版本过低，请安装最新版', '该提示并非QQ官方提示，请不要发给官方群', 'warning');
        }
        clearInterval(Interval);
    }, 1000);
    window.LLAPI.add_qmenu(abc)
    window.LLAPI.on("context-msg-menu", addrepeatmsg_menu)
}


export {
    onLoad
}