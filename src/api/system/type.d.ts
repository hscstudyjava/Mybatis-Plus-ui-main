import { SimpleTree } from './type.d';

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

    userId: Number

    createDept: Number

    userName: String

    passWord: String

    userNickName: String

    telPhone: String

    userEmil: String

    createTime: Date

    updateTime: Date

    createBy: String

    updateBy: String

    sortValue: Number

    isDeleted: Number

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

    id: Number | String | null,

    parentId: Number | String | null,

    label: String,

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

    menuComponent?:String

    hasHidden?: boolean

    hasCache?: boolean

    hasFrame?: boolean

    status: String,

    sortValue: Number|String
}

export interface Captcha{

    activeProfile:string,

    open:boolean,

    result:string,

    base64Img:string,

    uuid:string
    
}