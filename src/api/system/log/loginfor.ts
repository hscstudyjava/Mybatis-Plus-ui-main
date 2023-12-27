import type{ Page, SysOperatorLog,SysLoginLog } from './../type.d';
import { request } from "@/utils/request";
import type { AjaxResult } from "@/utils/request/type";

/**
 * 基础Url
 */
const baseUrl = "/admin-api/system/log/login/"

/**
 * 基础权限
 */
export const basePeri = "system:login:"

export function pageLoginLog(params:any):Promise<AjaxResult<Page<SysLoginLog>>>{
    return request.get(
        baseUrl+'page',
        {
            params
        }
    )
}

export function removeLoginLog(id: string | number|[]): Promise<AjaxResult<any>> {
    return request.delete(
        baseUrl + id,
    )
}

export function getLoginLog(id: string | number): Promise<AjaxResult<SysLoginLog>> {
    return request.get(
        baseUrl + id,
        {
            requestOptions: {
                globalErrorMessage: true
            }
        }
    )
}

export function clearLoginLog():Promise<AjaxResult<void>>{
    return request.delete(
        baseUrl+'clear'
    )
}