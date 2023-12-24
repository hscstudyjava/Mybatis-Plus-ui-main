<script setup lang="ts">


defineOptions(
    {
        
    }
)
/** 
 * props
 */
const props=withDefaults(
    defineProps<{

        // v-model需要暴漏给调用方数据
        modelValue:string|number|boolean,
        // open|close相应内容
        openColor:string,
        // 关闭颜色
        closeColor:string,
        // 开启字符
        openText:string,
        // 关闭字符
        closeText:string

    }>(),
    {}
)

</script>


<template>


</template>



<style lang="scss" scoped>

</style> 