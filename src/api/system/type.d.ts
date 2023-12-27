import { SimpleTree, BaseEnity, SysDept } from './type.d';
interface BaseEnity {

    id: string | number | any

    createTime?: Date | any | string;

    updateTime?: Date | any | string;

    createBy?: string | number,

    updateBy?: string | number,

    isDeleted?: number | string | boolean | any

    remark?: string

}

export interface SysRole {

    roleId?: number | null,

    roleName: string,

    roleKey: string,

    isDeleted: number,

    status: string,

    createTime?: Date | null;

    updateTime?: Date | null;

    createBy: string,

    updateBy: string,

    remark: string,

    sortValue: Number
}



export interface SysUser {

    userId?: number

    createDept?: number

    userName: string

    passWord: string

    userNickName: string

    telPhone: string

    userEmil: string

    createTime?: Date

    updateTime?: Date

    createBy?: String

    updateBy?: String

    sortValue: number

    sex: String
}

export interface Page<T> {

    /**
     * 总条数
     */
    totalRow: number;

    /**
     * 数据
     */
    records: Array<T>,

    /**
    * 条数
    */
    totalPage: number

}

export interface Page<T> {

    /**
     * 分页条数
     */
    pageNumer: number;

    /**
     * 分页值
     */
    pageSize: number


}

/**
 * 通用简化树形结构
 */
export interface SimpleTree<T> {

    id: number | string | null,

    parentId: number | string | null,

    label: string,

    children: Array<T>
}

export interface BaseEnity {

    createTime: Date,

    updateTime: Date,

    /**
     * 默认设置ID
     */
    createBy: String,

    /**
     * 默认设置ID
     */
    updateBy: String,

    isDeleted: Number

}


export interface SysPermisson extends SimpleTree<SysPermisson> {

    permissionName: String,

    permissionValue: String,

    permissionType: String,

    menuIcon: String,

    menuPath: String,

    menuParam: String

    menuComponent?: String

    hasHidden?: boolean

    hasCache?: boolean

    hasFrame?: boolean

    status: String,

    sortValue: Number | String
}

export interface Captcha {

    activeProfile: string,

    open: boolean,

    result: string,

    base64Img: string,

    uuid: string

}

export interface SysDept extends BaseEnity, SimpleTree<SysDept> {

    deptName: string,

    leader: string

    email: string

    phoneNumber: string

    fullChinesePinyin?: string

    simpleChinesePinyin?: string

    status: string

    sortValue: number
}


export interface SysConfig extends BaseEnity, SimpleTree<SysConfig> {

    configName: string,

    configKey: string

    configValue: string

    configType: string

    sortValue: number
}


/**
 * 
 */
export interface SysNoticeTemplate extends BaseEnity {
    /**
        * 通知消息主键
        */
    templateTitle: string,

    /**
     * 模板内容
     */
    templateContext: string

    /**
     * 模板编码
     */
    templateCode: string

    /**
     * 详情可见字典数据
     */
    templateType: string

    /**
     * 发送人员名称
     */
    nickName: string

    /**
     * 模板参数数组
     */
    templateParams: string | Array<string>,

    /**
     * 状态
     */
    status: String

    /**
     * 备注
     */
    remark: string


}


/** 
 * 字典类型
 */

export interface SysDictType extends BaseEnity {

    id: number | string,

    title: string,

    key: string,

    type: string,


    sortValue: number,

    /**
     * 状态
     */
    status: String

    /**
     * 备注
     */
    remark: string

    /**
     * 扩展参数
     */
    optionsParams: string | object,

}

export interface SysDictValue extends BaseEnity {

    id: number | string,

    typeId: number | string,

    label: string,

    key: string,

    value: string,

    icon: string,

    btnClass: string,

    customStyle: string,

    hasDefault: string,

    sortValue: number,

    /**
     * 状态
     */
    status: string

    /**
     * 备注
     */
    remark: string

    /**
     * 扩展参数
     */
    optionsParams: string | object,

}

export type SysDictSimpleResult = {
    label: string,

    key: string,

    value: string | boolean | number,

    icon: string,

    btnClass: string,

    customStyle: string,

    hasDefault: boolean,
}

export type SysGroupSimpleValueResult = {

    key: string,

    list: Array<SysDictSimpleResult>

}

export interface SysPost {

    id?: number

    postName?: string

    postCode?: string

    status?: string

    sortValue?: number

}

// 操作日志
export interface SysOperatorLog {

    id: number;

    operatorType: number;

    operateTitle: string;

    businessType: string;

    operateIp: string;

    operateAddress: string;

    operateMethod: string;

    operateUserName: string;

    requestMethod: string;

    requestParams: string;

    requestUrl: string;

    responseParams: string;

    status: string;

    errorMsg: string;

    operateTime: string;

    timeStamp: number;
}


export interface SysLoginLog {
    id?: number

    userName: string 

    ipAddr: string

    ipLocation: string

    status: string

    msg: string

    browser: string 

    os: string

    hasMobile: boolean

    createTime?: Date

}