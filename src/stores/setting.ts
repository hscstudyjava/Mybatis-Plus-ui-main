import { ref, computed, reactive, toRef, toRefs } from 'vue'
import { defineStore } from 'pinia'
import { DefaultSetting } from '@/utils/settings'
import type { SettingInterface } from '@/utils/settings'
import CacheUtils from '@/utils/cache/CacheUtils'
import { CacheConstants } from '@/utils/cache/CacheConstatns'


const settingStore: SettingInterface = CacheUtils.local.getJSON(
    CacheConstants.LOCAL_LAYOUT_CONFIIG_KEY
) || {}


/**
 * 使用配置状态管理实例
 */
export const useSettingStore = defineStore('settingStore', () => {
    /** 
     * 配置设置
     */
    var setting = reactive<SettingInterface>({
        title: settingStore.title === undefined ? DefaultSetting.title : settingStore.title,

        sideTheme: settingStore.sideTheme === undefined ? DefaultSetting.sideTheme : settingStore.sideTheme,

        themeColor: settingStore.themeColor === undefined ? DefaultSetting.themeColor : settingStore.themeColor,

        topNav: settingStore.topNav === undefined ? DefaultSetting.topNav : settingStore.topNav,

        tagsView: settingStore.tagsView === undefined ? DefaultSetting.tagsView : settingStore.tagsView,

        fixedHeader: settingStore.fixedHeader === undefined ? DefaultSetting.fixedHeader : settingStore.fixedHeader,

        sidebarLogo: settingStore.sidebarLogo === undefined ? DefaultSetting.sidebarLogo : settingStore.sidebarLogo,

        dynamicTitle: settingStore.dynamicTitle === undefined ? DefaultSetting.dynamicTitle : settingStore.dynamicTitle,

        // 不可修改配置
        showSettings: DefaultSetting.showSettings,

        errorLog: DefaultSetting.errorLog,

        watermark: settingStore.watermark===undefined? DefaultSetting.watermark:settingStore.watermark,

        watermarkContext: settingStore.watermarkContext===undefined? DefaultSetting.watermarkContext:settingStore.watermarkContext,

        isDark: settingStore.isDark === undefined ? DefaultSetting.isDark : settingStore.isDark
    })


    const setDynamicTitle = (dynamicTitle: boolean) => {
        const caches = getCache()
        caches.dynamicTitle = dynamicTitle
        setting = Object.assign({}, setting, caches)
        setCache();
    }

    const setSidebarLogo = (sidebarLogo: boolean) => {
        const caches = getCache()
        caches.sidebarLogo = sidebarLogo
        setting = Object.assign({}, setting, caches)
        setCache();
    }

   const setfixedHeader = (fixedHeader: boolean) => {
        const caches = getCache()
        caches.fixedHeader = fixedHeader
        setting = Object.assign({}, setting, caches)
        setCache();
    }
    
    const setWaterMark=(watermark:boolean)=>{
        const caches = getCache()
        caches.watermark = watermark
        setting = Object.assign({}, setting, caches)
        setCache();
    } 
    
    const setWatermarkContext=(watermarkContext:boolean)=>{
        const caches = getCache()
        caches.watermarkContext = watermarkContext
        setting = Object.assign({}, setting, caches)
        setCache();
    }

    const setTagsView=(tagsView:boolean)=>{
        const caches = getCache()
        caches.tagsView = tagsView
        setting = Object.assign({}, setting, caches)
        setCache();
    }

    const setTopNav=(topNav:boolean)=>{
        const caches = getCache()
        caches.topNav = topNav
        setting = Object.assign({}, setting, caches)
        setCache();
    }


    const setDark = (isDark: boolean) => {
        const caches = getCache()
        caches.isDark = isDark
        setting = Object.assign({}, setting, caches)
        if (setting.isDark) {
            document.documentElement.classList.add('dark')
            document.documentElement.classList.remove('light')
        } else {
            document.documentElement.classList.add('light')
            document.documentElement.classList.remove('dark')
        }
        setCache();
    }

    // 存储缓存
    const setCache = () => {
        CacheUtils.local.setJSON(CacheConstants.LOCAL_LAYOUT_CONFIIG_KEY, setting)
    }
    // 从缓存中拉取默认
    const getCache = () => {
        const cache = CacheUtils.local.getJSON(CacheConstants.LOCAL_LAYOUT_CONFIIG_KEY)
        if (cache) {
            return cache
        }
        // 没有cache从对象设置返回默认setting|头疼
        setCache();
        return setting;
    }



    /*  
         title,
         setTitle
    function setTitle(titles: string) {
         title.value = titles
     } */
    return {
        ...toRefs(setting),
        setDark,
        setDynamicTitle,
        setSidebarLogo,
        setfixedHeader,
        setWaterMark,
        setWatermarkContext,
        setTopNav,
        setTagsView
    
    }

})