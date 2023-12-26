import { request } from "@/utils/request";
import type { AjaxResult } from "@/utils/request/type";
import type { Page, SysNoticeTemplate, SysPost } from "../type";

/**
 * 基础Url
 */
const baseUrl = "/admin-api/system/post/"

/**
 * 基础权限
 */
export const basePeri = "system:post:"


export function selectSimplePost(params:any):Promise<AjaxResult<Array<SysPost>>>{
    return request.get(
        baseUrl+'list',
        {
            params
        }
    )
}

export function selectPostPage(params:SysPost):Promise<AjaxResult<Page<SysPost>>> {
    return request.get(
        baseUrl+'page',
        {
            params
        }
    )
}


export function insertPost(data:SysPost):Promise<AjaxResult<void>>{
    return request.post(
        baseUrl,
        data
    )    
}

export function updatePost(data:SysPost):Promise<AjaxResult<void>>{
    return request.put(
        baseUrl,
        data
    )    
}

export function getOnce(id:number|string):Promise<AjaxResult<SysPost>>{
    return request.get(
        baseUrl+id
    )
}
export function removeBatchOrOnce(id:number|[]):Promise<AjaxResult<void>>{
    return request.delete(baseUrl+id)
}

