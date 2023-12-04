import { request } from "@/utils/request";
import type { AjaxResult } from "@/utils/request/type";
import type { SysPermisson } from "../type";

/**
 * 基础Url
 */
const baseUrl = "/admin-api/system/permission/"

/**
 * 基础权限
 */
export const basePeri = "system:permission"

export function queryPermissionAllTree(params: SysPermisson): Promise<AjaxResult<SysPermisson>> {
    return request.get(
        baseUrl + 'tree-pre-list',
        {
            params
        }
    )
}