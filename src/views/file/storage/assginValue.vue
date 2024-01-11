<script lang='ts' setup name="StorageFrom">
import { SysStorageValueApi, getFileStorageSupport, getFileStorageValue } from '@/api/files/storage';
import { DynamicFrom } from '@/components/DynamicFrom';
import type { DynamicFromFild } from '@/types';
import { nextTick, ref, unref } from 'vue';
import type { SysStorageValue } from "@/api/files/type";
import { messages } from '@/utils/message/MessageUtils';
const diologOpen = ref(false)
const diologTitle = ref('')
const loading = ref(false)
const fromRef = ref()

const fildLists = ref<DynamicFromFild[]>([])
const list = ref<SysStorageValue[]>([])

const id = ref()
const open = async (storageId: number, storageType: string) => {
   diologOpen.value = true
   diologTitle.value = '设置存储'
   id.value = storageId
   loading.value = true
   try {
      const fildList = (await getFileStorageSupport(storageType)).data
      // 尝试拉取配置数据
      const dbList = (await getFileStorageValue(storageId)).data

      // 转换数据
      fildList.forEach(first => {
         const item = dbList.find(item => item.storageName === first.prop)
         if (item) {
            first.value = item.storageValue;
         }
      })

      list.value = dbList
      fildLists.value = fildList
   } catch (error: any) {
      if (error.msg) messages.error(error.msg)
      diologOpen.value = false
   } finally {
      loading.value = false
   }
}

/** 
 * 
 */
const submit = async () => {


   loading.value = true;
   list.value = []
   // 转换数据
   fildLists.value.forEach(first => {
      list.value.push(
         {
            storageName: first.prop,
            storageTitle: first.label,
            storageValue: first.value as string
         }
      )
   })

   try {
      await SysStorageValueApi.setting({
         storageId: unref(id),
         list: unref(list)
      })
      messages.success('设置成功')
      diologOpen.value = false;
      emit('success')
   } catch (error: any) {
      if (error.msg) messages.error(error.msg)
   } finally {
      loading.value = false;
   }

}


const emit = defineEmits(['success'])
defineExpose({
   open
})


</script>

<template>
   <el-dialog v-model="diologOpen" :close-on-click-modal="false" :draggable="true" :align-center="true" width="30%">
      <template #header="{ close, titleId, titleClass }">
         <div class="my-header">
            <h6 :id="titleId">{{ diologTitle }}</h6>
            <el-divider />
         </div>
      </template>
      <DynamicFrom v-loading="loading" v-model="fildLists"></DynamicFrom>
      <template #footer>
         <el-divider />
         <span class="dialog-footer">

            <!--       <el-button @click="resetFrom">
               重置
            </el-button> -->

            <el-button type="primary" @click="submit">
               提交
            </el-button>

         </span>
      </template>

   </el-dialog>
</template>