<template>
    <template v-if="!item.hidden">

        <template v-if="hasOneShowingChild(item.children, item)
            && (!onlyOneChild.children || onlyOneChild.noShowingChildren)
            && !item.alwaysShow">
            <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">

                <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{ 'sub-menu-title-noDropdown': !isNest }">
                    <!-- reader icon -->
                        <icon :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"
                        :title="onlyOneChild.meta.title" />
                </el-menu-item>
            </app-link>
        </template>

        
        <el-sub-menu v-else ref="subMenu" :index="resolvePath(item.path)" teleported>
            <template #title>
                <icon v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
            </template>
            <!--    :base-path="resolvePath(child.path)"  class="nest-menu" -->
            <sub-item 
                v-for="child in item.children" 
                :key="child.path" 
                :isNest="true" 
                :item="child"
                :baseUrl="resolvePath(child.path)"
                 />
        </el-sub-menu>

    </template>
</template>

<script lang="ts" setup>
import { onMounted, type PropType } from 'vue'
// @ts-ignore
import type { Menu } from '@/types/menu';
import appLink from './link.vue'
import icon from './icon.vue'
import { type RouteRecordRaw } from 'vue-router'
import path from 'path-browserify'; // 引入 path-browserify 或 path-browserify-es6

import { isExternal } from '@/utils/verify/index';
import router from '@/router';
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
var onlyOneChild: any = null

/**
 * 是否只有一个Menu
 */
const hasOneShowingChild = (children: Array<Object>, parent: Object): Boolean => {
    if (!children) {
        children = []
    }

    const showingChildren = children.filter((item: any) => {

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
        return routePath;
    }

    if (isExternal(subItemProp.baseUrl.valueOf())) {
        return subItemProp.baseUrl.valueOf();
    }

    if (routeQuery) {
        let query=JSON.parse(routeQuery)
        return { path: path.resolve(import.meta.env.BASE_URL, subItemProp.baseUrl, routePath), query: query }
    }
 
    return path.resolve(import.meta.env.BASE_URL, subItemProp.baseUrl, routePath)
};
</script>

<style lang="scss" scoped></style>
