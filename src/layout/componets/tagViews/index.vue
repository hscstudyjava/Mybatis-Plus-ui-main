<script lang='ts' setup>
import { nextTick, onMounted, onUnmounted, reactive, ref, toRefs, unref, watch } from 'vue';
import type { Menu } from "@/types/menu";
import { useViewsStore } from '@/stores/tagViews'
import { useSettingStore } from '@/stores/setting';
import { usePeriStroe } from '@/stores/permission'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter, createRouter, type RouteLocation } from 'vue-router';
import scrollPane from './ScrollPane.vue'
import path from 'path-browserify'; // 引入 path-browserify 或 path-browserify-es6


// 注册一下Vue-Router
const route = useRoute();
const router = useRouter();

// 使用storeRef
const useView = useViewsStore()
const useSetting = useSettingStore()
const usePeri = usePeriStroe()

const { visitedViews } = storeToRefs(useView)
const { themeColor } = storeToRefs(useSetting)
const { routes } = storeToRefs(usePeri)

//------------------------基础模板-------------------------------------------------
const visible = ref(false)
const top = ref(0)
const left = ref(0)
// @ts-ignore
const selectedTag = ref<Menu>({})
let affixTags = ref<Menu[]>([])

// 定义ref组件
const tag = ref()
const scrollPaneRef = ref()

// 获得当前router_path
const isActive = (view: Menu): boolean => {
    return route.path === view.path
}
// 激活样式
const activeStyle = (tag: Menu) => {
    if (!isActive(tag)) return {};
    return {
        "background-color": themeColor,
        "border-color": themeColor
    }
}
// 是否固定?
const isAffix = (tag?: Menu) => {
    return tag?.meta && tag?.meta.affix
}

// 是否第一个View
const isFirstView = (): boolean => {
    try {
        // @ts-ignore
        return selectedTag.fullPath === visitedViews[1].fullPath || selectedTag.fullPath === '/index'
    } catch {
        return false
    }
}
// 最后一个view
const isLastView = (): boolean => {
    try {
        // @ts-ignore
        return selectedTag.fullPath === visitedViews[visitedViews.length - 1].fullPath
    } catch (err) {
        return false
    }
}

// 过滤全部为固钉View
const filterAffixTags = (routes: Menu[], basePath = "/") => {
    let tags: Menu[] = []
    routes.forEach(route => {
        if (route.meta && route.meta.affix) {

            // @ts-ignore
            const tagPath = path.resolve(import.meta.env.BASE_URL, basePath, route.path)

            tags.push({
                // @ts-ignore
                fullPath: tagPath,
                path: tagPath,
                name: route.name,
                meta: { ...route.meta }
            })
        }

        if (route.children) {
            const tempTags = filterAffixTags(route.children, route.path)
            if (tempTags.length >= 1) {
                tags = [...tags, ...tempTags]
            }
        }

    })
    return tags

}

const initTags = () => {
    // @ts-ignore
    const tags = affixTags = filterAffixTags(routes.value)
    for (const tag of tags) {
        // Must have tag name
        if (tag.name) {
            useView.addVisitedView(tag)
        }
    }
}
const addTags = () => {
    // 解构数据
    const { name } = toRefs(route)
    if (name) {
        useView.addView(route as unknown as Menu)
        // todo 后续新增Ifrem暂时不开发!!!
    }
    return false
}

const moveToCurrentTag = async () => {
    await nextTick()// 等待下次dom拉取
    // @ts-ignore
    for (const item of unref(tag)) {
        // @ts-ignore
        if (item.to.path === route.path) {
            unref(scrollPaneRef).moveToTarget(item)
            closeMenu()
            // @ts-ignore
            if (item.to.fullPath !== item.fullPath) {
                useView.updateVisited(route as unknown as Menu)
            }
        }
    }
}

// 刷新页签
const refreshSelectedTag = async (view: Menu) => {
    await useView.delCachedView(view)
    const { path, query, matched } = route;
    if (view === undefined) {
        matched.forEach((m) => {
            if (m.components && m.components.default && m.components.default.name) {
                if (!['Layout', 'ParentView'].includes(m.components.default.name)) {
                    // @ts-ignore
                    view = { name: m.components.default.name, path: path, query: query };
                }
            }
        });
    }
    // @ts-ignore
    const { fullPath } = view
    await nextTick();
    router.replace({
        path: '/redirect' + fullPath
    })
}
// 删除选择页签
const closeSelectedTag = async (view: Menu) => {
    // @ts-ignore
    const { visitedViews } = await useView.delView(view);
    if (isActive(view)) {
        toLastView(visitedViews, view)
    }
}

const toLastView = (visited: Menu[], view?: Menu) => {
    const latestView = visited.slice(-1)[0]
    if (latestView) {
        router.replace({

            path: latestView.fullPath
        })
    } else {
        // if(view.name==="Layout"|| view==="ParentView")
        if (view.name === 'Dashboard') {
            router.replace({
                path: '/redirect' + view.fullPath
            })
        } else {
            router.push('/')
        }
    }
    // todo 无法监听滑轨 暂时使用触发这个函数直接关闭掉
}

const cloaseRightTags = async () => {
    const vRight = await useView.delRight(selectedTag)
    // @ts-ignore
    if (!vRight.find(i => i.fullPath === route.fullPath)) {
        // @ts-ignore
        toLastView(vRight)
    }
}
const closeLeftTags = async () => {
    const vleft = await useView.delLeft(selectedTag)
    // @ts-ignore
    if (!vleft.find(i => i.fullPath === route.fullPath)) {
        // @ts-ignore
        toLastView(vleft)
    }
}

const closeOthersTags = async () => {
    router.push(selectedTag as unknown as RouteLocation).catch(() => { })
    await useView.delOthersViews(selectedTag)
    moveToCurrentTag()
    // 
}

const closeAllTags = async (view: Menu) => {
    // @ts-ignore
    const { visitedViews } = await useView.delAllViews(view)
    if (affixTags.value?.some(tag => tag.path === route.path)) {
        return
    }
    toLastView(visitedViews, view)
}

const tagContainerRef = ref()

/** 
 * Vue3 $el 为什么不存在
 * 1. 因为Tmeplate 不需要存在一个根元素
 * 2. 需要获得通过Ref获得组件
 */
const openMenu = (tag: Menu, e: any) => {

    const menuMinWidth = 10
    // 修改监听scrollPaneRef
    const offsetLeft = unref(tagContainerRef).getBoundingClientRect().left // container margin left
    const offsetWidth = unref(tagContainerRef).eloffsetWidth // container width
    const maxLeft = offsetWidth - menuMinWidth // left boundary
    const lefts = e.clientX - offsetLeft + 15 // 15: margin right
    if (lefts > maxLeft) {
        left.value = maxLeft
    } else {
        left.value = lefts
    }

    top.value = e.clientY
    visible.value = true
    // @ts-ignore
    selectedTag.value = tag
}
const closeMenu = () => {
    visible.value = false
}
const handleScroll = () => {
    closeMenu()
}

// 全局点击事件处理函数
const handleGlobalClick = (e) => {
    if (!unref(tagContainerRef).contains(e.target)) {
        closeMenu();
    }
};

// 在组件挂载时添加全局点击事件监听
onMounted(() => {
    document.addEventListener('click', handleGlobalClick);
});

// 组件卸载时移除全局点击事件监听
onUnmounted(() => {
    document.removeEventListener('click', handleGlobalClick);
});
onMounted(() => {
    initTags()
    addTags()
})

watch(
    () => route.path,
    () => {
        addTags()
        moveToCurrentTag()
    }
)

// 暴漏给子元素
defineExpose({
    tag
})
</script>

<template>
    <div id="tags-view-container" ref="tagContainerRef" class="tags-view-container">
        <scroll-pane ref="scrollPaneRef" class="tags-view-wrapper" @scroll="handleScroll">
            <router-link v-for="tag in visitedViews" ref="tag" :key="tag.path" :class="isActive(tag) ? 'active' : ''"
                :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }" tag="span" class="tags-view-item"
                :style="activeStyle(tag)" @click.middle.native="!isAffix(tag) ? closeSelectedTag(tag) : ''"
                @contextmenu.prevent.native="openMenu(tag, $event)">
                {{ tag.title }}
                <svg-icon icon="ep:close" v-if="!isAffix(tag)" @click.prevent.stop="closeSelectedTag(tag)" />
            </router-link>
        </scroll-pane>
        <ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
            <li @click="refreshSelectedTag(selectedTag)"><svg-icon icon="ep:refresh-right"></svg-icon> 刷新页面</li>
            <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">
                <svg-icon icon="ep:close"></svg-icon> 关闭当前
            </li>
            <li @click="closeOthersTags">
                <svg-icon icon="ep:circle-close"></svg-icon>
                关闭其他
            </li>
            <li v-if="!isFirstView()" @click="closeLeftTags">
                <svg-icon icon="ep:back"></svg-icon>

                关闭左侧
            </li>
            <li v-if="!isLastView()" @click="cloaseRightTags"><svg-icon icon="ep:right"></svg-icon> 关闭右侧</li>
            <li @click="closeAllTags(selectedTag)"><svg-icon icon="ep:circle-close"></svg-icon> 全部关闭</li>
        </ul>
    </div>
</template>
<style lang="scss" scoped>
.tags-view-container {
    height: 34px;
    width: 100%;
    background: var(--el-bg-color);
    border-bottom: 1px solid var(--el-border-color);
    box-shadow: var(--el-box-shadow);

    .tags-view-wrapper {
        .tags-view-item {
            display: inline-block;
            position: relative;
            cursor: pointer;
            height: 26px;
            line-height: 26px;
            border: 1px solid #d8dce5;
            color: #495060;
            background: #fff;
            padding: 0 8px;
            font-size: 12px;
            margin-left: 5px;
            margin-top: 4px;

            &:first-of-type {
                margin-left: 15px;
            }

            &:last-of-type {
                margin-right: 15px;
            }

            &.active {
                background-color: #42b983;
                color: #fff;
                border-color: #42b983;

                &::before {
                    content: '';
                    background: #fff;
                    display: inline-block;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    position: relative;
                    margin-right: 2px;
                }
            }
        }
    }

    .contextmenu {
        margin: 0;
        background: #fff;
        z-index: 3000;
        position: absolute;
        list-style-type: none;
        padding: 5px 0;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 400;
        color: #333;
        box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);

        li {
            margin: 0;
            padding: 7px 16px;
            cursor: pointer;

            &:hover {
                background: #eee;
            }
        }
    }
}
</style>

<style lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
    .tags-view-item {
        .el-icon-close {
            width: 16px;
            height: 16px;
            vertical-align: 2px;
            border-radius: 50%;
            text-align: center;
            transition: all .3s cubic-bezier(.645, .045, .355, 1);
            transform-origin: 100% 50%;

            &:before {
                transform: scale(.6);
                display: inline-block;
                vertical-align: -3px;
            }

            &:hover {
                background-color: #b4bccc;
                color: #fff;
            }
        }
    }
}
</style>
