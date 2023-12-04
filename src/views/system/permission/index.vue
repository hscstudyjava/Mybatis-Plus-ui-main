<template>
    quanxian
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { queryPermissionAllTree } from '@/api/system/permission'
const state = reactive({
})


const loadingList = () => {
    queryPermissionAllTree({ id: 1, name: 2 }).then(res => {

    })
}
onMounted(() => {
    loadingList()
})

</script>