import type { AjaxResult } from '@/utils/request/type';
import type { LoginReq, CurrentUser, Oauth2Resp } from '@/api/login/login';
import { ref, computed, reactive, toRef, toRefs } from 'vue'
import { defineStore } from 'pinia'
import { authLogin, getCurrentUserInfo, refreshToken, logout } from '@/api/login/login';
import { getAccessToken, getRefreshToken, removeAccessToken, removeRefreshToken, setAccessToken, setAccessTokenExpire, seteRefreshToken } from '@/utils/cache/auth';

/**
 * 
 * 用户储存
 */
export const useUserStore = defineStore('userStore', () => {

    var oauth2 = reactive<Oauth2Resp>(
        {
            accessToken: "",
            refreshToken: "",
            expiredTime: 0
        }
    )

    /**
     * 登录
     * @param loginParams 登录对象
     */
    async function login(loginParams: LoginReq) {
        oauth2 = (await authLogin(loginParams)).data
        cacheToken();
    }

    /**
   * 刷新访问Token
   * @param refreshToeknParams 刷新Token
   */
    async function refresh(refreshToeknParams: string) {
        let resultOauth2 = (await refreshToken(refreshToeknParams)).data
        setOuath2(resultOauth2)
        cacheToken();
    }


    /**
     * 缓存数据
     */
    const cacheToken = () => {
        setAccessToken(oauth2.accessToken)//设置进去参数
        seteRefreshToken(oauth2.refreshToken)//存储进去
    }

    /**
     * 清楚local&&cookie
     * 中oauth2缓存数据
     */
    const $clearCache=()=>{
        removeAccessToken();
        removeRefreshToken();
    }

    /**
     * 从缓存中拿出Oauth2
     * @returns 返回登录Resp
     */
    const getCacheOauth = (): Oauth2Resp => {
        return {
            accessToken: getAccessToken(),
            refreshToken: getRefreshToken(),
            expiredTime: 0
        }
    }

    /**
     * 设置到pinia中
     * @param targetOauth2 asyn 异步获得数据
     */
    const setOuath2 = (targetOauth2: Oauth2Resp) => {
        oauth2.accessToken = targetOauth2.accessToken
        oauth2.refreshToken = targetOauth2.refreshToken
        oauth2.expiredTime = targetOauth2.expiredTime
    }

    /**
     * 重置数据
     */
    const $resetOauth2 = () => {
        oauth2 = reactive<Oauth2Resp>(
            {
                accessToken: "",
                refreshToken: "",
                expiredTime: 0
            }
        )
    }

    var currentUser = reactive<CurrentUser>({
        userId: 0,
        permissions: [],
        userName: "",
        userImg: "",
        isSupuerAdmin: false
    })

    const setCurrentUser = (tagetUser: CurrentUser) => {
        currentUser.isSupuerAdmin = tagetUser.isSupuerAdmin
        currentUser.permissions = tagetUser.permissions
        currentUser.userName = tagetUser.userName
        currentUser.userId = tagetUser.userId
        currentUser.userImg = tagetUser.userImg
    }

    const $resetCurrentUser = () => {
        currentUser = reactive<CurrentUser>({
            userId: 0,
            permissions: [],
            userName: "",
            userImg: "",
            isSupuerAdmin: false
        })
    }

    /**
     * 获得当前登录对象
     */
    async function getCurrentUser() {
        const user = (await getCurrentUserInfo()).data
        setCurrentUser(user);//set
    }

    async function userLogout(): Promise<AjaxResult<void>> {
        const result = (await logout(getCacheOauth()))
        // 并且清除掉cache
        $resetOauth2();//重置oauth2
        $clearCache();//c
        return result;
    }

    return {
        currentUser,
        oauth2,


        $resetOauth2,

        login,

        getCurrentUser,

        refresh,

        userLogout
    }
})




