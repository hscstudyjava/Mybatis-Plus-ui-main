import type { BaseEnity } from "../system/type";



export interface TrainMachine extends BaseEnity{

    id?:number,

    deptId:string,

    code:string,

    title:string,

    leader:string,

    telNumber:string,

    ipV4:string,

    ipV6:string,

    status:string,

    optionsParams:{},

    createDept:string,

    updateDept:string

}

export interface TrainMachineHealth{

    id:number,

    macCode:string,
    
    runStatus:string,

    openTime:Date,

    closeTime:Date,

    optionsParam:{}
    
}