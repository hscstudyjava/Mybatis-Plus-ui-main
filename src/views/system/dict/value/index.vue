<template>
    <div class="app-context">
        <el-card class="box-card">
            <el-form ref="queryFrom" :inline="true" v-show="state.showQuery" :model="state.params" @submit.native.prevent>

                <el-form-item label="字典名称" prop="dictType">
                    <el-select v-model="state.params.typeId" class="!w-240px">
                        <el-option v-for="item in typeList" :key="item.id" :label="item.title" :value="item.id + ''" />
                    </el-select>
                </el-form-item>
                <el-form-item label="标题" prop="label">
                    <el-input v-model="state.params.label" placeholder="请输入字典标题" @keyup.enter.native="loadList"
                        clearable></el-input>
                </el-form-item>

                <el-form-item label="字符" prop="value">
                    <el-input v-model="state.params.value" placeholder="请输入字典字符" @keyup.enter.native="loadList"
                        clearable></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="handleQuery">
                        <template #icon>
                            <i-ep-search />
                        </template>
                        查询</el-button>
                    <el-button @click="resetQuery">
                        <template #icon>
                            <i-ep-Refresh />
                        </template>
                        重置</el-button>

                </el-form-item>
            </el-form>

            <!-- 表单数组 -->
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5" v-peri="[basePeri + 'save']">
                    <!-- @click="handleInsert(ruleFormRef)" -->
                    <el-button type="success" plain @click="openForm('create')">
                        <template #icon>
                            <el-icon>
                                <i-ep-Plus />
                            </el-icon>
                        </template>
                        新增
                    </el-button>
                </el-col>

                <el-col :span="1.5" v-peri="[basePeri + 'update']">
                    <el-button type="primary" plain :disabled="state.single" @click="openForm('update', undefined)">
                        <template #icon>
                            <el-icon>
                                <i-ep-Edit />
                            </el-icon>
                        </template>
                        更新
                    </el-button>
                </el-col>

                <el-col :span="1.5" v-peri="[basePeri + 'remove']">
                    <el-button type="danger" :disabled="state.multiple" @click="handleDelete()" plain>
                        <template #icon>
                            <i-ep-delete />
                        </template>
                        删除
                    </el-button>
                </el-col>

                <rightQuery style="float: right;" v-model:query="state.showQuery" @toggleQuery="toggleQuery"
                    @refresh="loadList" />
            </el-row>
        </el-card>

        <el-card class="mt-10">
            <el-table :data="state.list" v-loading="state.loading" @selection-change="handleSelectionChange" stripe
                style="width: 100%">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column label="ID" type="index" width="50" align="center" />
                <el-table-column label="标题" show-overflow-tooltip prop="label" align="center" />
                <el-table-column label="数据" show-overflow-tooltip prop="value" align="center" />
                <el-table-column label="字符" show-overflow-tooltip prop="key" align="center" />
                <el-table-column label="排序" prop="sortValue" align="center" />
                <el-table-column label="备注" show-overflow-tooltip prop="remark" align="center" />
                <el-table-column label="创建时间" align="center">
                    <template #default="scope">
                        {{ parseTime(scope.row.createTime) }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template #default="scope">
                        <el-button link v-peri="[`${basePeri}update`]" type="primary"
                            @click="openForm('update',scope.row.id)">
                            <template #icon>
                                <el-icon>
                                    <i-ep-Edit />
                                </el-icon>
                            </template>
                            更新
                        </el-button>

                        <el-button link type="danger" v-peri="[`${basePeri}:remove`]" @click="handleDelete(scope.row)">
                            <template #icon>
                                <i-ep-delete />
                            </template>
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <Paginations v-show="state.total > 0" v-model:limit="state.params.pageSize"
                v-model:pageNum="state.params.pageNumber" :total="state.total" @paginations="loadList">
            </Paginations>
        </el-card>

        <dictValueForm ref="submitForm" @success="loadList" v-model:type-id="(state.params.typeId as string)"
            :type-list="typeList"></dictValueForm>
    </div>
</template>

<script setup lang="ts">
import { selectSysDictValueList, basePeri, removeSysDictValue } from '@/api/system/dict/value';
import type { SysDictValue, SysDictType } from '@/api/system/type';
import { onMounted, reactive, ref } from 'vue';
import { parseTime } from '@/utils/common'
import { useRoute } from 'vue-router';
import dictValueForm from './dictValueForm.vue';
import { selectSysDictTypeSimpleList } from '@/api/system/dict/type';
import { confirms, messages, notify } from '@/utils/message/MessageUtils';
const route = useRoute() // 路由
const typeList = ref<SysDictType[]>()


const queryFrom = ref()
const state = reactive({
    single: true,

    multiple: true,

    showQuery: true,

    expandAll: false,

    loading: false,

    open: false,

    title: '',

    ids: [] as number[],

    list: [] as Array<SysDictValue>,

    params: {
        pageNumber: 1,
        pageSize: 10,
        typeId: route.params.typeId,
        label: '',
        value: '',
        key: ''
    },

    total: 0
})

const submitForm = ref();
const openForm = (type: string, id?: number) => {
    var currentId = id
    if(!state.single){
        currentId=state.ids[0]
    }
    submitForm.value.openDialog(type, currentId, state.params.typeId)
}

const loadList = async () => {
    state.loading = true
    try {
        const { data } = await selectSysDictValueList(state.params)
        state.list = data.records
        state.total = data.totalRow
    } finally {
        state.loading = false
    }
}
const handleDelete = async (row: SysDictValue) => {
    try {
        await confirms.confirm(`您确定这些数据${row.label === undefined ? row.label : state.ids}删除数据`)
        const { msg } = await removeSysDictValue(row.id || state.ids)
        messages.success(msg)
        await loadList()
    } catch {

    }
}

/** 搜索按钮操作 */
const handleQuery = () => {
    state.params.pageNumber = 1
    loadList();
}

const handleSelectionChange = (rows?: SysDictValue[]) => {
    // @ts-ignore
    state.ids = rows?.map(item => item.id)
    state.single = state.ids.length != 1
    state.multiple = !state.ids.length
}

/** 重置按钮操作 */
const resetQuery = () => {
    queryFrom.value.resetFields()
    handleQuery()
}
const toggleQuery = () => {
    state.showQuery = !state.showQuery
}

onMounted(async () => {
    await loadList();
    typeList.value = (await selectSysDictTypeSimpleList({})).data
})
</script>