import { refreshToken } from '@/api/login/login'
import { getAccessToken, getRefreshToken } from '../cache/auth'
import { LoginCode, SuccessCode } from './BaseConstants'
import type { InterceptorHooks, ExpandAxiosResponse } from './type'
import CacheUtils from '../cache/CacheUtils'
import { useUserStore } from '@/stores/user'

import Request from './Request'
import { request } from "@/utils/request";
import router from '@/router'
import { confirms, messages } from "@/utils/message/MessageUtils"
import { tansParams } from '../common'


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
    // 请求错误，这里可以用全局提示框进行提示
    return Promise.reject(err)
  },
  responseInterceptor(result) {
    // 因为 axios 返回不支持扩展自定义配置，需要自己断言一下
    const res = result as ExpandAxiosResponse
    const userStore = useUserStore()

    // 与后端约定的请求成功码
    if (res.status !== 200 ) return Promise.reject(res)

    if (res.data.code !== SuccessCode.SUCCESS) {

      if (res.config.requestOptions?.globalErrorMessage) {
        messages.error(res.data.msg);
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
  responseInterceptorCatch(err) {
    // 这里用来处理 http 常见错误，进行全局提示
    const mapErrorStatus = new Map([
      [400, '请求方式错误'],
      [401, '请重新登录'],
      [403, '拒绝访问'],
      [404, '请求地址有误'],
      [500, '服务器出错'],
    ])
    const message =
      mapErrorStatus.get(err.response.status) || '请求出错，请稍后再试'
    // 此处全局报错
    console.error(message)
    messages.error(message);
  
    return Promise.reject(err.response)
  },
}

const handleLogin = () => {
  isLogin.show = true
  confirms.confirm(
    "抱歉,您当前账号登录状态已经过期,请重新登录或者留在当前页面",
    "登录状态提示",
    "warning",
    "重新登录",
    "取消登录"
  ).then(res => {
    isLogin.show = false
    location.href = "/login"
  }).catch(error => {
    isLogin.show = false
  })

}