import { string } from 'vue-types';
import type { RouteRecordRaw } from 'vue-router'
import { defineComponent } from 'vue'
// 类型文件
export interface Meta extends Record<string | number | symbol, unknown> {
    title?:string

    icon?:string

    keepAlive?:boolean

    hasFrame?:boolean
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
    keepAlive?: boolean
}

export interface Menu extends Omit<RouteRecordRaw, 'meta'> {

    id?: string

    path: string

    component: string | Component

    name: string

    hidden?: boolean

    meta?: Meta

    query?: string

    children?: Menu[]

    redirect?: string

}



