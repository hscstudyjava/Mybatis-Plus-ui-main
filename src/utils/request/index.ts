import{ transform } from "./interceptorHooks";
import  Request from './Request'

// 具体使用时先实例一个请求对象
export const request = new Request({
    baseURL: import.meta.env.VITE_APP_BASE_URL,
    timeout: 5000,
    interceptorHooks: transform
  })