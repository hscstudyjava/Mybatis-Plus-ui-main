<script lang='ts' setup name="StorageFrom">
import { reactive, ref } from 'vue';
import { parseTime } from '@/utils/common'
import { DICT_TYPE, getDictOptions } from '@/utils/common/dict'
import { confirms, messages, notify } from '@/utils/message/MessageUtils';
import { getPageFileStorage, SysStorageApi, basePeri } from '@/api/files/storage';
import type { SysStorage } from '@/api/files/type';
//------------------------基础模板-------------------------------------------------
const diologOpen = ref(false)
const diologTitle = ref('')
const loading = ref(false)
const fromRef = ref()
const rules = reactive({
   storageName: [
      { message: '存储名称必须填写', trigger: 'blur', required: true }
   ],

   storageKey: [
      { message: '存储编码必须填写', trigger: 'blur', required: true }
   ],

   storageType: [
      { message: '存储类型必须选择', trigger: 'change', required: true }
   ]

})
const form = reactive<SysStorage>({
   id: undefined,
   storageName: '',
   storageKey: '',
   storageEnableCache: true,
   storageEnable: true,
   storageType: '',
   sortValue: 0,
   remark: ''
})


const open = async (type: string, id: number) => {
   diologOpen.value = true
   diologTitle.value = '新增存储'
   resetFrom();
   if (type === 'update') {
      loading.value = true;
      const { data } = await SysStorageApi.getOnce(id)
      Object.assign(form, data)
      diologTitle.value = '更新存储'
      loading.value = false
   }
}

const resetFrom = () => {
   Object.assign(
      form,
      {
         id: undefined,
         storageName: '',
         storageKey: '',
         storageEnableCache: true,
         storageEnable: true,
         storageType: '',
         sortValue: 0,
         remark: ''
      }
   )
   fromRef.value?.resetFields()
}

const submit = async () => {
   // 校验表单
   if (!fromRef) {
      return;
   }
   const valid = await fromRef.value.validate()
   if (!valid) {
      notify.warn('系统提示', '表单填写不正确!!!')
      return
   }
   try {
      if (form.id) {
         const { msg } = await SysStorageApi.update(form)
         messages.success(msg)
      } else {
         const { msg } = await SysStorageApi.insert(form)
         messages.success(msg)
      }
      diologOpen.value = false
      emit('success')
   } catch (error: any) {
      if (error.msg) messages.error(error.msg)
   }
   finally {
      loading.value = false
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

      <el-form ref="fromRef" :model="form" :rules="rules" status-icon label-width="80px">

         <el-form-item label="存储名称" prop="storageName">
            <el-input v-model="form.storageName" placeholder="请填写存储名称" clearable></el-input>
         </el-form-item>

         <el-form-item label="存储编码" prop="storageKey">
            <el-input v-model="form.storageKey" placeholder="请填写岗位编码" clearable></el-input>
         </el-form-item>

         <el-form-item prop="storageType" label="存储类型">
            <el-select v-model="form.storageType" class="w-full" placeholder="请选择存储类型">
               <el-option v-for="item in getDictOptions(DICT_TYPE.SYSTEM_FILE_TYPE)" :key="item.value" :label="item.label"
                  :value="item.value" />
            </el-select>
         </el-form-item>

         <el-form-item label="存储状态" prop="storageEnable">
            <el-switch v-model="form.storageEnable" inline-prompt active-text="正常" inactive-text="禁用" />
         </el-form-item>

         <el-form-item label="是否缓存" prop="storageEnableCache">
            <el-switch v-model="form.storageEnableCache" inline-prompt active-text="正常" inactive-text="禁用" />
         </el-form-item>

         <el-form-item label="排序值" prop="sortValue">
            <el-input-number v-model="form.sortValue" style="width: 100%;" :min="0" :max="100" controls-position="right" />
         </el-form-item>

         <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" placeholder="请输入备注" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea"
               clearable></el-input>
         </el-form-item>

      </el-form>

      <template #footer>
         <el-divider />
         <span class="dialog-footer">

            <el-button @click="resetFrom">
               重置
            </el-button>

            <el-button type="primary" @click="submit">
               提交
            </el-button>

         </span>
      </template>

   </el-dialog>
</template>

<style lang='scss' scoped></style>
