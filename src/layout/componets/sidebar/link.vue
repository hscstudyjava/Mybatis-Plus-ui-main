<template>
    <component :is="linkType" v-bind="linkProps(to)">
        <slot></slot> <!-- 插槽出口 -->
    </component>
</template>
  
<script setup lang="ts">
// @ts-ignore
import { isExternal } from '@/utils/verify/index';
import { computed } from 'vue';
const props = defineProps<{
    // 跳转_link
    to:string
}>();


const isExternals=computed(():boolean=>{
    return isExternal(props.to)
})


const linkType=computed(():string=>{
    if(isExternals){
        return 'a'
    }
    return 'router-link'
})

const linkProps=(to:String):any=>{
    if(isExternals){
        return {
          href: to,
          target: '_blank',
          rel: 'noopener'
        }
    }else{
        to:to
    }
}

</script>
  
<style lang="scss"></style>