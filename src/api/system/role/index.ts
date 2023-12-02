import { request } from "@/utils/request";
import type { AjaxResult } from "@/utils/request/type";
import type { Page, SysRole } from "../type";


/**
 * 基础Url
 */
const baseUrl = "/admin-api/system/role/"

export function queryRoleAllList(params: SysRole): Promise<AjaxResult<SysRole>> {
    return request.get(
        baseUrl + `role-list`,
        {
            params: params
        }
    )
}

export function queryRolePage(data: Object): Promise<AjaxResult<Page<SysRole>>> {
    return request.post(
        baseUrl + `role-page`,
        data
    )
}

/**
 * 
 * @param form 新增角色信息
 * @returns 返回结果值
 */
export function insertRole(form: SysRole): Promise<AjaxResult<void>> {
    return request.post(
        baseUrl,
        form,
        {
            requestOptions: {
                globalErrorMessage: true,
                globalSuccessMessage: true
            }
        }

    )
}
/**
 * 
 * @param form 修改角色信息
 * @returns 返回结果值
 */
export function updateRole(form: SysRole): Promise<AjaxResult<void>> {
    return request.post(
        baseUrl,
        form,
        {
            requestOptions: {
                globalErrorMessage: true,
                globalSuccessMessage: true
            }
        }

    )
}

/**
 * 通过编号查询角色信息
 * @param roleId 角色信息ID
 * @returns 返回结果值
 */
export function queryRoleById(roleId: number): Promise<AjaxResult<SysRole>> {
    return request.get(
        baseUrl + `${roleId}`
    )
}

/**
 * 
 * @param roleIds 角色编号数组
 * @returns  返回结果
 */
export function removeRoleByIds(roleIds:number[]|number):Promise<AjaxResult<void>>{
    return request.delete(
        baseUrl+`${roleIds}`
    )
}