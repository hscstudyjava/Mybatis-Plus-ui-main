import type { Page } from "@/types/base";
import { request } from "@/utils/request";
import type { AjaxResult } from "@/utils/request/type";
import type { TrainVideo } from "../type";

/**
 * 基础Url
 */
const baseUrl = "/admin-api/train/video/"

/**
 * 基础权限
 */
export const basePeri = "train:video:"



export const pageTrainVideo=async (params:any):Promise<AjaxResult<Page<TrainVideo>>> =>{
    return request.get(
        baseUrl+'page',
        {
            params
        }
    )
}

export const listTrainVideo =async (params:any):Promise<AjaxResult<Array<TrainVideo>>> =>{
    return request.get(
        baseUrl+'list',
        {
            params
        }
    )
}


export const TrainVideoApi={

    async insert(data: TrainVideo): Promise<AjaxResult<void>> {
        return request.post(
            baseUrl,
            data
        )
    },

    async update(data: TrainVideo): Promise<AjaxResult<void>> {
        return request.put(
            baseUrl,
            data
        )
    },

    async getOnce(id: number): Promise<AjaxResult<TrainVideo>> {
        return request.get(baseUrl + id)
    },

    async remove(id: number | number[]): Promise<AjaxResult<void>> {
        return request.delete(baseUrl + id)
    }

}