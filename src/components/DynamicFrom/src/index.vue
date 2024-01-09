<script setup lang="ts" name="DynamicFrom">
import type { DynamicFromFild } from '@/types';
import {type PropType, computed, ref, shallowRef } from 'vue';
// https://blog.csdn.net/qq_43546721/article/details/134838808
const props = defineProps({
    formFields: {
        type: [] as PropType<DynamicFromFild[]>,
        required: true
    }
})
const dynamicForm = shallowRef()
const form=ref({})

defineExpose({
    dynamicForm
})
</script>

<template>
    <el-form ref="dynamicForm" label-width="120px">
        <el-form-item v-for="(field, index) in formFields" :key="index" :label="field.label" :prop="field.prop">
            <el-input v-if="field.type === 'input'" v-model="form[field.prop]" :placeholder="field.remark">
            </el-input>
            <el-select v-if="field.type === 'select'" v-model="form[field.prop]" :placeholder="field.remark">
                <el-option v-for="(option, optionIndex) in field.options" :key="optionIndex" :label="option.label"
                    :value="option.value"></el-option>
            </el-select>
            <!-- 其他类型的表单字段 -->
        </el-form-item>
    </el-form>
</template>