interface BaseEnity {

    id: string | number | any

    createTime?: Date | any | string;

    updateTime?: Date | any | string;

    createBy?: string | number,

    updateBy?: string | number,

    isDeleted?: number | string | boolean | any

    remark?: string

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


/**
 * 动态表达配置
 */
export interface DynamicFromFild {

    /**
     * 表单标题
     */
    label: string,



    /**
     * 表单类型
     */
    type: string,

    /**
     * 绑定属性
     */
    prop: string,

    /**
     * 是否必填
     */
    required?: boolean,

    /**
     * 表单Icon
     */
    icon?: string,

    /**
     * order
     */
    order?: number,

    /**
     * 扩展属性
     */
    options?: [],

    /**
 * 表单介绍
 */
    remark?: string,

}