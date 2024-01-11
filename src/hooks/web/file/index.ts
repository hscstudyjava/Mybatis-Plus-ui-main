import { useAppStore } from '@/stores/app';
import { isExternal, isArray } from '@/utils/verify';
import { computed } from 'vue';

const PD_FILE_URL = "/file/pd/"



/** 
 * 判断是否携带了Http,如果没有携带表示有server代理的文件
 * 如果携带了Http无需在处理相关的数据
 */
export const userFile = () => {
    const app = useAppStore()


    const pathUrl = ()=>{
        return "1"
    }

    return {
        pathUrl
    }
}




