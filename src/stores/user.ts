import type { AjaxResult } from '@/utils/request/type';
import type { LoginReq, CurrentUser, Oauth2Resp } from '@/api/login/login';
import { ref, computed, reactive, toRef, toRefs } from 'vue'
import { defineStore } from 'pinia'
import { authLogin, getCurrentUserInfo, refreshToken, logout } from '@/api/login/login';
import { getAccessToken, getRefreshToken, removeAccessToken, removeRefreshToken, setAccessToken, setAccessTokenExpire, seteRefreshToken } from '@/utils/cache/auth';

import { useWsStore } from '@/utils/cache/CacheUtils';
import { CacheConstants } from '@/utils/cache/CacheConstatns';
const ws = useWsStore('sessionStorage') //存储到Session中避免数据,个人设置60秒拉取数据
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


    var isUserSet = ref(false);// 用户是否设置成功

    var currentUser = reactive<CurrentUser>({
        userId: 0,
        permissions: [],
        roleList: [],
        userName: "",
        userImg: "",
        isSupuerAdmin: false
    })



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
        Object.assign(oauth2, targetOauth2)
        setAccessToken(oauth2.accessToken)//设置进去参数
        seteRefreshToken(oauth2.refreshToken)//存储进去
    }





    const setCurrentUser = (tagetUser: CurrentUser) => {
        Object.assign(currentUser, tagetUser)//设置数据
        // 同时缓存一下用户数据
        ws.set(CacheConstants.USER_KEY, currentUser, {
            exp: 60
        });
    }


    /**
    * 登录
    * @param loginParams 登录对象
    */
    async function login(loginParams: LoginReq) {
        oauth2 = (await authLogin(loginParams)).data
        setOuath2(oauth2)
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
    async function refresh(refreshToeknParams: string): Promise<AjaxResult<Oauth2Resp>> {
        let resultOauth2 = (await refreshToken(refreshToeknParams))
        setOuath2(resultOauth2.data)
        return resultOauth2;
    }


    /**
     * 获得当前登录对象
     */
    async function getCurrentUser() {
        const cacheUser = ws.get(CacheConstants.USER_KEY)
        if (cacheUser) {
            setCurrentUser(cacheUser);//set
        } else {
            const user = (await getCurrentUserInfo()).data
            setCurrentUser(user);//set
        }
        isUserSet.value = true;
    }

    async function userLogout(): Promise<AjaxResult<void>> {
        const result = (await logout(getCacheOauth()))
        // 并且清除掉cache
        $resetOauth2();//重置oauth2
        $clearCache();//c
        isUserSet.value = true;
        return result;
    }

    /**
      * 重置数据
      */
    const $resetOauth2 = () => {
        Object.assign(oauth2, {
            accessToken: "",
            refreshToken: "",
            expiredTime: 0
        })
    }
    /**
     * 清楚local&&cookie
     * 中oauth2缓存数据
     */
    const $clearCache = () => {
        removeAccessToken();
        removeRefreshToken();
        $resetCurrentUser();
        isUserSet.value = false
    }
    const $resetCurrentUser = () => {
        Object.assign(currentUser, {
            userId: 0,
            permissions: [],
            userName: "",
            userImg: "",
            isSupuerAdmin: false,
            roleList: []
        })
        ws.delete(CacheConstants.USER_KEY)
    }


    const getIsUserSet = computed(() => {
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




