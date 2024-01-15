import { request } from "@/utils/request";
import type { AjaxResult } from "@/utils/request/type";
import type { SysStorage, SysStorageValue } from "../type";
import type { DynamicFromFild, Page } from "@/types";

/**
 * 基础Url
 */
const baseUrl = "/admin-api/file/storage/"


export interface SysStorageValueVo {

    storageId: number,

    list: SysStorageValue[]

}

/**
 * 基础权限
 */
export const basePeri = "file:storage:"

export const getPageFileStorage = async (params: any): Promise<AjaxResult<Page<SysStorage>>> => request.get(baseUrl + 'page', { params })

export const getlistFileStorage = async (params: any): Promise<AjaxResult<Array<SysStorage>>> => request.get(baseUrl + 'simple-list', { params })

export const getFileStorageSupport = async (storageType: string): Promise<AjaxResult<Array<DynamicFromFild>>> => request.get(baseUrl + `support-params/${storageType}`)

export const getFileStorageValue = async (storageId: string | number): Promise<AjaxResult<Array<SysStorageValue>>> => request.get(baseUrl + `value/${storageId}`)



export const SysStorageValueApi = {
    async setting(data: SysStorageValueVo): Promise<AjaxResult<void>> {
        return request.post(
            baseUrl + 'setting-value',
            data
        )
    },

}


export const SysStorageApi = {


    async insert(data: SysStorage): Promise<AjaxResult<void>> {
        return request.post(
            baseUrl,
            data
        )
    },

    async update(data: SysStorage): Promise<AjaxResult<void>> {
        return request.put(
            baseUrl,
            data
        )
    },

    async remove(id: string | string[] | number | number[]): Promise<AjaxResult<void>> {
        return request.delete(
            baseUrl + id,
        )
    },
    async getOnce(id: string | number): Promise<AjaxResult<SysStorage>> {
        return request.get(
            baseUrl + id,
        )
    }

}