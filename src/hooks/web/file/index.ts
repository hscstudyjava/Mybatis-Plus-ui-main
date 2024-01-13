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


        if (typeof files === 'string') {
            // 判断是否有,
            if (!files.includes(default_split)) {
                if (!isHttp(files)) {
                    return [PD_BASE_URL + files];
                } else {
                    return [files]
                }
            } else {
                return files.split(default_split)
                    .map(item => {
                        if (!isHttp(item)) {
                            return [PD_BASE_URL + item];
                        } else {
                            return [item]
                        }
                    }).flat()
            }
        } else {
            return files.map(item => {
                if (!isHttp(item)) {
                    return [PD_BASE_URL + item];
                } else {
                    return [item]
                }
            }).flat()
        }
    }




    return {
        convertFileList
    }

}




