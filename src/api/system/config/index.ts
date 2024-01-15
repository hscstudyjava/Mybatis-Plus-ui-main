import { request } from "@/utils/request";
import type { AjaxResult } from "@/utils/request/type";
import type { SimpleTree, SysConfig } from "../type";

/**
 * 基础Url
 */
const baseUrl = "/admin-api/system/config/"

/**
 * 基础权限
 */
export const basePeri = "system:config:"

export function selectSysConfigList(params:any):Promise<AjaxResult<Array<SysConfig>>>{
    return request.get(
        baseUrl+'tree-config-list',
        {
            params
        }
    )
}

export function selectSysConfigSimpleList(params:any):Promise<AjaxResult<SimpleTree<SysConfig>>>{
    return request.get(
        baseUrl+'tree-simple-list',
        {
            params
        }
    )
}

export function insertSysConfig(data:SysConfig) :Promise<AjaxResult<undefined>>{
    return request.post(
        baseUrl,
        data,
        {
            requestOptions:{
                globalErrorMessage:true
            }
        }
    )
}

export function updateSysConfig(data:SysConfig) :Promise<AjaxResult<undefined>>{
    return request.put(
        baseUrl,
        data,
        {
            requestOptions:{
                globalErrorMessage:true
            }
        }
    )
}

export function getSysConfigById(id:string|number): Promise<AjaxResult<Array<SysConfig>>> {
    return request.get(
        baseUrl + id,
    )
}

export function removeSysConfig(id:string|number): Promise<AjaxResult<any>> {
    return request.delete(
        baseUrl + id,
    )
}

export const getAdminServerConfig=async():Promise<AjaxResult<object>> => request.get(baseUrl+'admin-init-config')
