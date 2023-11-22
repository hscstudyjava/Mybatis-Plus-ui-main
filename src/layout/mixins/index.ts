import router from '@/router';
import { useAppStore } from '@/stores/app';
import { DeviceEnum } from '@/utils/constants/SystemConstants';
import { watch, onMounted, onBeforeMount, onBeforeUnmount } from 'vue'

const { body } = document//body
const WIDTH = 992 //宽
const hadlerResize = () => {
    const appStore = useAppStore();//用户状态管理

    /** 
     * 监听路由变化
     */
    watch(() => router.currentRoute.value,
        (newVlaue: any) => {
            if (appStore.device === DeviceEnum.MOBILE && appStore.sibebar.open) {
                appStore.CLOSE_SIDEBAR(true)
            }
        },
        { immediate: true }
    )

    /** 
     * 初始化前操作
     */
    onBeforeMount(() => {
        // console.log("初始化!~~~");

        window.addEventListener('resize', _resizeHandler)
    })

    /** 
     * 销毁前操作
     */
    onBeforeUnmount(() => {
        window.removeEventListener('resize', _resizeHandler)
    })
    /** 
     * 安装
     */
    onMounted(() => {
        let isMobile = _isMobile();
        if (isMobile) {
            appStore.TOGGLE_DEVICE(DeviceEnum.MOBILE)
            appStore.CLOSE_SIDEBAR(true)
        }
    })
    /**
     * 是否为手机模式
     */
    const _isMobile = (): boolean => {
        const rect = body.getBoundingClientRect()
        return rect.width - 1 < WIDTH
    }
    /**
     * 重置
     */
    const _resizeHandler = (): void => {
        if (!document.hidden) {
            const isMobile = _isMobile()

            appStore.TOGGLE_DEVICE(
                isMobile ? DeviceEnum.MOBILE : DeviceEnum.PC
            )
            if (isMobile) {
                appStore.CLOSE_SIDEBAR(true)
            }
        }
    }
}

export default hadlerResize