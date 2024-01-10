<script setup lang="ts" name="DynamicFrom">
import type { DynamicFromFild, DynamicObj } from '@/types';
import { type PropType, computed, ref, shallowRef } from 'vue';
// https://blog.csdn.net/qq_43546721/article/details/134838808
const props = defineProps({
    modelValue: {
        type: [] as PropType<DynamicFromFild[]>,
        required: true
    }
})
const dynamicForm = shallowRef()
const form = ref<DynamicObj>({})

defineExpose({
    dynamicForm,
    form
})
</script>

<template>
    <el-form ref="dynamicForm" label-width="120px">
        <el-form-item v-for="(field, index) in modelValue" :key="index" :label="field.label" :prop="field.prop">
            <el-input v-if="field.type === 'input'" v-model="field.value">
            </el-input>
            <el-select v-if="field.type === 'select'" v-model="form[field.prop]">
                <el-option v-for="(option, optionIndex) in field.options" :key="optionIndex" :label="option.label"
                    :value="field.value"></el-option>
            </el-select>
            <!-- 其他类型的表单字段 -->
            <el-text v-if="field.remark" class="mt-1"><span v-html="field.remark"></span></el-text>
        </el-form-item>
    </el-form>
</template>