// 路由权限
// @ts-ignore
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import router from './router'
import { getAccessToken, removeAccessToken } from './utils/cache/auth'
import { useUserStore } from '@/stores/user'
NProgress.configure({ showSpinner: false }) // NProgress Configuration

let whiteList = [
    "/login"
]



// 路由权限
router.beforeEach((to, from, next) => {
    const userStore = useUserStore()

    NProgress.start();

    const accessToken = getAccessToken();//访问Token

    // 访问Token不等于空
    if (accessToken != null) {
        if (to.path === '/login') {
            next({ path: '/' })
            NProgress.done()
        } else {
            userStore.getCurrentUser().then(res => {
                next();//放行
            }).catch(error => {
                next(`/login?redirect=${to.path}`)
                NProgress.done()
            })
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

// 
router.afterEach(() => {
    // finish progress bar
    NProgress.done()
})