import { FileSizeTypeEnum } from "../constants/SystemConstants";

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
export const randomUtil = () => {
    return {
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
}

/**
 * 格式化工具类
 */
export const formatUtil = () => {

    /**
     * 
     * 18312343721
     * 183****3721
     * @param tel 手机号
     * @returns 格式化后数据 
     */
    const telFormat = (tel: string): string => {
        return tel.substring(0, 3) + "****" + tel.substring(7);
    }


    /**
     * 驼峰命名转换成短横线命名
     * 
     * trainId
     * train_id
     * 
     * @param str  trianId 驼峰
     * @returns  短横线
     */
    const getKebabCase = (str: string): string => {
        return str.replace(/[A-Z]/g, (item) => '-' + item.toLowerCase())
    }

    /**
     * 短横线命名转换成驼峰命名
     * train_id 
     * trianId
     * 
     * @param str train_id
     * @returns  trainId
     */
    const getCamelCase = (str: string): string => {
        return str.replace(/-([a-z])/g, (i, item) => item.toUpperCase())
    }

    return {
        telFormat,
        getKebabCase,
        getCamelCase
    }
}




/**
 * 2024年1月12日15:58:44
 * @author hsc
 */
export const fileUtil = () => {
    const FILE_TYPE = '.'

    /**
     * 获取文件类型
     *
     * 例如: ruoyi.txt, 返回: txt
     *
     * @param file 文件名或文件对象
     * @return 后缀（不含".")
     */
    const getFileType = (file: File | string | null): string => {
        if (!file) {
            return '';
        }
        const fileName = typeof file === 'string' ? file : file.name;
        const separatorIndex = fileName.lastIndexOf('.');
        return separatorIndex < 0 ? '' : fileName.substring(separatorIndex + 1).toLowerCase();
    }

    /**
     * 获取文件类型
     *
     * @param photoByte 文件字节码
     * @return 后缀（不含".")
     */
    const getFileExtendName = (photoByte: Uint8Array): string => {
        let strFileExtendName = 'JPG';
        if (
            photoByte[0] === 71 &&
            photoByte[1] === 73 &&
            photoByte[2] === 70 &&
            photoByte[3] === 56 &&
            (photoByte[4] === 55 || photoByte[4] === 57) &&
            photoByte[5] === 97
        ) {
            strFileExtendName = 'GIF';
        } else if (
            photoByte[6] === 74 &&
            photoByte[7] === 70 &&
            photoByte[8] === 73 &&
            photoByte[9] === 70
        ) {
            strFileExtendName = 'JPG';
        } else if (photoByte[0] === 66 && photoByte[1] === 77) {
            strFileExtendName = 'BMP';
        } else if (photoByte[1] === 80 && photoByte[2] === 78 && photoByte[3] === 71) {
            strFileExtendName = 'PNG';
        }
        return strFileExtendName;
    }

    /**
      * 判断是否是允许的名单类型
      * @param fileType
      * .txt || txt
      *
      * @param ignoreList
      *
      * [.txt,txt]
      *
      * @return true 允许 false 不允许
      */
    const ignoreFileType = (fileType: string, ignoreList: string[]): boolean => {
        const type = checkContains(fileType, FILE_TYPE) ? fileType : FILE_TYPE + fileType;
        return ignoreList.some((it) => {
            const item = checkContains(it, FILE_TYPE) ? it : FILE_TYPE + it;
            return item === type;
        });
    }
    /**
     * 判断是否是允许的名单类型
     * @param fileType
     *  a.txt
     *
     * @param ignoreList
     *
     * [.txt,txt]
     *
     * @return true 允许 false 不允许
     */
    const ignoreFileName = (fileName: string, ignoreList: string[]): boolean => {
        const fileType = getFileType(fileName);
        return ignoreFileType(fileType, ignoreList);
    }

    const checkContains = (str: string, target: string): boolean => {
        return str.trim().includes(target.trim());
    }

    /**
     * 字节向上转换
     * 默认设置Mb
     */
    const byteUpShift = (bytes: number, type?: FileSizeTypeEnum) => {
        var data = 0;// 默认设置0
        if (type) {
            data = fromByte(bytes, type)
        }
        else {
            type = byteType(bytes)
            data = fromByte(bytes, type)
        }
        return data + type
    }


    /**
     * 
     * @param value 数据长度
     * @param type  类型
     * @returns 转换后长度
     */
    const toByte = (value: number, type: FileSizeTypeEnum): number => {

        switch (type) {
            case FileSizeTypeEnum.BYTE:
                return value;
            case FileSizeTypeEnum.KB:
                return value * 1024;
            case FileSizeTypeEnum.MB:
                return value * 1024 * 1024;
            case FileSizeTypeEnum.GB:
                return value * 1024 * 1024 * 1024;
            default:
                throw new Error('Invalid file type');
        }
    }

    const fromByte = (value: number, type: FileSizeTypeEnum): number => {
        switch (type) {
            case FileSizeTypeEnum.BYTE:
                return value;
            case FileSizeTypeEnum.KB:
                return value / 1024;
            case FileSizeTypeEnum.MB:
                return value / 1024 / 1024;
            case FileSizeTypeEnum.GB:
                return value / 1024 / 1024 / 1024;
            default:
                throw new Error('Invalid file type');
        }
    }

    const byteType = (value: number): FileSizeTypeEnum => {
        if (value < 1024) {
            return FileSizeTypeEnum.BYTE;
        } else if (value < 1024 * 1024) {
            return FileSizeTypeEnum.KB;
        } else if (value < 1024 * 1024 * 1024) {
            return FileSizeTypeEnum.MB;
        } else {
            return FileSizeTypeEnum.GB;
        }
    }

    return {
        ChannelMergerNode,
        getFileType,
        getFileExtendName,
        ignoreFileType,
        ignoreFileName,
        checkContains,
        byteUpShift,
        byteType,
        fromByte,
        toByte
    }
}
