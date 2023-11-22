<template>
    <div v-if="!item.hidden">
        <template v-if="hasOneShowingChild(item.children, item)
            && (!onlyOneChild.children || onlyOneChild.noShowingChildren) && !item.alwaysShow">
            <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path, onlyOneChild.query)">
                <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{ 'submenu-title-noDropdown': !isNest }">
                    <item :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)" :title="onlyOneChild.meta.title" />
                </el-menu-item>
            </app-link>
        </template>

        <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
            <template v-slot:title>
                <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
            </template>
            <sidebar-item v-for="child in item.children" :key="child.path" :is-nest="true" :item="child"
                :base-path="resolvePath(child.path)" class="nest-menu" />
        </el-submenu>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, type PropType } from 'vue'
// @ts-ignore
import type { Menu } from '@/types/menu';
// @ts-ignore
import path from 'path'
import { isExternal } from '@/utils/verify/index';
const subItemProp = defineProps({

    /** 
     * 当前Item
     */
    item: Object as PropType<Menu>,

    /** 
     * 基础路径
     */
    baseUrl: {
        type: String,
        default: ''
    },

    /** 
     * 是否嵌套
     */
    isNest: Boolean
})
/** 
 * 只有一个item
 */
var onlyOneChild: Menu = null

/** 
 * 是否只有一个Menu
 */
const hasOneShowingChild = (children: Array<Menu>, parent: Menu): Boolean => {

    if (!children) {
        children = []
    }

    const showingChildren = children.filter((item: Menu) => {
        if (item.hidden) {
            return false
        } else {
            onlyOneChild = item
            return true
        }
    })

    //当只有一个子路由器时，默认显示该子路由器
    if (showingChildren.length == 1) {
        return true
    }

    //如果没有要显示的子路由器，则显示父路由器
    if (showingChildren.length == 0) {
        onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return true
    }

    return false
}

const resolvePath = (routePath: string, routeQuery?: string) => {
    if (isExternal(routePath)) {
        return routePath
    }

    if (isExternal(subItemProp.baseUrl.valueOf())) {
        return subItemProp.baseUrl.valueOf()
    }
    if (routeQuery) {
        let query = JSON.parse(routeQuery);
        return { path: path.resolve(subItemProp.baseUrl.valueOf(), routePath), query: query }
    }
    return path.resolve(subItemProp.baseUrl.valueOf(), routePath)
}
</script>

<style lang="scss" scoped></style>
