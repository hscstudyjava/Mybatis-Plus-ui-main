import type { Page } from '@/api/system/type';
import type { TrainMachine } from './../type.d';
import { request } from "@/utils/request";
import type { AjaxResult } from "@/utils/request/type";

/**
 * 基础Url
 */
const baseUrl = "/admin-api/train/machine/"

/**
 * 基础权限
 */
export const basePeri = "train:machine:"


export const MachineApi = {

    async pageMachine(params: any): Promise<AjaxResult<Page<TrainMachine>>> {
        return request.get(
            baseUrl + 'page',
            {
                params
            }
        )
    },

    async insertMachine(data: TrainMachine): Promise<AjaxResult<void>> {
        return request.post(
            baseUrl,
            data
        )
    },

    async updateMachine(data:TrainMachine):Promise<AjaxResult<void>>{
        return request.put(
            baseUrl,
            data
        )
    },

    async getOnce(machineId:number) :Promise<AjaxResult<TrainMachine>>{
        return request.get(baseUrl+machineId)
    },

    async removeMachine(machineId:number|number[]):Promise<AjaxResult<TrainMachine>>{
        return request.delete(baseUrl+machineId)
    }

}