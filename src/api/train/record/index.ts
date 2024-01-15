import type { Page } from "@/types/base";
import { request } from "@/utils/request";
import type { AjaxResult } from "@/utils/request/type";
import type { PoliceInfo, TrainRecord, TrainVideo } from "../type";

/**
 * 基础Url
 */
const baseUrl = "/admin-api/train/record/"

/**
 * 基础权限
 */
export const basePeri = "train:record:"

export interface TrainRecordResult extends TrainRecord {

    bizTrainVideo?: TrainVideo,

    policeInfo?: PoliceInfo

}

export const pageTrainRecord = async (params: any): Promise<AjaxResult<Page<TrainRecordResult>>> => {
    return request.get(baseUrl + 'page', { params })
}


export const RecordApi = () => {
    return {



    }
}