import { loading } from './../utils/message/MessageUtils';
import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'
import { any, string } from 'vue-types'
import { useWsStore } from '@/utils/cache/CacheUtils'
import { CacheConstants } from '@/utils/cache/CacheConstatns';
import { groupSysDictValueList, selectSysDictValueList } from '@/api/system/dict/value';
import type { SysDictSimpleResult } from '@/api/system/type';

const ws = useWsStore('sessionStorage')



/**
 * 字典数据对象
 */
export const useDictStore = defineStore('dict', () => {

    /**
     *存放dictMap中数据
     */
    var dictMap = reactive<Map<string, Array<SysDictSimpleResult>>>(new Map<string, Array<SysDictSimpleResult>>)

    /**
     * 是否设置数据
     */
    var isSetDict = ref(false)

    const getDictMap = computed(() => {
        // 缓存获得
        const cacheMap = ws.get(CacheConstants.DICT_KEY)
        if (cacheMap) {
            // 重新复制
            dictMap = new Map(Object.entries(cacheMap));
        }
        return cacheMap;
    })

    const getIsSet = computed(() => {
        return isSetDict.value
    })

    /**
     * 异步加载数据
     */
    const loadingDictMap = async () => {
        const cacheMap = ws.get(CacheConstants.DICT_KEY)

        if (cacheMap) {
            dictMap = new Map(Object.entries(cacheMap));
            isSetDict.value = true//标识赋值完成
            return;
        }

        // 否则异步记载数据库数据
        const { data } = await groupSysDictValueList()
        // 设置数据
        const dictDataMap = new Map<string, Array<SysDictSimpleResult>>()

        data.forEach(item => {
            // 获得 dictType 层级
            const enumValueObj = dictDataMap.get(item.key)
            if (!enumValueObj) {
                dictDataMap.set(item.key, [])
            }
            // 处理 dictValue 层级
            item.list.forEach(value => {
                dictDataMap.get(item.key)?.push(value)
            })
        })

        dictDataMap.forEach((values, key) => {
            dictMap.set(key, values);
        });

        isSetDict.value = true//标识赋值完成        
        ws.set(CacheConstants.DICT_KEY, Object.fromEntries(dictDataMap), { exp: 60 })
    }

    /** 
     * 重置
     */
    const resertDictMap = async () => {
        ws.delete(CacheConstants.DICT_KEY)
        // 否则异步记载数据库数据
        const { data } = await groupSysDictValueList()
        // 设置数据
        const dictDataMap = new Map<string, Array<SysDictSimpleResult>>()

        data.forEach(item => {

            // 获得 dictType 层级
            const enumValueObj = dictDataMap.get(item.key)
            if (!enumValueObj) {
                dictDataMap.set(item.key, [])
            }
            // 处理 dictValue 层级
            item.list.forEach(value => {
                dictDataMap.get(item.key)?.push(value)
            })
        })

        dictDataMap.forEach((values, key) => {
            dictMap.set(key, values);
        });
        isSetDict.value = true//标识赋值完成

        ws.set(CacheConstants.DICT_KEY, Object.fromEntries(dictDataMap), { exp: 60 })
    }

    /**
     * 从dictMap中拿数据
     */
    const getDictByType = (type: string) => {
        if (!getIsSet) {
            resertDictMap()//刷新DictMap并且存放到seesion中
        }

        return dictMap.get(type)
    }

    return {

        loadingDictMap,
        resertDictMap,
        getDictByType,
        // 暴漏出计算函数
        getIsSet,
        getDictMap
    }




})