// 路由权限
// @ts-ignore
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import router from './router'
import { getAccessToken, removeAccessToken } from './utils/cache/auth'
import { useUserStore } from '@/stores/user'
import { useSettingStore } from '@/stores/setting'
import { useDictStore } from '@/stores/dict'
NProgress.configure({ showSpinner: false }) // NProgress Configuration
import { useTitle } from '@vueuse/core'
import { usePeriStroe } from '@/stores/permission';
import type { RouteRecordRaw } from 'vue-router'

// 前提叙述:未避免1-2次接口无法拉取到跳转到error页面

// 1. 设置一个到setting中一个maxRetryCount次数
// 2. 当到相关接口因为网络无法拉取到数据RetryCount次数进行自增
// 3. 使用Computer函数计算是否超出最大次数 如果超出最大次数跳转到响应error页面让用户进行自测


const title = useTitle()

// 未登录
let whiteList = [
    "/login",
]

// 登录后白名单
let loginWhiteList = [
    "/login",
    "/error/network"
]

router.beforeEach(async (to, from, next) => {
    NProgress.start();// 开始

    /*************常用store************** */
    const useSetting = useSettingStore()

    title.value = dynamicTitle(useSetting.title, useSetting.dynamicTitle, to.meta.title as string)

    if (getAccessToken()) {
        // 登录状态去login跳转到/
        if (loginWhiteList.indexOf(to.path) !== -1) {
            switch (to.path) {
                case '/error/network':
                    next();
                    break;

                default:
                    next({ path: '/' })
                    break;
            }
            NProgress.done()
        } else {
            const userDict = useDictStore()
            const usePri = usePeriStroe()
            const userStore = useUserStore()
            // 拉取一下用户接口,建议返回到
            try {
                if (!userDict.getIsSet) {
                    await userDict.loadingDictMap()
                }

                if (!userStore.getIsUserSet) {

                    await userStore.getCurrentUser();// 拉取用户数据
                    await usePri.loadingRouter();// 拉取后端数据

                    usePri.routes.forEach(menu => {
                        router.addRoute(menu as unknown as RouteRecordRaw)
                    })
                    const redirectPath = from.query.redirect || to.path
                    const redirect = decodeURIComponent(redirectPath as string)
                    const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect }
                    next(nextData)
                } else {
                    next()
                }
            } catch (error) {
                // 处理异常，例如弹出提示框提醒用户
                console.error(error)
                // 跳转到异常页面,携带redirect当用户点击重试后跳转回去
                next(`/error/network?redirect=${to.path}&message=${error}`)
                NProgress.done()
            }
        }
    } else {
        /* has no token*/
        if (whiteList.indexOf(to.path) !== -1) {
            // in the free login whitelist, go directly
            next()
        } else {
            // other pages that do not have permission to access are redirected to the login page.
            next(`/login?redirect=${to.path}`)
            NProgress.done()
        }

    }

})






/**
 * 
 * @param routerTitle 路由标题
 * @param systemTitle 系统标题
 */
const dynamicTitle = (systemTitle: string, dynamicType: boolean, routerTitle?: any): string => {
    if (dynamicType) return `${systemTitle}-${routerTitle}`
    return systemTitle;
}

// 
router.afterEach(() => {
    // finish progress bar
    NProgress.done()
})