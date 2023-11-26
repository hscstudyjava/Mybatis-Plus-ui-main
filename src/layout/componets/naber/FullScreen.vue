<!-- 全屏 -->
<template>
    <!-- 判断是否支持全屏 -->
    <div class="screenFull-container screenFull-warpper" :class="{
        hidden: !isEnabled
    }">
        <el-icon v-if="isScreenfull" >
            <el-tooltip class="box-item" effect="dark" content="展开全屏" placement="bottom">
                <svg-icon iconClass="screenFull" @click="toggleScreen"></svg-icon>
            </el-tooltip>
        </el-icon>
        <el-icon v-else>
            <el-tooltip class="box-item" effect="dark" content="取消全屏" placement="bottom">
                <svg-icon iconClass="cancelFullScreen" @click="toggleScreen"></svg-icon>
            </el-tooltip>
        </el-icon>
    </div>

    <!-- 非全屏 -->
</template>

<script setup lang="ts">
import screenfull from "screenfull";
import { computed, ref } from "vue";


const isScreenfull = ref<Boolean>(true)
/** 
 * 是否允许展开全屏幕
 */
const isEnabled = computed(() => screenfull.isEnabled)

const toggleScreen = () => {
    isScreenfull.value = screenfull.isFullscreen
    if (screenfull.isEnabled) {
        screenfull.toggle()
    }
}
</script>

<style lang="scss" scoped>
.screenFull-container {
    display: inline-block; //
 
    // 隐藏掉icon 不允许展开
    .hidden {
        display: none;
    }
}
</style>