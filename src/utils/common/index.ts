/**
 * 参数处理
 * @param {*} params  参数
 */
export const tansParams = (params: any) => {
    let result = ''
    for (const propName of Object.keys(params)) {
        const value = params[propName];
        var part = encodeURIComponent(propName) + "=";
        if (value !== null && value !== "" && typeof (value) !== "undefined") {
            if (typeof value === 'object') {
                for (const key of Object.keys(value)) {
                    if (value[key] !== null && value[key] !== "" && typeof (value[key]) !== 'undefined') {
                        let params = propName + '[' + key + ']';
                        var subPart = encodeURIComponent(params) + "=";
                        result += subPart + encodeURIComponent(value[key]) + "&";
                    }
                }
            } else {
                result += part + encodeURIComponent(value) + "&";
            }
        }
    }
    return result
}
/**
 * 判断是否为Blob
 */
export const validateBlob = async (data: any) => {
    try {
        const text = await data.text();
        JSON.parse(text);
        return false;
    } catch (error) {
        return true;
    }
}

// 日期格式化
export function parseTime(time: number | string | Date | object, pattern?: number | string | any) {
    if (arguments.length === 0 || !time) {
        return null
    }
    const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
    let date: Date
    if (typeof time === 'object') {
        // @ts-ignore
        date = time
    } else {
        if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
            time = parseInt(time)
        } else if (typeof time === 'string') {
            time = time.replace(new RegExp(/-/gm), '/').replace('T', ' ').replace(new RegExp(/\.[\d]{3}/gm), '');
        }
        if ((typeof time === 'number') && (time.toString().length === 10)) {
            time = time * 1000
        }
        date = new Date(time)
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    }
    // @ts-ignore
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        // @ts-ignore
        let value = formatObj[key]
        // Note: getDay() returns 0 on Sunday
        if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
        if (result.length > 0 && value < 10) {
            value = '0' + value
        }
        return value || 0
    })
    return time_str
}



/**
 * 随机工具类
 */
export const randomUtil = {

    // 生成随机数
    randomNum(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min },

    // 随机字符串
    randomStr(len: number): string {
        const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz123456789';
        const strLen = chars.length;
        let randomStr = '';
        for (let i = 0; i < len; i++) {
            randomStr += chars.charAt(Math.floor(Math.random() * strLen));
        }
        return randomStr;
    }

}

/**
 * 格式化工具类
 */
export const formatUtil = {

    /**
     * 
     * 18312343721
     * 183****3721
     * @param tel 手机号
     * @returns 格式化后数据 
     */
    telFormat(tel: string): string {
        return tel.substring(0, 3) + "****" + tel.substring(7);
    },


    /**
     * 驼峰命名转换成短横线命名
     * 
     * trainId
     * train_id
     * 
     * @param str  trianId 驼峰
     * @returns  短横线
     */
    getKebabCase(str: string): string {
        return str.replace(/[A-Z]/g, (item) => '-' + item.toLowerCase())
    },

    /**
     * 短横线命名转换成驼峰命名
     * train_id 
     * trianId
     * 
     * @param str train_id
     * @returns  trainId
     */
    getCamelCase(str: string): string {
        return str.replace(/-([a-z])/g, (i, item) => item.toUpperCase())
    }

}
