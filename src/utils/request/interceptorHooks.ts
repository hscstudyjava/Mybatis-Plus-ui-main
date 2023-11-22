import { refreshToken } from '@/api/login/login'
import { getAccessToken, getRefreshToken } from '../cache/auth'
import { LoginCode, SuccessCode } from './BaseConstants'
import type { InterceptorHooks, ExpandAxiosResponse } from './type'
import CacheUtils from '../cache/CacheUtils'
import { useUserStore } from '@/stores/user'

import Request from './Request'
import { request } from "@/utils/request";
import router from '@/router'


let requestList: any[] = []

let isRefresh = false

export const transform: InterceptorHooks = {
  requestInterceptor(config) {
    // 请求头部处理，如添加 token
    const token = getAccessToken()
    if (token) {
      config.headers.Authorization = token
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
    if (res.status !== 200) return Promise.reject(res)

    if (res.data.code !== SuccessCode.SUCCESS) {

      if (res.config.requestOptions?.globalErrorMessage) {
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
              return request(res.config)
            }).catch(error => {
              userStore.$resetOauth2();//重置
              router.push("/")
              return Promise.reject(error)
            }).finally(() => {
              isRefresh = false// 关闭刷新
            })
        } else {
          return new Promise((resolve, reject) => {
            requestList.push((token: any) => {
              res.headers.Authorization = token
              // @ts-ignore
              resolve(request(res.config))
            }
            )
          })
        }

      }






      return Promise.reject(res.data)
    }

    if (res.config.requestOptions?.globalSuccessMessage) {
      // 这里全局提示请求成功
      console.log(res.data.msg)
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
    return Promise.reject(err.response)
  },
}
