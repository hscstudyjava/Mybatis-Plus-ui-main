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

    var isUserSet=ref(false);// 用户是否设置成功


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
  /*   async function refresh(refreshToeknParams: string) {
        let resultOauth2 = (await refreshToken(refreshToeknParams)).data
        setOuath2(resultOauth2)
        cacheToken();
    }
 */

    async function refresh(refreshToeknParams: string):Promise<AjaxResult<Oauth2Resp>> {
        let resultOauth2 = (await refreshToken(refreshToeknParams))
        setOuath2(resultOauth2.data)
        cacheToken();
        return resultOauth2;
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
        roleList:[],
        userName: "",
        userImg: "",
        isSupuerAdmin: false
    })

    const setCurrentUser = (tagetUser: CurrentUser) => {
        Object.assign(currentUser,tagetUser)//设置数据
        // 缓存到session中
    }

    const $resetCurrentUser = () => {
        currentUser = reactive<CurrentUser>({
            userId: 0,
            permissions: [],
            userName: "",
            userImg: "",
            isSupuerAdmin: false,
            roleList: []
        })
    }

    /**
     * 获得当前登录对象
     */
    async function getCurrentUser() {
        const user = (await getCurrentUserInfo()).data
        setCurrentUser(user);//set
        isUserSet.value=true;
    }

    async function userLogout(): Promise<AjaxResult<void>> {
        const result = (await logout(getCacheOauth()))
        // 并且清除掉cache
        $resetOauth2();//重置oauth2
        $clearCache();//c
        isUserSet.value=true;
        return result;
    }


    const getIsUserSet=computed(()=>{
        return isUserSet.value;
    })

    return {
        currentUser,
        oauth2,

        getIsUserSet,
        $resetOauth2,
        $clearCache,

        login,

        getCurrentUser,

        refresh,

        userLogout
    }
})




