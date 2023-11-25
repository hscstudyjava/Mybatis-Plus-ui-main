<template>
    <div class="pagination-container"  :class="{'hidden':hidden}">
        <el-pagination v-model:current-page="currentPage" 
        v-model:page-size="currentSize" :page-sizes="props.pageSizes"
            :layout="props.layout" :total="props.total"  :disabled="props.disabled" :small="small"
            :background="background" :hide-on-single-page="props.hideSinglePage" :default-current-page="1"
            :default-page-size="10" @size-change="handleSizeChange" @current-change="handleCurrentChange" v-bind="$attrs" />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

/** 
 * https://element-plus.org/zh-CN/component/pagination.html#%E5%B1%9E%E6%80%A7
 */
const props = defineProps({

    /** 
     * 当前页码
     */
    pageNum: {
        type: Number,
        default: 1
    },

    /** 
     * 分页值
     */
    limit: {
        type: Number,
        default: 10
    },

    /** 
     * 总条数
     */
    total: {
        type: Number,
        required: true,
        default: 10
    },

    /** 
     * 是否禁用分页	
        boolean
         false
     */
    disabled: {
        type: Boolean,
        default: false
    },

    //组件布局，子组件名用逗号分隔
    layout: {
        type: String,
        default: 'total, sizes, prev, pager, next, jumper'
    },

    // small
    small: {
        type: Boolean,
        default: false
    },

    //background -->false
    background: {
        type: Boolean,
        default: false
    },

    /** 
     * page-sizes -->
     * 每页显示个数选择器的选项设置	
    object
    [10, 20, 30, 40, 50, 100]
    */
    pageSizes: {
        type: Object,
        default() {
            return [10, 20, 30, 40, 50]
        }
    },

    /** 
     * hide-on-single-page
     * 
     * 是否只有一页隐藏
     */
    hideSinglePage: {
        type: Boolean,
        default: false
    },

    hidden:{
        type:Boolean,
        default:false
    }
})

const emit = defineEmits(['paginations', 'update:pageNum', 'update:limit'])



/** 
 * 当前分页
 */
const currentPage = computed({

    get() {
        return props.pageNum
    },

    set(val) {
        emit('update:pageNum', val)
    }

})

const currentSize = computed({
    get() {
        return props.limit
    },
    set(val) {
        emit('update:limit', val)
    }
})

// 对参数进行解耦
const pageNumber=props.pageNum;
const pageSize=props.limit;

/** 
 * 改变分页值
 */
const handleSizeChange = (val: number) => {
    if (props.pageNum * val > props.total) {
        currentPage.value = 1;
    }

    emit('paginations', { pageNum: currentPage.value, limit: val })
}

const handleCurrentChange = (val: number) => {
    emit('paginations', { pageNum: val, limit: currentSize.value  })
}

</script>

<style lang="scss" scoped>

.pagination-container{
    padding: 10px 16px;
}
.pagination-container.hidden {
  display: none;
}
</style>