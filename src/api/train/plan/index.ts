import type { IdType, Page } from "@/types/base";
import { request } from "@/utils/request";
import type { AjaxResult } from "@/utils/request/type";
import type { PoliceInfo, TrainPlan, TrainRecord, TrainVideo } from "../type";
import type { SysDeptSimpleVO } from "@/api/system/type";
import type { TrainRecordResult } from "../record";

/**
 * 基础Url
 */
const baseUrl = "/admin-api/train/plan/"

/**
 * 基础权限
 */
export const basePeri = "train:plan:"

export interface TrainPlanResult extends TrainPlan { }

export interface TrainPlanReq extends TrainPlan { }

/**
 * 
 * @param params 查询参数
 * @returns 
 */
export const queryPageTrainPlan = async (params: any) => await request.get<AjaxResult<Page<TrainPlanResult>>>(baseUrl + 'page', { params })

/**
 * 
 * @param params 查询参数
 * @returns 
 */
export const querySimplePlanList = async (params: any) => await request.get<AjaxResult<TrainRecordResult[]>>(baseUrl + 'simple-list', { params })

/**
 * 警情训练计划Api
 */
export const TrainPlanApi = {

    async insert(data: TrainPlanReq) { return await request.post<AjaxResult<void>>(baseUrl, data) },

    async update(data: TrainPlanReq) { return await request.put<AjaxResult<void>>(baseUrl, data) },

    async remvoe(id: IdType) { return await request.delete<AjaxResult<void>>(baseUrl + id) },

    async getOnce(id: IdType) { return await request.get<AjaxResult<void>>(baseUrl + id) }


}