<template>
    <!-- 弹窗 -->
    <el-dialog v-model="open" :close-on-click-modal="false" :draggable="true" :align-center="true" width="50%">
        <template #header="{ close, titleId, titleClass }">
            <div class="my-header">
                <h6 :id="titleId">{{ title }}</h6>
                <el-divider />
            </div>
        </template>
        <el-form ref="ruleFormRef" :model="form" :rules="rules" status-icon label-width="100px">

            <el-form-item label="字典名称" prop="typeId">
                <el-select v-model="form.typeId" class="!w-240px" style="width: 100%;">
                    <el-option v-for="item in typeList" :key="item.id" :label="item.title" :value="item.id + ''" />
                </el-select>
            </el-form-item>

            <el-form-item label="类型字符" prop="key">
                <el-input v-model="form.key" disabled clearable></el-input>
            </el-form-item>

            <el-form-item label="字典标题" prop="label">
                <el-input v-model="form.label" placeholder="请输入字典标题" clearable></el-input>
            </el-form-item>

            <el-form-item prop="value">
                <template #label>
                    <span>
                        字典数据
                        <el-tooltip placement="top">
                            <template #content>请填写字典数据</template>
                            <svg-icon iconClass="question"></svg-icon>
                        </el-tooltip>
                    </span>
                </template>
                <el-input v-model="form.value" placeholder="请输入字典数据" clearable></el-input>
            </el-form-item>

            <el-form-item label="颜色类型" prop="btnClass">
                <el-select v-model="form.btnClass" style="width: 100%;">
                    <el-option v-for="item in colorTypeOptions" :key="item.value"
                        :label="item.label + '(' + item.value + ')'" :value="item.value" />
                </el-select>
            </el-form-item>

            <el-form-item label="自定义样式" prop="customStyle">
                <el-input v-model="form.customStyle" placeholder="请输入自定义样式" clearable></el-input>

            </el-form-item>

            <el-form-item label="排序值" prop="sortValue">
                <el-input-number v-model="form.sortValue" style="width: 100%;" :min="0" :max="100"
                    controls-position="right" />
            </el-form-item>

            <el-form-item label="备注" prop="remark">
                <el-input v-model="form.remark" placeholder="请输入备注" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea"
                    clearable></el-input>
            </el-form-item>

        </el-form>

        <template #footer>
            <el-divider />
            <span class="dialog-footer">
                <el-button type="primary" @click="submit">
                    提交
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { getSysDictValueId, insertSysDictValue, updateSysDictValue } from '@/api/system/dict/value';
import type { SysDictValue, SysDictType } from '@/api/system/type';
import { messages } from '@/utils/message/MessageUtils';
import { reactive, readonly, ref, type PropType, watch, computed } from 'vue';
import { selectSysDictTypeSimpleList } from '@/api/system/dict/type';
const form = reactive<SysDictValue>({
    id: '',
    typeId: '',
    label: '',
    key: '',
    value: '',
    icon: '',
    btnClass: '',
    customStyle: '',
    hasDefault: '',
    sortValue: 0,
    status: '',
    remark: '',
    optionsParams: {}
})
const props = defineProps({
    typeList: {
        type: Array as PropType<Array<SysDictType>>,
    },
    typeId: {
        type: String as PropType<string
        >
    }
})

const currentTypeId = computed({

    get() {
        return props.typeId
    },

    set(val) {
        emit('update:typeId', val)
    }
})

/** 
 * 当观察到typeId发生变化后给表单中的key进行赋值
 */
const watchTypeId = watch(
    () => form.typeId,
    (newValue) => {
        form.key = props.typeList?.find(it => it.id == newValue)?.key as string
    }
);

//观察选择了那个数据

defineOptions({ name: 'dictValueFrom' })

const open = ref(false)
const title = ref('')
const loading = ref(false)
const type = ref('')

const rules = reactive({
    label: [{ required: true, message: '数据标签不能为空', trigger: 'blur' }],
    value: [{ required: true, message: '数据键值不能为空', trigger: 'blur' }],
    sortValue: [{ required: true, message: '数据顺序不能为空', trigger: 'blur' }],
    typeId: [{ required: true, message: '数据顺序不能为空', trigger: 'change' }],
    key: [{ required: true, message: '数据类型不能为空', trigger: 'change' }],
})
const colorTypeOptions = readonly([
    {
        value: 'default',
        label: '默认'
    },
    {
        value: 'primary',
        label: '主要'
    },
    {
        value: 'success',
        label: '成功'
    },
    {
        value: 'info',
        label: '信息'
    },
    {
        value: 'warning',
        label: '警告'
    },
    {
        value: 'danger',
        label: '危险'
    }
])
const ruleFormRef = ref()
/** 重置表单 */
const resetForm = () => {
    Object.assign(form, {
        id: '',
        typeId: 0,
        label: '',
        key: '',
        value: '',
        icon: '',
        btnClass: 'default',
        customStyle: '',
        hasDefault: '',
        sortValue: 0,
        status: '',
        remark: '',
        optionsParams: {}
    })
    ruleFormRef.value?.resetFields()
}


/** 打开弹窗 */
const openDialog = async (types: string, id?: number, typeId?: number) => {
    open.value = true
    title.value = types === 'create' ? '新增' : '修改'
    type.value = types
    resetForm()
    if (types == 'create') {
        if (typeId) {
            form.typeId = typeId
        }
    } else {
        if (id) {
            loading.value = true
            try {
                const { data } = await getSysDictValueId(id)
                Object.assign(form, data)
                form.typeId = String(data.typeId)//解决数据无法回显问题
            } finally {
                loading.value = false
            }
        }
    }

}
defineExpose({ openDialog }) // 提供 open 方法，用于打开弹窗
const emit = defineEmits(['success', 'update:typeId'])
const submit = async () => {
    // 校验表单
    if (!ruleFormRef) return
    const valid = await ruleFormRef.value.validate()
    if (!valid) return
    // 提交请求
    loading.value = true
    try {
        if (type.value === 'create') {
            const { msg } = await insertSysDictValue(form)
            messages.success(msg)
        } else {
            const { msg } = await updateSysDictValue(form)
            messages.success(msg)
        }
        open.value = false
        currentTypeId.value = form.typeId as string;//同步前段
        // 发送操作成功的事件-->表单提交结束返回一个typeId用于判断是否发生改变
        emit('success')
    } finally {
        loading.value = false
    }

}

</script>