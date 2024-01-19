import { setting_data, setSettings } from "./utils.js"

function setMessage() {
    document.querySelectorAll(".bar-icon .q-tooltips").forEach(
        (node)=> {
            const content = node?.__VUE__?.[0]?.props?.content
            if (content && !(content in setting_data.setting.messagebar_list)) {
                setting_data.setting.messagebar_list[content] = false
                setSettings(setting_data)
            }
            if (setting_data.setting.messagebar_list[content]){
                node.parentNode.remove()
            }
        }
    )
}

export {
    setMessage
}
