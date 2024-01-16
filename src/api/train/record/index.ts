import type { Page } from "@/types/base";
import { request } from "@/utils/request";
import type { AjaxResult } from "@/utils/request/type";
import type { PoliceInfo, TrainRecord, TrainVideo } from "../type";
import type { SysDeptSimpleVO } from "@/api/system/type";

/**
 * 基础Url
 */
const baseUrl = "/admin-api/train/record/"

/**
 * 基础权限
 */
export const basePeri = "train:record:"

export interface TrainRecordResult extends TrainRecord {

    bizTrainVideo: TrainVideo,

    policeInfo?: PoliceInfo

    dept: SysDeptSimpleVO

}

export const pageTrainRecord = async (params: any): Promise<AjaxResult<Page<TrainRecordResult>>> => {
    return request.get(baseUrl + 'page', { params })
}




export const RecordApi = {
    /**
     * 查询训练详情
     * @param id 训练编号
     * @returns 查询数据
     */
    async getOnce(id: number | string) {
        return await request.get<AjaxResult<TrainRecordResult>>(
            baseUrl + id
        )
    },

    /**
     * 
     * @param id id|ids
     * @returns 
     */
    async remove(id: number | string | number[] | string[]) {
        return await request.delete<AjaxResult<void>>(baseUrl + id)
    },

    /**
     * 
     * @param data 查询参数
     * @returns 返回
     */
    async exportExcel(data: any) {
        return await request.download(baseUrl + 'export', data)
    }
}