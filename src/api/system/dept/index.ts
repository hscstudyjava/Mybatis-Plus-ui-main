import { request } from "@/utils/request";
import type { AjaxResult } from "@/utils/request/type";
import type { SimpleTree, SysDept } from "../type";

/**
 * 基础Url
 */
const baseUrl = "/admin-api/system/dept/"

/**
 * 基础权限
 */
export const basePeri = "system:dept:"

export function selectSysDeptList(params:any):Promise<AjaxResult<Array<SysDept>>>{
    return request.get(
        baseUrl+'tree-dept-list',
        {
            params
        }
    )
}

export function selectSysDeptSimpleList(params:any):Promise<AjaxResult<SimpleTree<SysDept>>>{
    return request.get(
        baseUrl+'tree-simple-list',
        {
            params
        }
    )
}

export function insertSysDept(data:SysDept) :Promise<AjaxResult<undefined>>{
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

export function updateSysDept(data:SysDept) :Promise<AjaxResult<undefined>>{
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

export function getSysDeptById(id:string|number): Promise<AjaxResult<Array<SysDept>>> {
    return request.get(
        baseUrl + id,
    )
}

export function removeSysDept(id:string|number): Promise<AjaxResult<any>> {
    return request.delete(
        baseUrl + id,
    )
}