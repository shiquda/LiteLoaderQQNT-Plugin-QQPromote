/*
 * @Date: 2024-01-19 16:45:50
 * @LastEditors: Night-stars-1 nujj1042633805@gmail.com
 * @LastEditTime: 2024-01-19 16:57:44
 */
import { setting_data } from "./utils.js"

let resetLogin = false;

function reLogin() {
    if (resetLogin) {
        const resetLoginInterval = setInterval(async () => {
            const account = await LLAPI.getAccountInfo()
            if (!account.uin) return;
            clearInterval(resetLoginInterval);
            LLAPI.resetLoginInfo(account.uin)
        }, 100);
    }
}

function userLogin() {
    if (location.pathname === "/renderer/login.html") {
        const loginView = document.querySelector(".draggable-view__container.login-container")
        const loginEle = document.createElement("label")
        loginEle.title = "忘记密码"
        loginEle.classList.add("q-checkbox")
        loginEle.innerHTML = `
        <input type="checkbox">
        <span class="q-checkbox__input">
        </span>
        `
        loginEle.style = `
            app-region: no-drag;
            padding-top: 6px;
            position: absolute;
            left: 8px;
            z-index: 99;
        `
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') reLogin();
        });
        document.querySelector(".login-btn")?.addEventListener("click", reLogin)
        loginEle.querySelector(".q-checkbox__input").addEventListener("click", async (event) => {
            const qCheckbox = event.target.parentElement
            resetLogin = !resetLogin
            qCheckbox.classList.toggle("is-checked", resetLogin)
        })
        loginView.insertBefore(loginEle, loginView.firstChild)
    }
    LLAPI.on("user-login", async (account) => {
        if (setting_data.setting.resetLogin) LLAPI.resetLoginInfo(account.uin)
    })
}

export {
    userLogin
}