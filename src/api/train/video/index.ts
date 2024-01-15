import type { Page } from "@/types/base";
import { request } from "@/utils/request";
import type { AjaxResult } from "@/utils/request/type";
import type { TrainVideo, TrainVideoChild } from "../type";

/**
 * 基础Url
 */
const baseUrl = "/admin-api/train/video/"

/**
 * 子集Url
 */
const baseChildUrl=baseUrl+'children/'

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
        baseUrl+'simple-list',
        {
            params
        }
    )
}

export const getTrainVideoChildren=async(params:any):Promise<AjaxResult<Array<TrainVideoChild>>> =>{
    return request.get(
        baseChildUrl+'list',
        {
            params
        }
    )
}

export const TrainVideoChildApi={
    async insert(data: TrainVideoChild): Promise<AjaxResult<void>> {
        return request.post(
            baseChildUrl,
            data
        )
    },

    async update(data: TrainVideoChild): Promise<AjaxResult<void>> {
        return request.put(
            baseChildUrl,
            data
        )
    },

    async getOnce(id: number|string): Promise<AjaxResult<TrainVideoChild>> {
        return request.get(baseChildUrl + id)
    },

    async remove(id: number|string | number[]): Promise<AjaxResult<void>> {
        return request.delete(baseChildUrl + id)
    }
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

    async getOnce(id: number|string): Promise<AjaxResult<TrainVideo>> {
        return request.get(baseUrl + id)
    },

    async remove(id: number |string | number[]): Promise<AjaxResult<void>> {
        return request.delete(baseUrl + id)
    }

}