import { FileTypeEnum } from "../constants/SystemConstants"

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path: string): boolean {
    return /^(https?:|mailto:|tel:)/.test(path)
}

export function isTelPhone(str: string): boolean {
    return /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str: string): boolean {
    const valid_map = ['admin', 'editor']
    return valid_map.indexOf(str.trim()) >= 0
}

/**
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url: string): boolean {
    const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
    return reg.test(url)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str: string): boolean {
    const reg = /^[a-z]+$/
    return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str: string): boolean {
    const reg = /^[A-Z]+$/
    return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str: string): boolean {
    const reg = /^[A-Za-z]+$/
    return reg.test(str)
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email: string): boolean {
    const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return reg.test(email)
}

const toString = Object.prototype.toString

export const is = (val: unknown, type: string) => {
    return toString.call(val) === `[object ${type}]`
}

export const isDef = <T = unknown>(val?: T): val is T => {
    return typeof val !== 'undefined'
}

export const isUnDef = <T = unknown>(val?: T): val is T => {
    return !isDef(val)
}

export const isObject = (val: any): val is Record<any, any> => {
    return val !== null && is(val, 'Object')
}

export const isEmpty = <T = unknown>(val: T): val is T => {
    if (val === null) {
        return true
    }
    if (isArray(val) || isString(val)) {
        return val.length === 0
    }

    if (val instanceof Map || val instanceof Set) {
        return val.size === 0
    }

    if (isObject(val)) {
        return Object.keys(val).length === 0
    }

    return false
}

export const isDate = (val: unknown): val is Date => {
    return is(val, 'Date')
}

export const isNull = (val: unknown): val is null => {
    return val === null
}

export const isNullAndUnDef = (val: unknown): val is null | undefined => {
    return isUnDef(val) && isNull(val)
}

export const isNullOrUnDef = (val: unknown): val is null | undefined => {
    return isUnDef(val) || isNull(val)
}

export const isNumber = (val: unknown): val is number => {
    return is(val, 'Number')
}

export const isPromise = <T = any>(val: unknown): val is Promise<T> => {
    return is(val, 'Promise') && isObject(val) && isFunction(val.then) && isFunction(val.catch)
}

export const isString = (val: unknown): val is string => {
    return is(val, 'String')
}

export const isFunction = (val: unknown): val is Function => {
    return typeof val === 'function'
}

export const isBoolean = (val: unknown): val is boolean => {
    return is(val, 'Boolean')
}

export const isRegExp = (val: unknown): val is RegExp => {
    return is(val, 'RegExp')
}

export const isArray = (val: any): val is Array<any> => {
    return val && Array.isArray(val)
}

export const isWindow = (val: any): val is Window => {
    return typeof window !== 'undefined' && is(val, 'Window')
}

export const isElement = (val: unknown): val is Element => {
    return isObject(val) && !!val.tagName
}

export const isMap = (val: unknown): val is Map<any, any> => {
    return is(val, 'Map')
}

export const isServer = typeof window === 'undefined'

export const isClient = !isServer

export const isUrl = (path: string): boolean => {
    const reg =
        /(((^https?:(?:\/\/)?)(?:[-:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&%@.\w_]*)#?(?:[\w]*))?)$/
    return reg.test(path)
}

export const isDark = (): boolean => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
}

// 是否是图片链接
export const isImgPath = (path: string): boolean => {
    return /(https?:\/\/|data:image\/).*?\.(png|jpg|jpeg|gif|svg|webp|ico)/gi.test(path)
}

export const isEmptyVal = (val: any): boolean => {
    return val === '' || val === null || val === undefined
}




/**
 * 
 * @param value 数据长度
 * @param type  类型
 * @returns 转换后长度
 */
export const toByte = (value: number, type: FileTypeEnum): number => {

    switch (type) {
        case FileTypeEnum.BYTE:
            return value;
        case FileTypeEnum.KB:
            return value * 1024;
        case FileTypeEnum.MB:
            return value * 1024 * 1024;
        case FileTypeEnum.GB:
            return value * 1024 * 1024 * 1024;
        default:
            throw new Error('Invalid file type');
    }
}

export const fromByte = (value: number, type: FileTypeEnum): number => {
    switch (type) {
        case FileTypeEnum.BYTE:
            return value;
        case FileTypeEnum.KB:
            return value / 1024;
        case FileTypeEnum.MB:
            return value / 1024 / 1024;
        case FileTypeEnum.GB:
            return value / 1024 / 1024 / 1024;
        default:
            throw new Error('Invalid file type');
    }
}




