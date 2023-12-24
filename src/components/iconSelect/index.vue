<script setup lang="ts">
import { computed, ref, toRef, watch } from 'vue';
import data from './data/index.json'//
import { cloneDeep } from 'lodash-es'
import { type CSSProperties } from 'vue'

type ParameterCSSProperties = (item?: string) => CSSProperties | undefined

// 数据初始化
defineOptions({
    name: 'IconSelect',
})

const props = withDefaults(
    defineProps<{
        modelValue: string
    }>(),
    {}
)

const emit = defineEmits(['update:modelValue'])

const myValue = computed({
    get() {
        return props.modelValue
    },

    set(value) {
        emit('update:modelValue', value)
    },
})



// 分页数据
const pagination = ref({
    pageNumber: 1,
    pageSize: 98,
})


// 选择图标相关
const visible = ref(false)
const inputValue = toRef(props, 'modelValue')
const icon = ref('add-location')
const currentActiveType = ref('ep:')
// 深拷贝图标数据，前端做搜索
const copyIconList = cloneDeep(data)
// 首先获得tagList
const tagList = data.map(item => {
    return {
        //@ts-ignore
        prefix: item.prefix,
        // @ts-ignore
        name: item.name
    };
});
// 搜索条件
const filterValue = ref('')

// 获得某个属性的数据量
const iconCount = computed(() => {
    const activeIcon = copyIconList.find(item => item.prefix === currentActiveType.value);
    return activeIcon ? activeIcon.icons.length : 0;
});

const iconItemStyle = computed((): ParameterCSSProperties => {
    return (item) => {
        if (inputValue.value === currentActiveType.value + item) {
            return {
                borderColor: 'var(--el-color-primary)',
                color: 'var(--el-color-primary)'
            }
        }
    }
})

const iconObject = computed(() => {
    return copyIconList.find(item => item.prefix === currentActiveType.value);
});

const pageList = computed(() => {
    if (pagination.value.pageNumber === 1) {
        return iconObject.value?.icons?.filter((v) => v.includes(filterValue.value))
            .slice(pagination.value.pageNumber - 1, pagination.value.pageSize);
    } else {
        return iconObject.value?.icons?.filter((v) => v.includes(filterValue.value)).slice(
            pagination.value.pageSize * (pagination.value.pageNumber - 1),
            pagination.value.pageSize * (pagination.value.pageNumber - 1) + pagination.value.pageSize
        );
    }
});

// @ts-ignore
function handleClick({ props }) {
    pagination.value.pageNumber = 1
    currentActiveType.value = props.name
    emit('update:modelValue', currentActiveType.value + iconObject.value?.icons[0])
    // @ts-ignore
    icon.value = iconObject.value?.icons[0]
}

function onChangeIcon(item: string) {
    icon.value = item
    emit('update:modelValue', currentActiveType.value + item)
    visible.value = false
}

function onCurrentChange(page: number) {
    pagination.value.pageNumber = page
}

watch(
    () => props.modelValue,
    () => {
        if (props.modelValue && props.modelValue.includes(':')) {
            currentActiveType.value = props.modelValue.substring(0, props.modelValue.indexOf(':') + 1)
            icon.value = props.modelValue.substring(props.modelValue.indexOf(':') + 1)
        }
    }
)

watch(
    filterValue,
    () => {
        pagination.value.pageNumber = 1
    }
)
</script>


<template>
    <div class="selector">
        <ElInput v-model="inputValue" @click="visible = !visible">
            <template #append>
                <ElPopover :popper-options="{ placement: 'auto' }" :visible="visible" :width="350"
                    popper-class="pure-popper" trigger="click">
                    <template #reference>
                        <div class="h-32px w-40px flex cursor-pointer items-center justify-center"
                            @click="visible = !visible">
                            <svgIcon :icon="currentActiveType + icon" />
                        </div>
                    </template>

                    <ElInput v-model="filterValue" class="p-2" clearable placeholder="搜索图标" />
                    <ElDivider border-style="dashed" />

                    <ElTabs v-model="currentActiveType" @tab-click="handleClick">
                        <ElTabPane v-for="(pane, index) in tagList" :key="index" :label="pane.name" :name="pane.prefix">
                            <ElDivider border-style="dashed" class="tab-divider" />
                            <ElScrollbar height="220px">
                                <ul class="ml-2 flex flex-wrap px-2">
                                    <li v-for="(item, key) in pageList" :key="key" :style="iconItemStyle(item)"
                                        :title="item"
                                        class="icon-item mr-2 mt-1 w-1/10 flex cursor-pointer items-center justify-center border border-solid p-2"
                                        @click="onChangeIcon(item)">
                                        <svgIcon :icon="currentActiveType + item"></svgIcon>
                                    </li>
                                </ul>
                            </ElScrollbar>
                        </ElTabPane>
                    </ElTabs>
                    <ElDivider border-style="dashed" />
                    <ElPagination :current-page="pagination.pageNumber" :page-size="pagination.pageSize" :total="iconCount"
                        background class="h-10 flex items-center justify-center" layout="prev, pager, next" small
                        @current-change="onCurrentChange" />
                </ElPopover>
            </template>
        </ElInput>
    </div>
</template>


<style scoped lang="scss">
.el-divider--horizontal {
    margin: 1px auto !important;
}

.tab-divider.el-divider--horizontal {
    margin: 0 !important;
}

.icon-item {
    &:hover {
        color: var(--el-color-primary);
        border-color: var(--el-color-primary);
        transform: scaleX(1.05);
        transition: all 0.4s;
    }
}

:deep(.el-tabs__nav-next) {
    font-size: 15px;
    line-height: 32px;
    box-shadow: -5px 0 5px -6px #ccc;
}

:deep(.el-tabs__nav-prev) {
    font-size: 15px;
    line-height: 32px;
    box-shadow: 5px 0 5px -6px #ccc;
}

:deep(.el-input-group__append) {
    padding: 0;
}

:deep(.el-tabs__item) {
    height: 30px;
    font-size: 12px;
    font-weight: normal;
    line-height: 30px;
}

:deep(.el-tabs__header),
:deep(.el-tabs__nav-wrap) {
    position: static;
    margin: 0;
}
</style>
