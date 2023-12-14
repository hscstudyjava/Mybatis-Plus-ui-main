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

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str: String): boolean {
    if (typeof str === 'string' || str instanceof String) {
        return true
    }
    return false
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg: []): boolean {
    if (typeof Array.isArray === 'undefined') {
        return Object.prototype.toString.call(arg) === '[object Array]'
    }
    return Array.isArray(arg)
}


export function toByte(value: number, type: FileTypeEnum): number {
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

export function fromByte(value: number, type: FileTypeEnum): number {
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
