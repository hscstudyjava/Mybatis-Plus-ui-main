
export interface SysRole {

    roleId?: number | null,

    roleName: string,

    roleKey: string,

    isDeleted: boolean,

    status: string,

    createTime?: Date | null;

    updateTime?: Date | null;

    createBy: string,

    updateBy: string,

    remark: string,
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