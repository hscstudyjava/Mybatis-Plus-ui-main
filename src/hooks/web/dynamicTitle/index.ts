import { useTitle } from '@vueuse/core'
import { useSettingStore } from '@/stores/setting'
import { storeToRefs } from 'pinia'


export const dynamicTitle = (routerTitle?: string) => {
    // 注册这个标题
    const titleUtil = useTitle()
    const useSetting = useSettingStore()
    // 使用
    const { dynamicTitle, title } = storeToRefs(useSetting)
    if (dynamicTitle.value) {
        // 如果说routerTitle为空去除-
        if (routerTitle) {
            titleUtil.value = `${title.value}-${routerTitle}`
            return
        } else {
            titleUtil.value = title.value;
            return
        }
    } else {
        titleUtil.value = title.value
        return
    }
}