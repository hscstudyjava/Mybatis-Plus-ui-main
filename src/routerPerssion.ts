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
import { el } from 'element-plus/es/locales.mjs'


const title = useTitle()
let whiteList = [
    "/login"
]



// 路由权限
// router.beforeEach((to, from, next) => {
//     const userStore = useUserStore()
//     const useSetting = useSettingStore()
//     const userDict = useDictStore()
//     const usePri = usePeriStroe()

//     title.value = dynamicTitle(useSetting.title, useSetting.dynamicTitle, to.meta.title as string)

//     if (!userDict.getIsSet) {
//         // 拉取dict数据
//         userDict.loadingDictMap()
//     }
//     NProgress.start();

//     const accessToken = getAccessToken();//访问Token

//     // 访问Token不等于空
//     if (accessToken != null) {
//         if (to.path === '/login') {
//             next({ path: '/' })
//             NProgress.done()
//         } else {
//             userStore.getCurrentUser().then(res => {
//                 // 拉取菜单数据
//                 usePri.loadingRouter().then(res=>{
//                     res.forEach(menu => {
//                         router.addRoute(menu)
//                     });
//                 })
//                 // return { ...to, replace: true }// hack方法 确保addRoute已完成
//                 next()
//             }).catch(error => {
//                 next(`/login?redirect=${to.path}`)
//                 NProgress.done()
//             })
//         }
//     } else {
//         /* has no token*/
//         if (whiteList.indexOf(to.path) !== -1) {
//             // in the free login whitelist, go directly
//             next()
//         } else {
//             // other pages that do not have permission to access are redirected to the login page.
//             next(`/login?redirect=${to.path}`)
//             NProgress.done()
//         }

//     }

// })
router.beforeEach(async (to, from, next) => {
    NProgress.start();// 开始

    /*************常用store************** */
    const useSetting = useSettingStore()


    title.value = dynamicTitle(useSetting.title, useSetting.dynamicTitle, to.meta.title as string)

    if (getAccessToken()) {
        // 如果去Login默认去login
        if (to.path === '/login') {
            next({ path: '/' })
            NProgress.done()
        } else {
            const userDict = useDictStore()
            const usePri = usePeriStroe()
            const userStore = useUserStore()

            if (!userDict.getIsSet) {
                await userDict.loadingDictMap
            }
            if (!userStore.getIsUserSet) {
                await userStore.getCurrentUser();// 拉取用户数据
                await usePri.loadingRouter();// 拉取后端数据
                usePri.sidebarRouters.forEach(menu => {
                    router.addRoute(menu as unknown as RouteRecordRaw)
                })
                const redirectPath = from.query.redirect || to.path
                const redirect = decodeURIComponent(redirectPath as string)
                const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect }
                next(nextData)
            }else{
                next()
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