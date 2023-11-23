
<script setup lang="ts">
// @ts-ignore
import ResizeMixin from './mixins/index'
const resizeMixin = ResizeMixin();// 应用minix

// @ts-ignore
import AppMain from './componets/AppMain.vue'
// @ts-ignore
import Sidebar from './componets/sidebar/index.vue'
// @ts-ignore
import navigation from './componets/navigation/index.vue'
// @ts-ignore
import sytleConstant from '@/assets/style/sytleConstant.module.scss'
const variable = sytleConstant;


// @ts-ignore
import { useSettingStore } from '@/stores/setting'
import { useAppStore } from '@/stores/app';
import { DeviceEnum } from '@/utils/constants/SystemConstants';
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
const moddileDevice = DeviceEnum.MOBILE;//手机模式

const setting = useSettingStore();
const { themeColor, sideTheme, tagsView, fixedHeader } = storeToRefs(setting)

const appStore = useAppStore();
const { device } = storeToRefs(appStore)
const { sibebar } = storeToRefs(appStore)

var classObj = computed(() => {
    return {
        hideSidebar: !sibebar.value.open,
        openSidebar: sibebar.value.open,
        withoutAnimation: sibebar.value.withoutAnimation,
        mobile: device.value === moddileDevice
    }
})

/** 
 * 关闭侧边栏
 */
const handlerOutSidear = () => {
    appStore.CLOSE_SIDEBAR(false)
}
</script>

<template>
    <div>
        <div :class="classObj" class="app-wrapper" :style="{ '--current-color': themeColor }">
            <div v-if="device === moddileDevice && sibebar.open" class="drawer-bg" @click="handlerOutSidear" />
            <sidebar v-if="!sibebar.hide" class="sidebar-container" />

            <div :class="{ hasTagsView: tagsView, sidebarHide: sibebar.hide }" class="main-container">

                <div :class="{ 'fixed-header': fixedHeader }">
                    <!-- 头部导航栏 -->
                    <navigation />
                    <!-- <tags-view v-if="needTagsView" /> -->
                </div>

                <app-main />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
// @import '@/assets/style/sytleConstant.module.scss';
@import '@/assets/style/mixin.scss';
@import '@/assets/style/sidebar.scss';

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
