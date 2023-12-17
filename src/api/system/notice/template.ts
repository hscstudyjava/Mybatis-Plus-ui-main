import { request } from "@/utils/request";
import type { AjaxResult } from "@/utils/request/type";
import type { Page, SysNoticeTemplate } from "../type";

/**
 * 基础Url
 */
const baseUrl = "/admin-api/system/notice-template/"

/**
 * 基础权限
 */
export const basePeri = "system:notice-template:"


export function selectSysNoticeTemplateList(params: any): Promise<AjaxResult<Page<SysNoticeTemplate>>> {
    return request.get(
        baseUrl + 'page',
        {
            params
        }
    )
}

export function insertSysNoticeTemplate(data: SysNoticeTemplate): Promise<AjaxResult<undefined>> {
    return request.post(
        baseUrl,
        data,
        {
            requestOptions: {
                globalErrorMessage: true
            }
        }
    )
}

export function updateSysNoticeTemplate(data: SysNoticeTemplate): Promise<AjaxResult<undefined>> {
    return request.put(
        baseUrl,
        data,
        {
            requestOptions: {
                globalErrorMessage: true
            }
        }
    )
}

export function getSysNoticeTemplateId(id: string | number): Promise<AjaxResult<Array<SysNoticeTemplate>>> {
    return request.get(
        baseUrl + id,
        {
            requestOptions: {
                globalErrorMessage: true
            }
        }
    )
}

export function removeSysNoticeTemplate(id: string | number|[]): Promise<AjaxResult<any>> {
    return request.delete(
        baseUrl + id,
        {
            requestOptions: {
                globalSuccessMessage: true,
                globalErrorMessage: true
            }
        }
    )
}