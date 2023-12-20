import { loading } from './../utils/message/MessageUtils';
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { any, string } from 'vue-types'
import { useWsStore } from '@/utils/cache/CacheUtils'
import { CacheConstants } from '@/utils/cache/CacheConstatns';
import { groupSysDictValueList, selectSysDictValueList } from '@/api/system/dict/value';

const ws = useWsStore('sessionStorage')



/**
 * 字典数据对象
 */
export const useDictStore = defineStore('dict', () => {

    /**
     *存放dictMap中数据
     */
    var dictMap = reactive<Map<string, any>>(new Map<string, object>)

    /**
     * 是否设置数据
     */
    var isSetDict = ref(false)

    /**
     * 异步加载数据
     */
    const loadingDictMap = async () => {

        const cacheMap = ws.get(CacheConstants.DICT_KEY)

        if (cacheMap) {
            Object.assign(dictMap, cacheMap);// 存储数据
            isSetDict.value = true//标识赋值完成
        }

        // 否则异步记载数据库数据
        const { data } = await groupSysDictValueList()
        // 设置数据
        const dictDataMap = new Map<string, any>()
        data.forEach(item => {
                // 获得 dictType 层级
                const enumValueObj = dictDataMap[dictData.dictType]
                if (!enumValueObj) {
                    dictDataMap[dictData.dictType] = []
                }
                // 处理 dictValue 层级
                dictDataMap[dictData.dictType].push({
                    value: dictData.value,
                    label: dictData.label,
                    colorType: dictData.colorType,
                    cssClass: dictData.cssClass
            })


        }




})