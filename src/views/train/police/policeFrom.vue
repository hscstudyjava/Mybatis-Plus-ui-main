<script setup lang="ts" name="policeFrom">
import type { SysDept } from '@/api/system/type';
import { PoliceApi } from '@/api/train/police';
import type { PoliceInfo } from '@/api/train/type';
import type { SimpleTree } from '@/types/base';
import { messages, notify } from '@/utils/message/MessageUtils';
import { reactive, ref } from 'vue';

const props = withDefaults(
    defineProps<{
        deptList: SimpleTree<SysDept>[],
    }
    >(),
    {
    }
)
const diologOpen = ref(false)
const diologTitle = ref('')
const loading = ref(false)
const fromRef = ref()

const form = reactive<PoliceInfo>({
    id: undefined,
    code: '',
    name: '',
    idNo: '',
    category: '',
    position: '',
    remark: '',
    status: '',
    createDept: '',
    optionsParams: {}
})

const rules = reactive({
    name: [
        { message: '警员名称必须填写', trigger: 'blur', required: true }
    ],

    code: [
        { message: '警员警号必须填写', trigger: 'blur', required: true }
    ],
    createDept: [
        { message: '请给人员选择部门', trigger: 'change', required: true }
    ],  
    idNo: [
        { message: '请填充人员身份信息', trigger: 'blur', required: true }
    ],
})
const open = async (type: string, id: number) => {
    diologOpen.value = true
    diologTitle.value = '新增警员'
    resetFrom();
    if (type === 'update') {
        loading.value = true;
        const { data } = await PoliceApi.getOnce(id)
        Object.assign(form, data)
        diologTitle.value = '更新警员'
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
            const { msg } = await PoliceApi.updatePoliceInfo(form)
            messages.success(msg)
        } else {
            const { msg } = await PoliceApi.insertPoliceInfo(form)
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
            code: '',
            name: '',
            idNo: '',
            category: '',
            position: '',
            remark: '',
            status: '',
            createDept: '',
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
            <el-form-item label="所属部门" prop="createDept">
                <el-tree-select placeholder="请选择所属部门" style="width:100%" v-model="form.createDept" node-key="id"
                    :data="deptList" check-strictly :render-after-expand="false" />
            </el-form-item>
            <el-form-item label="警员姓名" prop="name">
                <el-input v-model="form.name" placeholder="请填写警员姓名" clearable/>
            </el-form-item>

            <el-form-item label="警员警号" prop="code">
                <el-input v-model="form.code" placeholder="请填写警员警号" clearable/>
            </el-form-item>

            <el-form-item label="身份号码" prop="idNo">
                <el-input v-model="form.idNo" placeholder="请填写身份号码" clearable/>
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