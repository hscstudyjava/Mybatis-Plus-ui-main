import { UploadFileModel } from './type.d';
import type { BaseEnity } from "@/types";
import type { FileSizeTypeEnum } from "@/utils/constants/SystemConstants";




export interface SysStorage extends BaseEnity {

    id: number | undefined,

    storageName: string,

    storageKey: string,

    storageEnableCache: boolean,

    storageEnable: boolean,

    storageType: string,

    sortValue: number
}

export interface SysStorageValue extends BaseEnity {

    id?: number,

    storageId?: number,

    storageName: string,

    // storageType:string,

    storageTitle: string,

    storageValue: string,
}


export interface UploadModel {

    /**
     * 上传Key
     */
    storeKey: string,

    /**
     * 可以指定上传路径
     */
    path: string,

    /**
     * 文件名称必传
     */
    name: string,

    /**
     * 文件大小
     */
    size: number,

    /**
     * 限定文件大小
     */
    limitSize: number,

    /** 
     * 是否保存源文件名称
     */
    hasSourceName: boolean | false,

    /** 
     * 是否使用时间戳
     */
    hasTimeFilePath: boolean | false,

    /**
     * txt,xls,go,java
     */
    fileTypeList?: string | string[],
    /**
     * md5计算
     */
    md5?: string,
}

export interface UploadFileModelConfig extends Omit<UploadModel, 'name' | 'size'> {


    /**
     * 文件大小
     */
    fileSizeType: FileSizeTypeEnum,

    /**
    * txt,xls,go,java
    * ['txt','go']
    */
    fileTypeList: string[] | string,

    /**
     * 文件上传大小设置
     */
    limit: number,
}

export interface UploadFileResult {
    // 文件名称
    name:string

    time:Date,
    // 上传路径
    uploadFileUrl:string,
    // 文件大小
    fileSize:number,

    url:string,

    fileSuffix:string,

    path:string,

    optionsParams:object
}

