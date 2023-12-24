<template>
    <!-- style={dictData.value?.customStyle ? 'color: #fff' : '' }  -->
    <template v-if="dictValue">
        <span v-if="dictValue?.btnClass === 'default' || dictValue?.btnClass === ''" :class="dictValue?.customStyle">{{
            dictValue?.label }}</span>
        <el-tag v-else :class="dictValue?.customStyle" :style="dictValue?.customStyle ? 'color:#fff' : ''"
            :type="dictValue?.btnClass">
            {{ dictValue?.label }}
        </el-tag>
    </template>
</template>

<script setup lang="ts">
import { type PropType, onMounted, ref, watch } from 'vue';
import { getDictOptions } from '@/utils/common/dict'


// 设置名称
defineOptions({
    name: 'DictTag'
})
import type { SysDictSimpleResult } from '@/api/system/type'

const props = defineProps({

    /** 
     * 属性
     */
    type: {
        type: String as PropType<string>,
        required: true
    },

    /** 
     * 关联key值
     */
    value: {
        type: [String, Number, Boolean] as PropType<string | number | boolean>,
        required: true
    }

})
const dictValue = ref<SysDictSimpleResult>()
const getDictObj = (dictType: string, value: string|number|boolean) => {
    const dictOptions = getDictOptions(dictType)
    dictOptions.forEach((dict: SysDictSimpleResult) => {
        if (dict.value === value) {
            if (dict.btnClass + '' === 'primary' || dict.btnClass + '' === 'default') {
                dict.btnClass = ''
            }
            dictValue.value = dict
        }
    })
}

// 监听 props.value 的变化
watch(() => props.value, (newValue) => {
  getDictObj(props.type, newValue.toString());
});

onMounted(() => {
    getDictObj(props.type, props.value)
})

</script>