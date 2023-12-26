import { request } from "@/utils/request";
import type { AjaxResult } from "@/utils/request/type";
import type { Page, SysUser } from "../type";
/**
 * 基础Url
 */
const baseUrl = "/admin-api/system/user/"


export interface SysUserReq extends SysUser{

    postIdList?:[]

    roleIdList?:[]


}

export function pageUser (data:any):Promise<AjaxResult<Page<SysUser>>> {
    return request.post(
        baseUrl+'page-user',
        data        
    )
}

export function insertUser(data:SysUserReq):Promise<AjaxResult<void>>{
    return request.post(
        baseUrl,
        data
    )
}

export function updateUser(data:SysUserReq):Promise<AjaxResult<void>>{
    return request.put(
        baseUrl,
        data
    )
}

export function getUserOnce(id:number):Promise<AjaxResult<SysUser>>{
    return request.get(
        baseUrl+id,
    )
}

export function removeUser(id:number|number[]):Promise<AjaxResult<void>>{
    return request.delete(
        baseUrl+id,
    )
}

export function resetPassWord(id:number,passwd:string):Promise<AjaxResult<void>>{
    return request.post(
        baseUrl+"reset-passwd",
        {
            userId:id,
            passWord:passwd.trim()
        }
    )

}