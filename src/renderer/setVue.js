/*
 * @Date: 2024-01-19 16:55:53
 * @LastEditors: Night-stars-1 nujj1042633805@gmail.com
 * @LastEditTime: 2024-01-30 23:14:37
 */
/*
 * @Date: 2024-01-19 16:55:53
 * @LastEditors: Night-stars-1 nujj1042633805@gmail.com
 * @LastEditTime: 2024-01-28 16:09:17
 */
// 导入工具函数
import { setSettings } from "./utils.js"
import { dropDownTab } from "../page/dropDownTab.js"
const { createApp, ref, reactive, watch } = await import('../cdnjs.cloudflare.com_ajax_libs_vue_3.3.4_vue.esm-browser.prod.min.js');

const openFolder = qqpromote.openFolder

async function setting_vue(node) {
    const setting_data = await qqpromote.getSettings()
    const htmlicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path d="M0 2.75C0 1.784.784 1 1.75 1h12.5c.966 0 1.75.784 1.75 1.75v1.5A1.75 1.75 0 0 1 14.25 6H1.75A1.75 1.75 0 0 1 0 4.25ZM1.75 7a.75.75 0 0 1 .75.75v5.5c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25v-5.5a.75.75 0 0 1 1.5 0v5.5A1.75 1.75 0 0 1 13.25 15H2.75A1.75 1.75 0 0 1 1 13.25v-5.5A.75.75 0 0 1 1.75 7Zm0-4.5a.25.25 0 0 0-.25.25v1.5c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25v-1.5a.25.25 0 0 0-.25-.25ZM6.25 8h3.5a.75.75 0 0 1 0 1.5h-3.5a.75.75 0 0 1 0-1.5Z"></path></svg>`
    node.querySelector(".q-icon.icon").insertAdjacentHTML('afterbegin', htmlicon)
    node.addEventListener("click", () => {
        if (!document.querySelector("#qqpromote")?.__vue_app__) {
            const app = createApp({
                methods: {
                    openEmoji(path) {
                        openFolder(path)
                    }
                },
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
        if (!document.querySelector("#sidebar")?.__vue_app__) {
            const app = createApp({
                setup() {
                    const sidebar_list = reactive(setting_data.setting.sidebar_list)
                    const sidebar_show = ref(false)
                    return {
                        sidebar_show, 
                        sidebar_list
                    }
                }
            })
            app.mount('#sidebar')
        }
        if (!document.querySelector("#messagebar")?.__vue_app__) {
            const app = createApp({
                setup() {
                    const messagebar_list = reactive(setting_data.setting.messagebar_list)
                    const messagebar = ref(false)
                    return {
                        messagebar, 
                        messagebar_list
                    }
                }
            })
            app.mount('#messagebar')
        }
        if (!document.querySelector("#upbar")?.__vue_app__) {
            const app = createApp({
                setup() {
                    const upbar_list = reactive(setting_data.setting.upbar_list)
                    const upbar = ref(false)
                    return {
                        upbar,
                        upbar_list
                    }
                }
            })
            app.mount('#upbar')
        }
        if (!document.querySelector("#video_background")?.__vue_app__) {
            const app = createApp({
                components: {
                    'my-dropdown-tab': dropDownTab
                },
                methods: {
                    handleOptionSelected(option) {
                        console.log(option)
                    }
                },
                setup() {
                    const video_background = reactive(setting_data.setting.video_background)
                    const video_background_data = reactive(setting_data.setting.video_background_data)
                    const video_background_bar = ref(false)
                    return {
                        video_background_bar,
                        video_background_data,
                        video_background
                    }
                }
            })
            app.mount('#video_background')
        }
        if (!document.querySelector("#facebar")?.__vue_app__) {
            const app = createApp({
                setup() {
                    const face_block = reactive(setting_data.setting.face_block)
                    const facebar = ref(false)
                    return {
                        facebar,
                        face_block
                    }
                }
            })
            app.mount('#facebar')
        }
        if (!document.querySelector("#qqpromote_version")?.__vue_app__) {
            const app = createApp({
                setup() {
                    return {
                        version: LiteLoader.plugins.qqpromote.manifest.version
                    }
                }
            })
            app.mount('#qqpromote_version');
        }
    })
}

export {
    setting_vue
}