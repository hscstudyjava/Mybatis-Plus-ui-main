<script lang='ts' setup>
import { useSettingStore } from '@/stores/setting';
import { storeToRefs } from 'pinia';
import { reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
// @ts-ignore
import { dynamicTitle as titleUtil } from '@/hooks/web/dynamicTitle/index';
const route = useRoute() // 路由
//------------------------基础模板-------------------------------------------------
// 是否打开侧边配置
defineOptions({
    name: 'settingView'
})
const useStting = useSettingStore()

// 将 isDark 转换为响应式对象
const { dynamicTitle, sidebarLogo ,fixedHeader,watermark,watermarkContext,topNav,tagsView} = storeToRefs(useStting)

const visit = ref(false)

const changeDynamicTitle = () => {
    useStting.setDynamicTitle(dynamicTitle.value)
    if (dynamicTitle.value) {
        titleUtil(route.meta.title as string)
    } else {
        titleUtil(undefined)
    }
}

const changeSidebarLogo = () => {
    useStting.setSidebarLogo(sidebarLogo.value)
}

const changefixedHeader=()=>{
    useStting.setfixedHeader(fixedHeader.value)
}
const changeWatermark=()=>{
    useStting.setWaterMark(watermark.value)
}
const changeTopNav=()=>{
    useStting.setTopNav(topNav.value)
}
const changeTagsViews=()=>{
    useStting.setTagsView(tagsView.value)

}



</script>
<template>
    <el-tooltip class="box-item" effect="dark" content="系统配置" placement="bottom">
        <svg-icon icon="ep:tools" @click="visit = !visit"></svg-icon>
    </el-tooltip>

    <el-drawer v-model="visit" :z-index="4000" size="350" direction="rtl">
        <template #header>
            <span class="text-16px font-700">系统配置</span>
        </template>
        <div class="text-center">
            <!-- -->
            <el-divider>
                主题
            </el-divider>

            <ThemeSwitch />

            <el-divider>
                系统布局配置
            </el-divider>
            <div class="flex items-center justify-between">
                <span class="text-14px">动态标题</span>
                <ElSwitch v-model="dynamicTitle" @change="changeDynamicTitle" />
            </div>
            <div class="flex items-center justify-between">
                <span class="text-14px">显示Logo</span>
                <ElSwitch v-model="sidebarLogo" @change="changeSidebarLogo" />
            </div>
            <div class="flex items-center justify-between">
                <span class="text-14px">固定标头</span>
                <ElSwitch v-model="fixedHeader" @change="changefixedHeader" />
            </div>   
            
            <div class="flex items-center justify-between">
                <span class="text-14px">显示水印</span>
                <ElSwitch v-model="watermark" @change="changeWatermark" />
            </div>  
            
            <div class="flex items-center justify-between">
                <span class="text-14px">顶级导航</span>
                <ElSwitch v-model="topNav" @change="changeTopNav" />
            </div>

            <div class="flex items-center justify-between">
                <span class="text-14px">显示标签</span>
                <ElSwitch v-model="tagsView" @change="changeTagsViews" />
            </div>


        </div>

    </el-drawer>
</template>

<style lang='scss' scoped></style>