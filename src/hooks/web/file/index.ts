import type { UploadFileResult } from '@/api/files/type';
import { useAppStore } from '@/stores/app';
import { fileUtil } from '@/utils/common';
import { SystemEnum } from '@/utils/constants/SystemConstants';
import { isExternal, isArray } from '@/utils/verify';
import { asyncComputed } from '@vueuse/core';
import { computed } from 'vue';
const PD_FILE_URL = "/file/pd/"

/** 
 * 判断是否携带了Http,如果没有携带表示有server代理的文件
 * 如果携带了Http无需在处理相关的数据
 */
export const userFile = () => {
    const default_split = SystemEnum.DEFAULT_SPLIT_SYMBOL
    const app = useAppStore()
    const PD_BASE_URL = import.meta.env.VITE_APP_BASE_URL + PD_FILE_URL;
    const fileConfig = app.getFileConfig
    const { removeDuplicateSlashes, concatTrimStartSlashes, getFileType, getFileName } = fileUtil()

    /**
     * 
     * @param url 
     * /file/a.txt
     * http://localhost:1010/file/pd/local/file/a.txt
     * 
     * @returns 
     */
    const isHttp = (url: string): boolean => {
        return isExternal(url)
    }


    /**
     * 
     * @param files ['/file/a.txt','http:local/file/a.txt']
     * @returns ['http:local/file/a.txt','http:local/file/a.txt']
     */
    const convertFileList = (files: string | string[]): string[] => {
        // 如果是字符串类型的文件列表
        if (typeof files === 'string') {
            // 判断是否包含逗号分隔符
            if (!files.includes(default_split)) {
                // 如果不包含逗号分隔符，直接返回 URL 数组
                if (!isHttp(files)) {
                    return [concatTrimStartSlashes(PD_BASE_URL, files)];
                } else {
                    return [files]
                }
            } else {
                // 如果包含逗号分隔符，先进行分割，再返回 URL 数组
                return files.split(default_split)
                    .map(item => {
                        if (!isHttp(item)) {
                            return [concatTrimStartSlashes(PD_BASE_URL + item)];
                        } else {
                            return [concatTrimStartSlashes(item)]
                        }
                    }).flat()
            }
        } else if (typeof files === 'object') {
            return files.map(item => {
                if (!isHttp(item)) {
                    return [concatTrimStartSlashes(PD_BASE_URL + item)];
                } else {
                    return [concatTrimStartSlashes(item)]
                }
            }).flat()
        } else {
            return []
        }
    }

    /** 
     * 将path转换成为对象
     */
    const path2Result = (url: string): UploadFileResult => {
        /** 
         * 将Path转换成为UploadFileResult
         */
        const fileSuffix = getFileType(url);
        // const fileName=
        const fileName = getFileName(url);
        return {
            name: fileName,
            fileSuffix: fileSuffix,
            url: url,
            path: url,
        }
    }




    return {
        convertFileList,
        path2Result
    }

}




