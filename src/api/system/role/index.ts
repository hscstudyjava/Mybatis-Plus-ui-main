import { request } from "@/utils/request";
import type { AjaxResult } from "@/utils/request/type";
import type { Page, SysRole } from "../type";


/**
 * 基础Url
 */
const baseUrl = "/admin-api/system/role/"

export function queryRoleAllList(params: SysRole):Promise< AjaxResult<SysRole>>{
    return request.get(
        baseUrl+`role-list`,
        {
            params:params
        }
    )
} 

export function queryRolePage(data:Object):Promise<AjaxResult<Page<SysRole>>> {
    return request.post(
        baseUrl+`role-page`,
        data
    )
}
