<script setup lang="ts">
import type { UploadFileResult } from '@/api/files/type';
import { computed, type PropType } from 'vue';
import { string } from 'vue-types';




const prop = defineProps({

    /*  list: {
         type: [Object, Array] as PropType<UploadFileResult | UploadFileResult[]>,
         default: {}
     } */

    list: {
        type: [String, Array] as PropType<string | string[]>,
        default: ''
    }

})

const fileList = computed(() => {
    const list = prop.list
    if (typeof list === 'string') return [list]
    return list
})

</script>


<template>
    {{ fileList }}
    {{ list }}
</template>