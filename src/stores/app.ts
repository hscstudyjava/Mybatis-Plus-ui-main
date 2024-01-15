import { getAdminServerConfig } from '@/api/system/config'
import { CacheConstants } from '@/utils/cache/CacheConstatns'
import CacheUtils, { useWsStore } from '@/utils/cache/CacheUtils'
import { DeviceEnum, ElmentSizeEnum } from '@/utils/constants/SystemConstants'
import { asyncComputed, computedAsync } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'

/** 
 * 侧边栏对象
 */
interface Sidebar {
    /**
     * 是否打开
     */
    open: boolean,
    /** 
     * 是否动画
     */
    withoutAnimation: boolean,
    /**
     * 是否隐藏
     */
    hide: boolean
}


// 服务器配置
interface FileConfig {

    fileInitKey: string

}

const ws = useWsStore('localStorage') //存储到Session中避免数据,个人设置60秒拉取数据



/**
 * app状态管理库
 */
export const useAppStore = defineStore('appStore', () => {

    /**
     * 设备
     */
    var device = ref<string>(DeviceEnum.PC)

    /**
     * 侧边栏对象
     */
    var sibebar = reactive<Sidebar>({
        open: CacheUtils.cookieCache.get("sibebar_open") ? !!CacheUtils.cookieCache.get('sibebar_open') : true,
        withoutAnimation: false,
        hide: false
    })

    /**
     * 切换侧边栏
     */
    const TOGGLE_SIBEBAR = (): void => {
        sibebar.open = !sibebar.open
        sibebar.withoutAnimation = false

        if (sibebar.open) {
            CacheUtils.cookieCache.set('sibebar_open', 1)
        } else {
            CacheUtils.cookieCache.set('sibebar_open', 0)
        }
    }

    /**
     * 关闭侧边栏
     * @param withoutAnimation 动画切换状态
     */
    const CLOSE_SIDEBAR = (withoutAnimation: boolean): void => {
        CacheUtils.cookieCache.set('sibebar_open', 0)
        sibebar.open = false
        sibebar.withoutAnimation = withoutAnimation
    }

    /**
     * 切换设备
     */
    const TOGGLE_DEVICE = (devices: string): void => {
        device.value = devices
    }

    /**
     * 设置隐藏状态
     * @param status 隐藏状态
     */
    const setSibebarHide = (status: boolean): void => {
        sibebar.hide = status
    }

    /**
     * 默认大小设置
     */
    const elementSize = CacheUtils.cookieCache.get(
        CacheConstants.ELEMETN_SIZE_KEY
    ) || ElmentSizeEnum.DEFAULT

    /**
     * 设置element大小
     * @param size 大小
     */
    const setElmemntSize = (size: string) => {
        elementSize.value = size,
            CacheUtils.cookieCache.set(
                CacheConstants.ELEMETN_SIZE_KEY,
                size
            )
    }


    /******************Server服务器拉取配置****************************** */
    const file = reactive<FileConfig>({
        fileInitKey: ''
    })

    const serverMap = ref<Map<string, any>>(new Map<string, any>)

    const getServerMapByCache = computed((): Map<string, any> => {
        const cacheMap = ws.get(CacheConstants.SERVER_SETTING)
        serverMap.value = new Map(Object.entries(cacheMap))
        // Object.assign(serverMap, new Map(Object.entries(cacheMap)))
        return serverMap.value;
    })

    const setFileConfig = () => {
        Object.assign(file, serverMap.value.get(CacheConstants.SERVER_SETTING_FILE));
    }

    const getFileConfig = computed(() => {
        return getServerMapByCache.value.get(CacheConstants.SERVER_SETTING_FILE)
    })

    const clearFileConfig = () => {
        Object.assign(file, {
            fileInitKey: ''
        });
    }

    // 拉取到数据是个Object但是后端map接收的所以使用Map转换一下即可
    async function getServerInitConfig(): Promise<Map<string, object>> {
        const cacheMap = ws.get(CacheConstants.SERVER_SETTING)
        if (cacheMap) {
            Object.assign(serverMap, new Map(Object.entries(cacheMap)))
            return cacheMap;
        }
        const { data } = await getAdminServerConfig()
        const maps = new Map(Object.entries(data))
        Object.assign(serverMap, maps)
        ws.set(CacheConstants.SERVER_SETTING, Object.fromEntries(maps), { exp: 3600 })
        setFileConfig()
        return maps;
    }


    return {
        device,
        sibebar,
        elementSize,
        // getter
        TOGGLE_SIBEBAR,
        CLOSE_SIDEBAR,
        TOGGLE_DEVICE,
        setElmemntSize,

        // file
        getFileConfig,
        clearFileConfig,
        getServerInitConfig
    }
})



