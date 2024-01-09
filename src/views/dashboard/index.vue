<template>
    <div>
        <DynamicFrom :form-fields="list" />
    </div>
</template>
    
<script setup lang="ts">
import { DynamicFrom } from '@/components/DynamicFrom';
import type { DynamicFromFild } from '@/types';
import { ref } from 'vue';
const list = ref<DynamicFromFild[]>([
    {
        label: '测试',
        type: 'input',
        prop: 'ok'
    },
    {
        label:'er',
        type:'input',
        prop:'er'
    }
])
</script>