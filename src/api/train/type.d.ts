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

    name: string,

    idNo: string,

    category: string,

    position: string,

    remark: string,

    optionsParams: object,

    status: string
}

/****************biz_警情 */
export interface TrainVideo extends Omit<BaseDeptEntity, "optionsParams"> {
    id?: number,

    code: string,

    name: string,

    thumb: string,

    trainType: string,

    trainLevel: string,

    status: string,

    sortValue: number

    optionsParams: TrainVideoParams
}


export interface TrainVideoParams {
    gunLocalUrl: string,
    /**
 * 开始帧率
 */
    fpsStartTime: string,
    /**
 * 结束帧率
 */
    fpsEndTime: string,
    /**
 * 默认使用毫秒 1000
 */
    videoTime: number,
    /**
 * 动作开始毫秒
 */
    playTime: number,
    /**
 * 开始执法记录仪
 */
    closeCamera: number
    /**
 * 开启警官证
 */
    openPoliceCard: number,
}