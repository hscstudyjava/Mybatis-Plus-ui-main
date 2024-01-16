export interface BaseEnity {

    createTime?: Date,

    updateTime?: Date,

    /**
     * 默认设置ID
     */
    createBy?: string,

    /**
     * 默认设置ID
     */
    updateBy?: string,

    isDeleted?: number

}

export interface BaseDeptEntity extends BaseEnity {

    /**
     * 创建部门
     */
    createDept?: string,

    /**
     * 更新部门
     */
    updateDept?: string

    /**
     * 扩展参数
     */
    optionsParams?: object

    /**
     * 备注
     */
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

export type IdType = string | number | string[] | number[]
