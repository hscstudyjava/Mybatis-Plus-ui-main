import { request } from "@/utils/request";
import type { AjaxResult } from "@/utils/request/type";


const baseUrl="/auth/"

export type Oauth2Resp={
    /**
     *
     * 当前Token
     */
     accessToken: string,

    /**
     * 刷新Token
     */
     refreshToken: string,

    /**
     * 过期时间
     */
     expiredTime: number,
}

export type LoginReq={

     userName: String,

     passWord: String,

     code?: String,
    
     uuid?: String,

}

export interface CurrentUser {

    /**
     * 权限列表
     */
    permissions: [],

    /**
     * 用户编号
     */
    userId:number,

    /**
     * 用户信息
     */
    userName: String,

    /**
     * 用户图片
     */
    userImg: String

    /**
     * 超级管理员
     */
    isSupuerAdmin: Boolean
}


/**
 * 
 * @param refreshToken 刷新Token
 * @returns 返回结果
 */
export function refreshToken(refreshToken?:string): Promise<AjaxResult<Oauth2Resp>>{
   return request.get<AjaxResult<Oauth2Resp>>
    (
        baseUrl+`refreshToken/${refreshToken}`,
        {}
    )
}

/**
 * 
 * @param loginParams 登录
 * @returns 
 */
export function authLogin(loginParams:LoginReq):Promise<AjaxResult<Oauth2Resp>>{
    return request.post<AjaxResult<Oauth2Resp>>(
            baseUrl+"login",
            loginParams,
            {
                requestOptions:{
                    globalSuccessMessage:true
                }
            }
    )
}

/**
 * 用户信息
 * @returns 
 */
export function getCurrentUserInfo():Promise<AjaxResult<CurrentUser>>{
    return request.get(
        baseUrl+'userInfo',
        {
            requestOptions:{
                globalErrorMessage:true
            }
        }
    )
}

/**
 * 退出登录
 * @param currentToken 访问Token 
 * @returns  返回结果
 */
export function logout(currentToken:Oauth2Resp):Promise<AjaxResult<void>>{
    return request.post(
        baseUrl+'logout',
        currentToken,
        {
            requestOptions:{
                globalSuccessMessage:true
            }
        }
    )
}