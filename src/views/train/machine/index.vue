<script lang='ts' setup name="TrainMachine">
import { onMounted, reactive, ref, unref } from 'vue';
import { parseTime } from '@/utils/common'
import { DICT_TYPE, getDictOptions } from '@/utils/common/dict'
import { confirms, messages, notify } from '@/utils/message/MessageUtils';
import { MachineApi, basePeri } from '@/api/train/machine'
import type { TrainMachine } from "@/api/train/type";
import MachineFrom from './machineFrom.vue';
import type { SimpleTree, SysDept } from '@/api/system/type';
import { selectSysDeptSimpleList } from '@/api/system/dept';
import type { TreeNode } from 'element-plus';

//------------------------基础模板-------------------------------------------------
const simpleDept = ref<SimpleTree<SysDept>[]>()

const total = ref(0)
const list = ref<TrainMachine[]>([])
const state = reactive({
    loading: false,
    single: true,
    multiple: true,
    ids: [],
})
const queryFromRef = ref()
const openMachineRef = ref()
const treeRef = ref()
const loading = ref(false)
const query = ref({
    pageSize: 10,
    createDept: '',
    pageNumber: 1,
    code: '',
    title: '',
    leader: '',
    telNumber: '',
    status: ''
})

const deptFilter = ref('')// 观察deptFilter是否发生变化|变化后watch触发函数


// 加载数据
const loadList = async () => {
    loading.value = true
    try {
        const { data } = await MachineApi.pageMachine(unref(query))
        simpleDept.value = (await selectSysDeptSimpleList({})).data
        list.value = data.records
        total.value = data.totalRow
    } finally {
        loading.value = false
    }
}
//	(data: TreeNodeData, node: TreeNode, e: MouseEvent)
const onDeptClick = async (data: SimpleTree<SysDept>, node: TreeNode) => {
    query.value.createDept = data.id as string,
        await loadList()
}

const onDeptInput = (query: string) => {
    // TODO: fix typing when refactor tree-v2
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    treeRef.value!.filter(query)
}

const resetFrom = () => {
    query.value = {
        createDept: '',
        pageSize: 10,
        pageNumber: 1,
        code: '',
        title: '',
        leader: '',
        telNumber: '',
        status: ''
    }
    queryFromRef.value?.resetFields()
    loadList()
}

const handleSelectionChange = (rows?: TrainMachine[]) => {
    // @ts-ignore
    state.ids = rows?.map(item => item.id)
    state.single = state.ids.length != 1
    state.multiple = !state.ids.length
}


const handleDelete = async (row: TrainMachine) => {
    try {
        await confirms.confirm(`您确定删除当前(${row.title || state.ids})数据吗`)
        // 确定执行
        const { msg } = await MachineApi.removeMachine(row.id || state.ids as [])
        messages.success(msg)
    } catch (error: any) {
        if (error.msg) messages.error(error.msg)
    } finally {
        // 最后执行一下查询数据
        loadList();
    }
}

const openFrom = async (type: string, row?: TrainMachine) => {
    const currentId = row?.id || state.ids[0]
    openMachineRef.value.open(type, currentId)
}
const filterMethod = (query: string, node: TreeNode) => {
    // @ts-ignore
    return node.label!.includes(query)
}

onMounted(async () => {
    await loadList()
})

</script>
<template>
    <div class='app-context'>
        <el-row :gutter="20">
            <el-col :span="4" :xs="24">
                <el-card>

                    <el-input v-model="deptFilter" @input="onDeptInput" placeholder="查询部门信息" clearable></el-input>

                    <el-tree-v2 @node-click="onDeptClick" ref="treeRef" :filter-method="filterMethod" :data="simpleDept"
                        :height="480" />
                </el-card>
            </el-col>
            <el-col :span="20" :xs="24">
                <el-card>
                    <!-- 表单 -->
                    <el-form :inline="true" :model="query" ref="queryFromRef" class="demo-form-inline"
                        @submit.native.prevent>
                        <el-form-item label="机器标题" prop="title">
                            <el-input v-model="query.title" placeholder="请输入机器标题" @keyup.enter.native="loadList"
                                clearable />
                        </el-form-item>

                        <el-form-item label="机器编码" prop="code">
                            <el-input v-model="query.code" placeholder="请输入机器编码" @keyup.enter.native="loadList" clearable />
                        </el-form-item>

                        <el-form-item>
                            <el-button type="primary" @click="loadList">查询</el-button>
                            <el-button @click="resetFrom">重置</el-button>
                        </el-form-item>
                    </el-form>
                    <!-- 相关按钮组 -->


                    <el-row :gutter="10" class="mb8">

                        <el-col :span="1.5" v-peri="[`${basePeri}save`]">
                            <el-button type="success" @click="openFrom('create')" plain>
                                <template #icon>
                                    <el-icon>
                                        <i-ep-Plus />
                                    </el-icon>
                                </template>
                                新增
                            </el-button>
                        </el-col>

                        <el-col :span="1.5" v-peri="[`${basePeri}update`]">
                            <el-button type="primary" @click="openFrom('update')" plain :disabled="state.single">
                                <template #icon>
                                    <el-icon>
                                        <i-ep-Edit />
                                    </el-icon>
                                </template>
                                更新
                            </el-button>
                        </el-col>

                        <el-col :span="1.5" v-peri="[`${basePeri}remove`]">
                            <el-button type="danger" @click="handleDelete" :disabled="state.multiple" plain>
                                <template #icon>
                                    <i-ep-delete />
                                </template>
                                删除
                            </el-button>
                        </el-col>


                    </el-row>
                </el-card>
                <el-card class="mt-5">
                    <!-- 表单 -->
                    <el-table :data="list" row-key="id" @selection-change="handleSelectionChange" v-loading="loading" stripe
                        style="width: 100%">
                        <el-table-column type="selection" width="55" align="center" />
                        <el-table-column label="ID" prop="id" align="center" />
                        <el-table-column label="机器标题" show-overflow-tooltip prop="title" align="center" />
                        <el-table-column label="机器编码" show-overflow-tooltip prop="code" align="center" />
                        <el-table-column label="负责人" show-overflow-tooltip prop="leader" align="center" />
                        <el-table-column label="联系方式" show-overflow-tooltip prop="telNumber" align="center" />
                        <el-table-column label="ipv4" show-overflow-tooltip prop="ipV4" align="center" />
                        <el-table-column label="ipv6" show-overflow-tooltip prop="ipV6" align="center" />
                        <el-table-column label="状态" align="center">
                            <template #default="scope">
                                <DictTag :type="DICT_TYPE.COMMON_DATA_STATUS" :value="scope.row.status"></DictTag>
                            </template>
                        </el-table-column>
                        <el-table-column label="创建时间" align="center">
                            <template #default="scope">
                                {{ parseTime(scope.row.createTime) }}
                            </template>
                        </el-table-column>
                        <el-table-column label="备注" show-overflow-tooltip prop="remark" align="center" />

                        <el-table-column label="操作" align="center">
                            <template #default="scope">
                                <div class="flex items-center justify-center">

                                    <el-button link type="primary" v-peri="[`${basePeri}update`]"
                                        @click="openFrom('update', scope.row)">
                                        <template #icon>
                                            <!-- <i-ep-delete /> -->
                                            <svg-icon icon="ep:edit"></svg-icon>
                                        </template>
                                        更新
                                    </el-button>

                                    <el-button link type="danger" v-peri="[`${basePeri}remove`]"
                                        @click="handleDelete(scope.row)">
                                        <template #icon>
                                            <!-- <i-ep-delete /> -->
                                            <svg-icon icon="ep:delete"></svg-icon>
                                        </template>
                                        删除
                                    </el-button>
                                </div>

                            </template>
                        </el-table-column>
                    </el-table>

                    <Paginations v-show="total > 0" v-model:limit="query.pageSize" v-model:pageNum="query.pageNumber"
                        :total="total" @paginations="loadList">
                    </Paginations>
                </el-card>

            </el-col>
        </el-row>

    </div>
    <MachineFrom ref="openMachineRef" @success="loadList" />
</template>

<style lang='scss' scoped></style>