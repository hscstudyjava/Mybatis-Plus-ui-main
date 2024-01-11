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
