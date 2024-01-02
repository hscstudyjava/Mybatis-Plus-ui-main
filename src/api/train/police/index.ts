import type { Page } from "@/types/base";
import { request } from "@/utils/request";
import type { AjaxResult } from "@/utils/request/type";
import type { PoliceInfo } from "../type";

/**
 * 基础Url
 */
const baseUrl = "/admin-api/train/police/"

/**
 * 基础权限
 */
export const basePeri = "train:machine:"


// 提供给单独的方法调用
export const selectPoliceSimpleList = async (params: any): Promise<AjaxResult<PoliceInfo[]>> => {
    return request.get(
        basePeri + 'simple-list',
        {
            params
        }
    )
}

export const selectPolicePage = async (params: any): Promise<AjaxResult<Page<PoliceInfo>>> => {
    return request.get(
        baseUrl + 'page',
        {
            params
        }
    )
}


export const PoliceApi = {


    async insertPoliceInfo(data: PoliceInfo): Promise<AjaxResult<void>> {
        return request.post(
            baseUrl,
            data
        )
    },

    async updatePoliceInfo(data: PoliceInfo): Promise<AjaxResult<void>> {
        return request.put(
            baseUrl,
            data
        )
    },

    async getOnce(id: number): Promise<AjaxResult<PoliceInfo>> {
        return request.get(baseUrl + id)
    },

    async removePoliceInfo(id: number | number[]): Promise<AjaxResult<void>> {
        return request.delete(baseUrl + id)
    }

}