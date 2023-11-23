/** 
 * @author hsc
 * 
 * 消息提示配置项目
 */
import type { messageDefaults } from "element-plus"


/**
 * look->elemnt-plus
 * 
 * message.d.ts
 */
export enum MessageType{
    // "success" | "warning" | "error" | "info"
    SUCCESS="success",

    WARNING="warning",

    ERROR="error",

    INFO="info"
}

export interface MessageOptions {
    customClass: String;

    center: boolean;

    dangerouslyUseHTMLString: boolean;

    duration: number;

    icon: string,

    id: string;

    message: string;

    onClose?:Function;

    showClose: false;

    type: MessageType;

    offset: number;

    zIndex: number;

    grouping: boolean;

    repeatNum: number;

    appendTo?: HTMLElement;
}

