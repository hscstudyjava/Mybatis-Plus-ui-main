<template>
    <div>
        <DynamicFrom v-model="list" ref="fromRef"/>
        <el-button @click="submit">提交</el-button>
    </div>
</template>
    
<script setup lang="ts">
import { getFileStorageSupport } from '@/api/files/storage';
import { DynamicFrom } from '@/components/DynamicFrom';
import type { DynamicFromFild } from '@/types';
import { onMounted, ref, shallowRef, unref } from 'vue';
const fromRef=shallowRef()

const submit=()=>{
    console.log(unref(list));
    
}
const list = ref<DynamicFromFild[]>([])
onMounted(async () => {
    const { data } = await getFileStorageSupport('local')
    list.value=data
})
</script>