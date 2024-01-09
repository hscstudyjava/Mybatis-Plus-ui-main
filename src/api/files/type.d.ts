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