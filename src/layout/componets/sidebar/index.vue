<template>
    <div :class="{ 'has-logo': isLogo }"
        :style="{ backgroundColor: settingStore.sideTheme === 'theme-dark' 
        ? variables.menuBackground : variables.menuLightBackground }">
        <logo v-if="isLogo" :collapse="!sibebarOpen" />
        <el-scrollbar :class="settingStore.sideTheme" wrap-class="scrollbar-wrapper">
            <el-menu :default-active="activeMenu" 
                :collapse="!sibebarOpen"
                :background-color="settingStore.sideTheme === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground"
                :text-color="settingStore.sideTheme === 'theme-dark' ? variables.menuColor : variables.menuLightColor"
                :unique-opened="true" 
                :active-text-color="settingStore.themeColor"
                 :collapse-transition="false"
                  mode="vertical">
                <!-- <span>{{ routerList }}</span> -->
                <sub-item v-for="(route, index) in routerList" 
                :key="route.path + index" 
                :item="route"
                :baseUrl="route.path"/>
            </el-menu>
        </el-scrollbar>
    </div>
</template>

<script lang="ts" setup>
import { computed, onMounted ,reactive} from 'vue'
import { useSettingStore } from '@/stores/setting';
import { useAppStore } from '@/stores/app';
// @ts-ignore
import sytleConstant from '@/assets/style/sytleConstant.module.scss'
import { usePeriStroe } from '@/stores/permission';
// components 
// @ts-ignore
import logo from './logo.vue';
// @ts-ignore
import SubItem from './subItem.vue';
/** 
 * 基础配置
 */
const settingStore = useSettingStore()
const appStore = useAppStore()
const usePri=usePeriStroe()
// import router from '@/router';
import router from '@/router';
const route = router;

// var routerList=router.options.routes
var routerList=usePri.sidebarRouters

/** 
 * 激活菜单
 */
const activeMenu = computed(() => {
    let currentRoute=route.currentRoute;
        
    const { meta, path } = currentRoute.value;
    if (meta.activeMenu) {
        return meta.activeMenu
    }
    return path
})
/** 
 * 样式变量
 */
const variables = sytleConstant
/** 
 * 侧边栏是否打开
 */
const sibebarOpen = computed(()=>{return appStore.sibebar.open})

/** 
 * 是否展示log
 */
const isLogo = computed(()=>{return settingStore.sidebarLogo})

</script>
 