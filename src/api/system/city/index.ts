import { request } from "@/utils/request";
import type { AjaxResult } from "@/utils/request/type";
import type { SimpleTree, SysCity, SysConfig } from "../type";

/**
 * 基础Url
 */
const baseUrl = "/admin-api/system/city/"

/**
 * 基础权限
 */
export const basePeri = "system:city:"

export const queryCityTree = async (params: any): Promise<AjaxResult<SysCity[]>> => request.get(baseUrl + 'tree-list', { params })

export const queryCitySimpleTree = async (params: any): Promise<AjaxResult<SimpleTree<SysCity>[]>> => request.get(baseUrl + 'tree-list-simple', { params })


/********************简化城市数据********************* */
export const querySimpleProvince = async (): Promise<AjaxResult<SimpleTree<SysCity>[]>> => request.get(baseUrl + 'list-simple-province')

export const querySimpleCity = async (id: string): Promise<AjaxResult<SimpleTree<SysCity>[]>> => request.get(baseUrl + 'list-simple-city/' + id)

export const querySimpleCounty = async (id: string): Promise<AjaxResult<SimpleTree<SysCity>[]>> => request.get(baseUrl + 'list-simple-county/' + id)

/********************城市数据********************* */
export const queryResultProvince = async (): Promise<AjaxResult<SysCity[]>> => request.get(baseUrl + 'list-result-province')

export const queryResultCity = async (id: string): Promise<AjaxResult<SysCity[]>> => request.get(baseUrl + 'list-result-city/' + id)

export const queryResultCounty = async (id: string): Promise<AjaxResult<SysCity[]>> => request.get(baseUrl + 'list-result-county/' + id)


export const SysCityApi = {

    async insert(data: SysCity): Promise<AjaxResult<void>> {
        return request.post(
            baseUrl,
            data
        )
    },

    async update(data: SysCity): Promise<AjaxResult<void>> {
        return request.put(
            baseUrl,
            data
        )
    },

    async remove(id: string | string[]): Promise<AjaxResult<void>> {
        return request.delete(
            baseUrl + id,
        )
    },
    async getOnce(id: string): Promise<AjaxResult<SysCity>> {
        return request.post(
            baseUrl + id,
        )
    }



}




