/*
 * @Date: 2024-01-19 16:44:32
 * @LastEditors: Night-stars-1 nujj1042633805@gmail.com
 * @LastEditTime: 2024-01-19 17:04:27
 */
import { setting_data, setSettings } from "./utils.js"

function changeHref(location) {
    if (location.hash == "#/main/message") {
        document.querySelectorAll(".sidebar__menu .func-menu__item").forEach(
            (node)=> {
                const aria_label = node.firstChild.getAttribute("aria-label")
                if (aria_label && !(aria_label in setting_data.setting.sidebar_list)) {
                    setting_data.setting.sidebar_list[aria_label] = false
                    setSettings(setting_data)
                }
                if (setting_data.setting.sidebar_list[aria_label]){
                    node.remove()
                }
            }
        )
        document.querySelectorAll(".nav-item").forEach(
            (node)=> {
                const aria_label = node.getAttribute("aria-label")
                if (aria_label && !(aria_label in setting_data.setting.sidebar_list)) {
                    setting_data.setting.sidebar_list[aria_label] = false
                    //setSettings(setting_data)
                }
                if (setting_data.setting.sidebar_list[aria_label]){
                    node.remove()
                }
            }
        )
    }
}

export {
    changeHref
}
