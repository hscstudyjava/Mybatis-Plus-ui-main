import { request } from "@/utils/request";
import type { AjaxResult } from "@/utils/request/type";
import type { SysStorage, SysStorageValue, UploadFileResult, UploadModel } from "../type";


/**
 * 基础Url
 */
const baseUrl = "/admin-api/file/operation/"


/** 
 * 拉取上传路径
 */
export const getUploadFileUrl = async (data: UploadModel): Promise<AjaxResult<UploadFileResult>> => request.post(baseUrl + 'upload/file', data)