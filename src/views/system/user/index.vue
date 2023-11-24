<template>

<div style="font-family:Nabla ;">
    <el-button @click="success">ok</el-button>
</div>

</template>

<script setup lang="ts">
import ElMessage from 'element-plus/lib/components/message/index.js';


const success=()=>{
    ElMessage("ok")
}

</script>