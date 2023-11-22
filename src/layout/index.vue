
<script setup lang="ts">
// @ts-ignore
import ResizeMixin from './mixins/index'
const resizeMixin = ResizeMixin();// 应用minix

// @ts-ignore
import AppMain from './componets/AppMain.vue'
// @ts-ignore
import Sidebar from './componets/sidebar/index.vue'

// @ts-ignore
import sytleConstant from '@/assets/style/sytleConstant.module.scss'
const variable = sytleConstant;


// @ts-ignore
import { useSettingStore } from '@/stores/setting'
import { useAppStore } from '@/stores/app';
const appStore = useAppStore();
const setting = useSettingStore()

const theme = setting.themeColor
const sideTheme = setting.sideTheme
const sidebar = appStore.sibebar
const device = appStore.device
const needTagsView = setting.tagsView;
const fixedHeader = setting.fixedHeader

const classObj = {
    hideSidebar: sidebar.open,
    openSidebar: sidebar.open,
    withoutAnimation: sidebar.withoutAnimation,
    mobile: device
}

/** 
 * 关闭侧边栏
 */
const handlerOutSidear = () => {
    appStore.CLOSE_SIDEBAR(false)
}
</script>

<template>
    <div>
        <div :class="classObj" class="app-wrapper" :style="{ '--current-color': theme }">
            <div v-if="device === 'mobile' && sidebar.open" class="drawer-bg" @click="handlerOutSidear" />
            <sidebar v-if="!sidebar.hide" class="sidebar-container" />
            <div :class="{ hasTagsView: needTagsView, sidebarHide: sidebar.hide }" class="main-container">
                <!--  <div :class="{ 'fixed-header': fixedHeader }">
                    <navbar />
                    <tags-view v-if="needTagsView" />
                </div> -->
                <app-main />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/style/sytleConstant.module.scss';
@import '@/assets/style/mixin.scss';

.app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar {
        position: fixed;
        top: 0;
    }
}

.drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
}

.fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$base-sidebar-width});
    transition: width 0.28s;
}

.hideSidebar .fixed-header {
    width: calc(100% - 54px);
}

.sidebarHide .fixed-header {
    width: 100%;
}

.mobile .fixed-header {
    width: 100%;
}
</style>
