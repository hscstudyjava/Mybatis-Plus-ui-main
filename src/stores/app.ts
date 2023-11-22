import { ref, computed, reactive, toRef, toRefs } from 'vue'
import { defineStore } from 'pinia'
import { DeviceEnum, ElmentSizeEnum } from '@/utils/constants/SystemConstants'
import CacheUtils from '@/utils/cache/CacheUtils'
import { CacheConstants } from '@/utils/cache/CacheConstatns'

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
    const setSibebarHide=(status:boolean):void=>{
        sibebar.hide=status
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

    return {
        device,
        sibebar,
        elementSize,
        // getter
        TOGGLE_SIBEBAR,
        CLOSE_SIDEBAR,
        TOGGLE_DEVICE,
        setElmemntSize
    }
})



