import { request } from "@/utils/request";
import type { AjaxResult } from "@/utils/request/type";
import type { SimpleTree, SysPermisson } from "../type";

/**
 * 基础Url
 */
const baseUrl = "/admin-api/system/permission/"

/**
 * 基础权限
 */
export const basePeri = "system:permission:"

export const permissionType = [
   
    {
        label: '菜单',
        value: 'M'
    },
    {
        label: '路由',
        value: 'R'
    }, {
        label: '按钮',
        value: 'P'
    }
]

export function queryPermissionAllTree(params: SysPermisson): Promise<AjaxResult<Array<SysPermisson>>> {
    return request.get(
        baseUrl + 'tree-pre-list',
        {
            params
        }
    )
}

export function queryPermissionSimple(params?: SysPermisson): Promise<AjaxResult<SimpleTree<SysPermisson>[]>> {
    return request.get(
        baseUrl + 'tree-pre-simple',
        {
            params
        }
    )
}

export function insertPermission(data:SysPermisson) :Promise<AjaxResult<undefined>>{
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

export function updatePermission(data:SysPermisson) :Promise<AjaxResult<undefined>>{
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

export function getPermissionInfoById(permissionId:string|number): Promise<AjaxResult<Array<SysPermisson>>> {
    return request.get(
        baseUrl + permissionId,
    )
}

export function removePermission(permissionId:string|number): Promise<AjaxResult<any>> {
    return request.delete(
        baseUrl + permissionId,
    )
}

export function generationPermission(data:any):Promise<AjaxResult<undefined>>{
    return request.post(
        baseUrl+'generationPermission',
        data
    )
}