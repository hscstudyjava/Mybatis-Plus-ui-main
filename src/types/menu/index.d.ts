import { string } from 'vue-types';
import type { RouteRecordRaw } from 'vue-router'
import { defineComponent } from 'vue'
// 类型文件
export interface Meta extends Record<string | number | symbol, unknown> {
    title?:string

    icon?:string

    keepAlive?:boolean

    hasFrame?:boolean

    /********权限********** */
    premissions?:string[],

    /**********那个角色************ */
    roles?:string[],

    /************激活那个菜单***** */
    activeMenu?:string,

    affix?:boolean

}

type Component<T = any> =
    | ReturnType<typeof defineComponent>
    | (() => Promise<typeof import('*.vue')>)
    | (() => Promise<T>)



interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta'> {
    name: string

    meta?: Meta

    component?: Component | string

    children?: AppRouteRecordRaw[]

    props?: Recordable

    fullPath?: string

    keepAlive?: boolean,

    hidden?: boolean

}

export interface Menu extends Omit<RouteRecordRaw, 'meta'> {

    id?: string

    path: string

    component: string | Component

    name: string

    meta?: Meta

    query?: string

    children?: Menu[]

    redirect?: string,

    hidden?: boolean


}



