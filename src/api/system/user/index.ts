import { request } from "@/utils/request";
import type { AjaxResult } from "@/utils/request/type";
import type { Page, SysUser } from "../type";
/**
 * 基础Url
 */
const baseUrl = "/admin-api/system/user/"

export function pageUser (data:any):Promise<AjaxResult<Page<SysUser>>> {
    return request.post(
        baseUrl+'page-user',
        data        
    )
}