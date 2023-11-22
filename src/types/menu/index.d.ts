// 类型文件
type MenuItems={
    /**
     * icon
     */
    icon?:String,
    /**
     * 标题
     */
    title?:String
}

type Menu={


    /**
     * 子集
     */
    children:Array<Menu>

    /**
     * 元数据
     */
    meta:MenuItems,

    /**
     * 请求路径
     */
    path:String,

    /**
     * 是否隐藏
     */
    hidden:Boolean,

    /**
     * 是否需要
     */
    alwaysShow:Boolean,

}

export default{

    MenuItems,

    Menu
}

