import { request } from "@/utils/request";
import type { AjaxResult } from "@/utils/request/type";
import type { SysStorage, SysStorageValue, uploadModel } from "../type";


/**
 * 基础Url
 */
const baseUrl = "/admin-api/file/operation/"


/** 
 * 拉取上传路径
 */
export const getUploadFileUrl = async (data: uploadModel): Promise<AjaxResult<string>> => request.post(baseUrl + 'upload/file', data)