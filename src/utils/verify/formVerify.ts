/** 
 * @author hsc
 * 
 * 常用validator方法
 */

import { isTelPhone, validEmail } from "."

/*****校验参数 */
export const validateTelPhone = (rule: any, value: any, callback: any) => {
    if (value === '') callback(new Error("请您必须填写手机号"))
    else {
        if (!isTelPhone(value)) callback(`抱歉 您输入的${value}手机号不正确`)
        callback()
    }
}

export const validateEmail = (rule: any, value: any, callback: any) => {
    if (value === '') callback("请您必须填写邮箱")
    else {
        if (!validEmail(value)) callback(`抱歉 您输入的${value}邮箱不正确`)
        callback()
    }
}