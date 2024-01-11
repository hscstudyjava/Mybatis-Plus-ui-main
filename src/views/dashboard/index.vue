<template>
    <div>
    <uploadFiles :fileType="['mp4','mkv','go']"/>
    </div>
</template>
    
<script setup lang="ts">
import { getFileStorageSupport } from '@/api/files/storage';
import { DynamicFrom } from '@/components/DynamicFrom';
import type { DynamicFromFild } from '@/types';
import { onMounted, ref, shallowRef, unref } from 'vue';

const list = ref<DynamicFromFild[]>([])
onMounted(async () => {
  
})
</script>