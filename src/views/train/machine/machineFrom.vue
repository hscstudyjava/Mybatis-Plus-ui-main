<script lang='ts' setup name="machineForm">
import { reactive, ref } from 'vue';
import { parseTime } from '@/utils/common'
import { DICT_TYPE, getDictOptions } from '@/utils/common/dict'
import { confirms, messages, notify } from '@/utils/message/MessageUtils';
import type { TrainMachine } from "@/api/train/type";
import { MachineApi } from '@/api/train/machine';

//------------------------基础模板-------------------------------------------------
const diologOpen = ref(false)
const diologTitle = ref('')
const loading = ref(false)
const fromRef = ref()
const rules = reactive({
   title: [
      { message: '机器标题必须填写', trigger: 'blur', required: true }
   ],

   code: [
      { message: '机器编码必须填写', trigger: 'blur', required: true }
   ],


})
const form = reactive<TrainMachine>({
   id: undefined,
   deptId: '',
   code: '',
   title: '',
   leader: '',
   telNumber: '',
   ipV4: '',
   ipV6: '',
   status: '',
   optionsParams: {}
})

const open = async (type: string, id: number) => {
   diologOpen.value = true
   diologTitle.value = '新增机器'
   resetFrom();
   if (type === 'update') {
      loading.value = true;
      const { data } = await MachineApi.getOnce(id)
      Object.assign(form, data)
      diologTitle.value = '更新岗位'
      loading.value = false
   }
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
         const { msg } = await MachineApi.updateMachine(form)
         messages.success(msg)
      } else {
         const { msg } = await MachineApi.insertMachine(form)
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
const resetFrom = () => {
   Object.assign(
      form,
      {
         id: undefined,
         deptId: '',
         code: '',
         title: '',
         leader: '',
         telNumber: '',
         ipV4: '',
         ipV6: '',
         status: '',
         optionsParams: {}
      }
   )
   fromRef.value?.resetFields()
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

      <el-form ref="fromRef" :model="form" :rules="rules" status-icon label-width="80px">

         <el-form-item label="机器标题" prop="title">
            <el-input v-model="form.title" placeholder="请填写机器标题" clearable></el-input>
         </el-form-item>

         <el-form-item label="机器编码" prop="code">
            <el-input v-model="form.code" placeholder="请填写机器编码" clearable></el-input>
         </el-form-item>
         
         <el-form-item label="负责人" prop="leader">
            <el-input v-model="form.leader" placeholder="请填写负责人" clearable></el-input>
         </el-form-item>
         
         <el-form-item label="联系方式" prop="telNumber">
            <el-input v-model="form.telNumber" placeholder="请填写联系方式" clearable></el-input>
         </el-form-item>

         <el-form-item label="状态" prop="status">
            <el-switch v-model="form.status" active-value="0" inactive-value="1" inline-prompt active-text="正常"
               inactive-text="禁用" />
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