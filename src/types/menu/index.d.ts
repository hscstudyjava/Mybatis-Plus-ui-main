// 类型文件
export interface MenuItems{
    /**
     * icon
     */
    icon:string,
    /**
     * 标题
     */
    title:string
}

type Menu={


    /**
     * 子集
     */
    children?:Array<Menu>

    /**
     * 元数据
     */
    meta?:MenuItems,

    /**
     * 请求路径
     */
    path:String,

    /**
     * 是否隐藏
     */
    hidden?:Boolean|false,

    /**
     * 是否需要
     */
    alwaysShow:Boolean|false,

}



