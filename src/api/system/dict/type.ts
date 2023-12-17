import { request } from "@/utils/request";
import type { AjaxResult } from "@/utils/request/type";
import type { Page, SysDictType } from "../type";

/**
 * 基础Url
 */
const baseUrl = "/admin-api/system/dict-type/"

/**
 * 基础权限
 */
export const basePeri = "system:dict-type:"

export function selectSysDictTypeList(params: any): Promise<AjaxResult<Page<SysDictType>>> {
    return request.get(
        baseUrl + 'page',
        {
            params
        }
    )
}

export function insertSysDictType(data: SysDictType): Promise<AjaxResult<undefined>> {
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

export function updateSysDictType(data: SysDictType): Promise<AjaxResult<undefined>> {
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

export function getSysDictTypeId(id: string | number | []): Promise<AjaxResult<Array<SysDictType>>> {
    return request.get(
        baseUrl + id,
        {
            requestOptions: {
                globalErrorMessage: true
            }
        }
    )
}

export function removeSysDictType(id: string | number | []): Promise<AjaxResult<any>> {
    return request.delete(
        baseUrl + id,
       
    )
}