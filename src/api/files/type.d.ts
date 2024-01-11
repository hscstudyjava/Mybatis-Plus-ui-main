import type { BaseEnity } from "@/types";




export interface SysStorage extends BaseEnity {

    id: number|undefined,

    storageName: string,

    storageKey: string,

    storageEnableCache: boolean,

    storageEnable: boolean,

    storageType: string,

    sortValue: number
}

export interface SysStorageValue extends BaseEnity{

    id?:number,

    storageId?:number,

    storageName:string,

    // storageType:string,

    storageTitle:string,
    
    storageValue:string,
}


export interface uploadModel{

    /**
     * 上传Key
     */
    storeKey:string,

    /**
     * 可以指定上传路径
     */
    path:string,

    /** 
     * 是否保存源文件
     */
    hasSource:boolean,

    /** 
     * 是否使用时间戳
     */
    hasTimeFile:boolean,

    /**
     * txt,xls,go,java
     */
    fileTypeList:string|string[],
    /**
     * md5计算
     */
    md5:string,
}
