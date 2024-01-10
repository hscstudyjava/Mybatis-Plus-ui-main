<script lang='ts' setup name="StorageFrom">
import { getFileStorageSupport, getFileStorageValue } from '@/api/files/storage';
import { DynamicFrom } from '@/components/DynamicFrom';
import type { DynamicFromFild } from '@/types';
import { ref } from 'vue';

const diologOpen = ref(false)
const diologTitle = ref('')
const loading = ref(false)
const fromRef = ref()

const fildLists=ref<DynamicFromFild[]>([])



const open = async (type: string, storageId: number, storageType: string) => {
    diologOpen.value = true
    diologTitle.value = '新增存储'
    loading.value = true
    try {
        const fildList = (await getFileStorageSupport(storageType)).data
        fildLists.value=fildList
    } catch (error: any) {
        if (error.msg)
            console.error(new Error(error))
    } finally {
        loading.value = false
    }

}


</script>

<template>
   <el-dialog v-model="diologOpen" :close-on-click-modal="false" :draggable="true" :align-center="true" width="30%">
      <template #header="{ close, titleId, titleClass }">
         <div class="my-header">
            <h6 :id="titleId">{{ diologTitle }}</h6>
            <el-divider />
         </div>
      </template>
      <DynamicFrom v-model="fildLists"></DynamicFrom>
      <template #footer>
         <el-divider />
         <span class="dialog-footer">
<!-- 
            <el-button @click="resetFrom">
               重置
            </el-button>

            <el-button type="primary" @click="submit">
               提交
            </el-button> -->

         </span>
      </template>

   </el-dialog>

</template>