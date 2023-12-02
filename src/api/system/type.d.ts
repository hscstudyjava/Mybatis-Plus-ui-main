
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

    sortValue:Number
}


export interface SysUser{

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