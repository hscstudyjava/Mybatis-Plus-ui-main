// 路由权限
// @ts-ignore
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import router from './router'
import { getAccessToken, removeAccessToken, getRefreshToken } from './utils/cache/auth'
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
    title.value = dynamicTitle(to.meta.title as string)
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();

       // 如果访问 Token 已经无效使用刷新 Token 拉取一下访问 Token
    if (accessToken || refreshToken) {
        const userDict = useDictStore();
        const usePri = usePeriStroe();
        const userStore = useUserStore();

        // 刷新 Token
        if (!accessToken && refreshToken) {
            try {
                await userStore.refresh(refreshToken);
            } catch (error: any) {
                userStore.$clearCache();
            }
        }

        // 登录状态去 login 跳转到 /
        if (loginWhiteList.includes(to.path)) {
            switch (to.path) {
                case '/error/network':
                    next();
                    break;
                default:
                    next({ path: '/' });
                    break;
            }
        } else {
            try {
                if (!userDict.getIsSet) {
                    await userDict.loadingDictMap();
                }

                if (!userStore.getIsUserSet) {
                    await userStore.getCurrentUser(); // 拉取用户数据
                    await usePri.loadingRouter(); // 拉取后端数据

                    usePri.routes.forEach(menu => {
                        router.addRoute(menu as unknown as RouteRecordRaw);
                    });

                    const redirectPath = from.query.redirect || to.path;
                    const redirect = decodeURIComponent(redirectPath as string);
                    const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect };
                    next(nextData);
                } else {
                    next();
                }
            } catch (error) {
                console.error(error);
                next(`/error/network?redirect=${to.path}&message=${error}`);
            }
        }
    } else {
        // 访问 Token 无效如果是白名单自动跳转
        if (whiteList.includes(to.path)) {
            next();
        } else {
            next(`/login?redirect=${to.path}`);
        }
    }

    NProgress.done(); // 完成
});





/**
 * 
 * @param routerTitle 路由标题
 * @param systemTitle 系统标题
 */
const dynamicTitle = (routerTitle?: any): string => {
    const useSetting = useSettingStore()
    if (useSetting.dynamicTitle && routerTitle) return `${useSetting.title}-${routerTitle}`
    return useSetting.title
}

// 
router.afterEach(() => {
    // finish progress bar
    NProgress.done()
})