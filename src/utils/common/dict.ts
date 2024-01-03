import type { SysDictSimpleResult } from '@/api/system/type'
import { useDictStore } from '@/stores/dict'
import type { ElementPlusInfoType } from '@/types/elementsPlus.d'
import { ref } from 'vue'



const dictStore = useDictStore()



export interface NumberValueType extends SysDictSimpleResult {
    value: number
}

export interface BoolValueType extends SysDictSimpleResult {
    value: boolean
}

export const getDictOptions = (dictType: string) => {
    return dictStore.getDictByType(dictType) || []
}

export const getIntDictOptions = (dictType: string): NumberValueType[] => {
    // 获得通用的 DictDataType 列表
    const dictOptions: SysDictSimpleResult[] = getDictOptions(dictType)

    // 转换成 number 类型的 NumberDictDataType 类型
    // why 需要特殊转换：避免 IDEA 在 v-for="dict in getIntDictOptions(...)" 时，el-option 的 key 会告警
    const dictOption: NumberValueType[] = []
    dictOptions.forEach((dict: SysDictSimpleResult) => {
        dictOption.push({
            ...dict,
            value: parseInt(dict.value + '')
        })
    })
    return dictOption
}

export const getStrDictOptions = (dictType: string) => {
    const dictOption: SysDictSimpleResult[] = []
    const dictOptions: SysDictSimpleResult[] = getDictOptions(dictType)
    dictOptions.forEach((dict: SysDictSimpleResult) => {
        dictOption.push({
            ...dict,
            value: dict.value + ''
        })
    })
    return dictOption
}

export const getBoolDictOptions = (dictType: string) => {
    const dictOption: SysDictSimpleResult[] = []
    const dictOptions: SysDictSimpleResult[] = getDictOptions(dictType)
    dictOptions.forEach((dict: SysDictSimpleResult) => {
        dictOption.push({
            ...dict,
            value: dict.value + '' === 'true'
        })
    })
    return dictOption
}

/**
 * 获取指定字典类型的指定值对应的字典对象
 * @param dictType 字典类型
 * @param value 字典值
 * @return DictDataType 字典对象
 */
export const getDictObj = (dictType: string, value: any): SysDictSimpleResult | undefined => {
    const dictOptions: SysDictSimpleResult[] = getDictOptions(dictType)
    for (const dict of dictOptions) {
        if (dict.value === value + '') {
            return dict
        }
    }
}

/**
 * 获得字典数据的文本展示
 *
 * @param dictType 字典类型
 * @param value 字典数据的值
 * @return 字典名称
 */
export const getDictLabel = (dictType: string, value: any): string => {
    const dictOptions: SysDictSimpleResult[] = getDictOptions(dictType)
    const dictLabel = ref('')
    dictOptions.forEach((dict: SysDictSimpleResult) => {
        if (dict.value === value + '') {
            dictLabel.value = dict.label
        }
    })
    return dictLabel.value
}


export enum DICT_TYPE {

    /****************system */
    USER_SEX = 'system_user_sex',

    /**
     * 数据状态
     */
    COMMON_DATA_STATUS = "system_data_status",

    /**
     * 消息模板类型
     */
    SYSTEM_NOTICE_TEMPLATE = "system_notice_template",

    /**
     * 系统模块
     */
    SYSTEM_MODULE = "system_module",

    /**
     * 操作类型
     */
    SYSTEM_OPERATION_TYPE = "system_operation_type",

    /**
     * 登录状态
     */
    SYSTEM_LOGIN_STATUS = "system_login_status",

    /**
     * 数据权限
     */
    SYSTEM_DATA_PERMISSION = "system_data_permission",

    
    /**
     * 实名||匿名
     */
    SYSTEM_TRAIN_REAL_TYPE = "system_train_real_type",


    /***************Train***************** */
    /**
     * 训练类型
     */
    BIZ_TRAIN_VIDEO_TYPE = "biz_train_video_type",
    /**
     * 警情训练等级
     */
    BIZ_TRIAN_VIDEO_LEVEL = "biz_train_video_leave",
    /**
     * 警情触发条件
     */
    BIZ_TRAIN_SWITCH_TYPE = "biz_train_switch_type",


}