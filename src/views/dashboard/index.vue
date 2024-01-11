<template>
    <div>
        <!-- <uploadFiles :fileType="['mp4','txt','xls','xlsx','mkv','go']"/>-->

    </div>
</template>
    
<script setup lang="ts">
import { getFileStorageSupport } from '@/api/files/storage';
import { DynamicFrom } from '@/components/DynamicFrom';
import type { DynamicFromFild } from '@/types';
import { onMounted, ref, shallowRef, unref } from 'vue';
import { userFile } from '@/hooks/web/file'
const list = ref<DynamicFromFild[]>([])
onMounted(async () => {
    console.log(userFile);

})
</script>