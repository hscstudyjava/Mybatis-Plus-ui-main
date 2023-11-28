// 类型文件
export interface Meta {
    title: String?= null

    icon: String?= null

    keepAlive: Boolean = false;

    hasFrame: Boolean?= null
}

export type Menu = {

    id: String?= null

    path: String?= null

    component: String?= null

    name: Boolean?= null

    hidden: Boolean?= null

    meta: Meta?= null

    query: String?= null

    children: List<Menu>?= null

}



