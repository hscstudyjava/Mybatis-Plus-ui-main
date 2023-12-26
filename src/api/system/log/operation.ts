import type{ Page, SysOperatorLog } from './../type.d';
import { request } from "@/utils/request";
import type { AjaxResult } from "@/utils/request/type";

/**
 * 基础Url
 */
const baseUrl = "/admin-api/system/log/operation/"

/**
 * 基础权限
 */
export const basePeri = "system:operation:"

export function pageOperation(params:any):Promise<AjaxResult<Page<SysOperatorLog>>>{
    return request.get(
        baseUrl+'page',
        {
            params
        }
    )
}

export function removeOperation(id: string | number|[]): Promise<AjaxResult<any>> {
    return request.delete(
        baseUrl + id,
    )
}

export function getOperation(id: string | number): Promise<AjaxResult<SysOperatorLog>> {
    return request.get(
        baseUrl + id,
        {
            requestOptions: {
                globalErrorMessage: true
            }
        }
    )
}