<template>
    <div>
        <!-- <uploadFiles/>
         -->
      
    </div>
</template>
    
<script setup lang="ts">
import { usePeriStroe } from '@/stores/permission';
import { onMounted, ref } from 'vue';
import { useAes } from '@/utils/common/encrypt'

const icon=ref('')

console.log(icon);


const usePri = usePeriStroe()


const success = () => {

}
onMounted(async () => {
    console.log(useAes.aesEncrypt("123", "ok"));

})

</script>