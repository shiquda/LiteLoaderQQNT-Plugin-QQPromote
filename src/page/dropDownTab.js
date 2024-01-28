/*
 * @Date: 2024-01-28 15:37:49
 * @LastEditors: Night-stars-1 nujj1042633805@gmail.com
 * @LastEditTime: 2024-01-28 21:27:18
 */
const { defineComponent, ref } = await import('../cdnjs.cloudflare.com_ajax_libs_vue_3.3.4_vue.esm-browser.prod.min.js');

const plugin_path = LiteLoader.plugins.qqpromote.path.plugin;

const dropDownTab = defineComponent({
    template: await (await fetch(`local:///${plugin_path}/src/page/dropDownTab.html`)).text(),
    mounted() {
        // 在组件挂载时监听文档的点击事件
        document.addEventListener('click', this.closeDropdownOnOutsideClick);
    },
    beforeDestroy() {
        // 在组件销毁前移除文档的点击事件监听器，以防止内存泄漏
        document.removeEventListener('click', this.closeDropdownOnOutsideClick);
    },
    methods: {
        toggleDropdown() {
            this.isOpen = !this.isOpen;
            const rect = this.$refs.pulldown.getBoundingClientRect()
            this.top = rect.top + rect.height + 5
            this.left = rect.left
        },
        selectOption(option) {
            this.selectedOption = option;
            this.isOpen = false;
            // 触发选中事件，传递选中的选项
            this.$emit('option-selected', option);
        },
        closeDropdownOnOutsideClick(event) {
            if (!this.$refs.pulldown.contains(event.target) && this.isOpen) {
                this.isOpen = false;
            }
        },
    },
    setup() {
        // 使用 ref 创建响应式数据
        const options = ref(['Option 1', 'Option 2', 'Option 3']);

        return {
            top: 0,
            left: 0,
            isOpen: ref(false),
            options,
            selectedOption: options.value[0],
        };
    },
});

export {
    dropDownTab
}