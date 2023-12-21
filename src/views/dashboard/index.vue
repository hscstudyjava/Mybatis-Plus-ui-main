<template>
    <div >
        <uploadFiles/>
    </div>
</template>
    
<script setup lang="ts">
import { usePeriStroe } from '@/stores/permission';
import { onMounted } from 'vue';


const usePri=usePeriStroe()

const success = () => {

}
onMounted(async() => {
    await usePri.loadingRouter()
})

</script>