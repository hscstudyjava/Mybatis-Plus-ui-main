import { ref, computed, reactive, toRef, toRefs } from 'vue'
import { defineStore } from 'pinia'
import { DefaultSetting } from '@/utils/settings'
import type { SettingInterface } from '@/utils/settings'
import CacheUtils from '@/utils/cache/CacheUtils'
import { CacheConstants } from '@/utils/cache/CacheConstatns'

const settingStore: SettingInterface = CacheUtils.local.getJSON(
    CacheConstants.LOCAL_LAYOUT_CONFIIG_KEY
)||''
/**
 * 使用配置状态管理实例
 */
export const useSettingStore = defineStore('settingStore', () => {
    /** 
     * 项目标题
     */
    var title = ref<string>("芒星管理系统")

    /** 
     * 配置设置
     */
    var setting = reactive<SettingInterface>({
        
        sideTheme: settingStore.sideTheme ===  undefined ? DefaultSetting.sideTheme : settingStore.sideTheme ,

        themeColor: settingStore.themeColor === undefined ? DefaultSetting.themeColor : settingStore.themeColor ,

        topNav: settingStore.topNav === undefined ? DefaultSetting.topNav : settingStore.topNav ,

        tagsView: settingStore.tagsView === undefined ? DefaultSetting.tagsView : settingStore.tagsView ,

        fixedHeader: settingStore.fixedHeader === undefined ? DefaultSetting.fixedHeader : settingStore.fixedHeader ,

        sidebarLogo: settingStore.sidebarLogo === undefined ? DefaultSetting.sidebarLogo : settingStore.sidebarLogo ,

        dynamicTitle:settingStore.dynamicTitle === undefined ? DefaultSetting.dynamicTitle : settingStore.dynamicTitle ,

        // 不可修改配置
        showSettings: DefaultSetting.showSettings,

        errorLog: DefaultSetting.errorLog,

        watermark: DefaultSetting.watermark,

        watermarkContext: DefaultSetting.watermarkContext,
    })

    function setTitle(titles: string) {
        title.value = titles
    }
    return {
        ...toRefs(setting),
        title,
        setTitle
    }

})