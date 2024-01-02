import type { BaseDeptEntity } from "@/types/base";



/*****************biz_样机****************** */
export interface TrainMachine extends BaseDeptEntity {

    id?: number,

    deptId: string,

    code: string,

    title: string,

    leader: string,

    telNumber: string,

    ipV4: string,

    ipV6: string,

    status: string,

    optionsParams: {},

}

export interface TrainMachineHealth {

    id: number,

    macCode: string,

    runStatus: string,

    openTime: Date,

    closeTime: Date,

    optionsParam: {}

}

/*****************biz_警员**** */
export interface PoliceInfo extends BaseDeptEntity {
    id?: number,

    code: string,

    title: string,

    idNo: string,

    category: string,

    position: string,

    remark: string,

    optionsParams: object,

    status: string
}