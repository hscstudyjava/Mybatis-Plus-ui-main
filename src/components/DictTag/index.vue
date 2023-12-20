<template>
    <!-- style={dictData.value?.customStyle ? 'color: #fff' : '' }  -->
    {{ dictValue }}
</template>

<script setup lang="ts">
import { PropType, onMounted, ref } from 'vue';
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
const getDictObj = (dictType: string, value: string) => {
    console.log(dictType);
    
    const dictOptions = getDictOptions(dictType)
    console.log(dictOptions);
    
    dictOptions.forEach((dict: SysDictSimpleResult) => {
        if (dict.value === value) {
            if (dict.colorType + '' === 'primary' || dict.colorType + '' === 'default') {
                dict.colorType = ''
            }
            console.log(dict);
            
            dictValue.value = dict
        }
    })
}
onMounted(() => {
    getDictObj(props.type, props.value.toString())
})
</script>