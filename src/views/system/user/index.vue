<template>

<div style="font-family:Nabla ;">
    <el-button @click="success">ok</el-button>
</div>

</template>

<script setup lang="ts">
import { getRouter } from '@/api/login/login';
import { onMounted } from 'vue';


onMounted(()=>{
    getRouter().then(res=>{

    })
})

const success=()=>{
   
}

</script>