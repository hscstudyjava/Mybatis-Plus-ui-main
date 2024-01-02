<script lang='ts' setup name="postFrom">
import { reactive, ref } from 'vue';
import { parseTime } from '@/utils/common'
import { DICT_TYPE, getDictOptions } from '@/utils/common/dict'
import { confirms, messages, notify } from '@/utils/message/MessageUtils';
import type { SysPost } from "@/api/system/type";
import { getOnce, insertPost, updatePost } from '@/api/system/post';
//------------------------基础模板-------------------------------------------------
const diologOpen = ref(false)
const diologTitle = ref('')
const loading = ref(false)
const fromRef = ref()
const rules = reactive({
   postName: [
      { message: '岗位名称必须填写', trigger: 'blur', required: true }
   ],

   postCode: [
      { message: '岗位编码必须填写', trigger: 'blur', required: true }
   ],

})
const form = reactive<SysPost>({
   id: undefined,
   postName: '',
   postCode: '',
   status: '',
   sortValue: 0,
   remark:''
})


const open = async (type: string, postId: number) => {
   diologOpen.value = true
   diologTitle.value = '新增岗位'
   resetFrom();
   if (type === 'update') {
      loading.value = true;
      const { data } = await getOnce(postId)
      Object.assign(form, data)
      diologTitle.value = '更新岗位'
      loading.value = false
   }
}

const resetFrom = () => {
   Object.assign(
      form,
      {
         id: undefined,
         postName: '',
         postCode: '',
         status: '',
         sortValue: 0
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
         const { msg } = await updatePost(form)
         messages.success(msg)
      } else {
         const { msg } = await insertPost(form)
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

         <el-form-item label="岗位名称" prop="postName">
            <el-input v-model="form.postName" placeholder="请填写岗位名称" clearable></el-input>
         </el-form-item>

         <el-form-item label="岗位编码" prop="postCode">
            <el-input v-model="form.postCode" placeholder="请填写岗位编码" clearable></el-input>
         </el-form-item>

         <el-form-item label="排序值" prop="sortValue">
            <el-input-number v-model="form.sortValue" style="width: 100%;" :min="0" :max="100" controls-position="right" />
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
