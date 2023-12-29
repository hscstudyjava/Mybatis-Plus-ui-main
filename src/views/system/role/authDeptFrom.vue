<script lang='ts' setup>
import { reactive, ref } from 'vue';
import { parseTime } from '@/utils/common'
import { DICT_TYPE, getDictOptions } from '@/utils/common/dict'
import { confirms, messages, notify } from '@/utils/message/MessageUtils';
//------------------------基础模板-------------------------------------------------
defineOptions({
    name:'authDeptFrom'
})

const diologOpen = ref(false)
const diologTitle = ref('')
const loading = ref(false)





</script>
<template>
   <div class='app-context'></div>
</template>

<style lang='scss' scoped>

</style>