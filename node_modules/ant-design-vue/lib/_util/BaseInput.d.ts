declare const BaseInput: import("vue").DefineComponent<{
    value: import("vue-types").VueTypeValidableDef<string> & {
        default: string;
    } & {
        default: string;
    };
}, {
    inputRef: import("vue").ShallowRef<any>;
    focus: () => void;
    blur: () => void;
    handleChange: (e: Event) => void;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("input" | "change")[], "input" | "change", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    value: import("vue-types").VueTypeValidableDef<string> & {
        default: string;
    } & {
        default: string;
    };
}>> & {
    onChange?: (...args: any[]) => any;
    onInput?: (...args: any[]) => any;
}, {
    value: string;
}, {}>;
export default BaseInput;
