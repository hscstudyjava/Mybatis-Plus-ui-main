import { refreshToken } from '@/api/login/login'
import { getAccessToken, getRefreshToken } from '../cache/auth'
import { LoginCode, ResponseCodeErrorMessages, ResponseStatusErrorMessage, SuccessCode } from './BaseConstants'
import type { InterceptorHooks, ExpandAxiosResponse } from './type'
import CacheUtils from '../cache/CacheUtils'
import { useUserStore } from '@/stores/user'

import Request from './Request'
import { request } from "@/utils/request";
import router from '@/router'
import { confirms, messages } from "@/utils/message/MessageUtils"
import { tansParams } from '../common'
import type { AxiosError } from 'axios'


let requestList: any[] = []
let isRefresh = false
const isLogin = {
  show: false
}



export const transform: InterceptorHooks = {
  requestInterceptor(config) {
    // 请求头部处理，如添加 token
    const token = getAccessToken()
    if (token) {
      config.headers.Authorization = token
    }
    // get请求映射params参数
    if (config.method === 'get' && config.params) {
      let url = config.url + '?' + tansParams(config.params);
      url = url.slice(0, -1);
      config.params = {};
      config.url = url;
    }
    return config
  },
  requestInterceptorCatch(err) {
    console.log(`axios -->request error:${err}`);
    // 请求错误，这里可以用全局提示框进行提示
    return Promise.reject(err)
  },
  responseInterceptor(result) {
    // 因为 axios 返回不支持扩展自定义配置，需要自己断言一下
    const res = result as ExpandAxiosResponse
    const userStore = useUserStore()

    // 与后端约定的请求成功码
    if (res.status !== 200) return Promise.reject(result)

    if (res.data.code !== SuccessCode.SUCCESS) {


      if (res.config.requestOptions?.globalErrorMessage) {
        // messages.error(res.data.msg);
        // 这里全局提示错误
        console.error(res.data.msg)
      }
      
      // 访问Token已经过期
      if (res.data.code === LoginCode.USER_TOKEN_EXPIRE) {
        if (!isRefresh) {
          isRefresh = true;
          // 刷新_toekn
          return userStore.refresh(getRefreshToken())
            .then(response => {
              //set_Authorization
              res.headers.Authorization = userStore.oauth2.accessToken
              requestList.forEach((item) => item(userStore.oauth2.accessToken))
              requestList = []
              // @ts-ignore
              return request.request(res.config, { headers: { Authorization: userStore.oauth2.accessToken } })
            }).catch(error => {
              userStore.$resetOauth2();//重置
              return Promise.reject(error)
            }).finally(() => {
              isRefresh = false// 关闭刷新
            })
        } else {
          return new Promise((resolve, reject) => {
            requestList.push((token: any) => {
              res.headers.Authorization = token
              // 在刷新Token的请求中传递refreshConfig配置
              // @ts-ignore
              resolve(request.request(res.config, { headers: { Authorization: token } }))
            }
            )
          })
        }
      }

      // 刷新Token也过期
      if (res.data.code === LoginCode.USER_REFRESH_TOKEN_EXPIRE) {
        // 清空Oauth2_Obj
        userStore.$resetOauth2();
        // userStore
        userStore.$clearCache();
        if (!isLogin.show) {
          handleLogin()
        }
      }
      return Promise.reject(res.data)
    }

    if (res.config.requestOptions?.globalSuccessMessage) {
      // 这里全局提示请求成功
      console.log(res.data.msg)
      messages.success(res.data.msg);
    }
    // 请求返回值，建议将 返回值 进行解构
    return res.data
  },
  responseInterceptorCatch(err: AxiosError) {
    return handleResponseError(err)
  }
}

/**
 * 处理Response异常
 * https://blog.csdn.net/lynn_rose/article/details/135143117
 * 如何解决Ts中string、number和any等类型不能当做索引用
 * const changePhase = (item: number) => {
   const phase = phaseObj[item as keyof typeof phaseObj]
}
 * @param error 
 * @returns 
 */
export function handleResponseError(error: AxiosError) {
  if (error.response) {
    // 根据状态码进行处理
    const status = error.response.status;
    const statusErrorMessage = (ResponseStatusErrorMessage as any)[status] || ResponseStatusErrorMessage.default;
    messages.error(statusErrorMessage);
    console.error(statusErrorMessage);
  } else if (error.code) {
    // 根据错误代码进行处理
    const codeErrorMessage = (ResponseCodeErrorMessages as any)[error.code] || ResponseCodeErrorMessages.default;
    messages.error(codeErrorMessage);
    console.error(codeErrorMessage);
  } else {
    // 其他未知错误
    const errorMessage = '发生了未知错误，请稍后再试！';
    messages.error(errorMessage);
    console.error(errorMessage);
  }
  return Promise.reject(error);
}
const handleLogin = () => {
  if (!isLogin.show) {
    // 如果已经到重新登录页面则不进行弹窗提示
    if (window.location.href.includes('/login?redirect=')) {
      return
    }
    isLogin.show = true
    confirms.confirm(
      "抱歉,您当前账号登录状态已经过期,请重新登录或者留在当前页面",
      "登录状态提示",
      "warning",
      "重新登录",
      "取消登录"
    ).then(res => {
      isLogin.show = false
      // 干掉token后再走一次路由让它过router.beforeEach的校验
      window.location.href = window.location.href
    }).catch(error => {
      isLogin.show = false
    })
  }


}