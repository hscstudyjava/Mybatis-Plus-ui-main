import { request } from "@/utils/request";
import type { AjaxResult } from "@/utils/request/type";
import type { SysStorage } from "../type";
import type { Page } from "@/types";

/**
 * 基础Url
 */
const baseUrl = "/admin-api/file/storage/"

/**
 * 基础权限
 */
export const basePeri = "file:storage:"

export const getPageFileStorage = async (params: any): Promise<AjaxResult<Page<SysStorage>>> => request.get(baseUrl + 'page', { params })

export const getlistFileStorage = async (params: any): Promise<AjaxResult<Array<SysStorage>>> => request.get(baseUrl + 'simple-list', { params })

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