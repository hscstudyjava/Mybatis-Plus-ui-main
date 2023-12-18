import { request } from "@/utils/request";
import type { AjaxResult } from "@/utils/request/type";
import type { Page, SysDictValue } from "../type";

/**
 * 基础Url
 */
const baseUrl = "/admin-api/system/dict-value/"

/**
 * 基础权限
 */
export const basePeri = "system:dict-value:"

export function selectSysDictValueList(params: any): Promise<AjaxResult<Page<SysDictValue>>> {
    return request.get(
        baseUrl + 'page',
        {
            params
        }
    )
}

export function insertSysDictValue(data: SysDictValue): Promise<AjaxResult<undefined>> {
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

export function updateSysDictValue(data: SysDictValue): Promise<AjaxResult<undefined>> {
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

export function getSysDictValueId(id: string | number | []): Promise<AjaxResult<Array<SysDictValue>>> {
    return request.get(
        baseUrl + id,
        {
            requestOptions: {
                globalErrorMessage: true
            }
        }
    )
}

export function removeSysDictValue(id: string | number | Array<number>): Promise<AjaxResult<any>> {
    return request.delete(
        baseUrl + id,
       
    )
}