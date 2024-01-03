<script setup lang="ts" name="TrainVideoNormal">
import { onMounted, reactive, ref, unref } from 'vue';
import { parseTime } from '@/utils/common'

import { DICT_TYPE, getDictOptions } from '@/utils/common/dict'
import { confirms, messages, notify } from '@/utils/message/MessageUtils';

import { pageTrainVideo, basePeri, TrainVideoApi } from '@/api/train/video';
import { selectSysDeptSimpleList } from '@/api/system/dept';
import type { SimpleTree, SysDept } from '@/api/system/type';
import type { TrainVideo } from '@/api/train/type';
import type { TreeNode } from 'element-plus';
import VideoFrom from './videoFrom.vue';
import TrainVideoChildFrom from './assignChild.vue';

const simpleDept = ref<SimpleTree<SysDept>[]>([])
const total = ref(0)
const list = ref<TrainVideo[]>([])
const loading = ref(false)
const query = ref({
    pageSize: 10,
    pageNumber: 1,
    code: '',
    createDept: '',
    name: '',
    status: '',
    idNo: ''
})
const state = reactive({
    loading: false,
    single: true,
    multiple: true,
    ids: [],
})

const queryFromRef = ref()
const videoFromRef = ref()
const trainVideoChildFrom = ref()

const resetFrom = () => {
    query.value = {
        pageSize: 10,
        pageNumber: 1,
        code: '',
        createDept: '',
        name: '',
        status: '',
        idNo: ''
    }
    queryFromRef.value?.resetFields()
    loadList()
}
// 加载数据
const loadList = async () => {
    loading.value = true
    try {
        const { data } = await pageTrainVideo(unref(query))
        simpleDept.value = (await selectSysDeptSimpleList({})).data
        list.value = data.records
        total.value = data.totalRow
    } finally {
        loading.value = false
    }
}
const handleSelectionChange = (rows?: TrainVideo[]) => {
    // @ts-ignore
    state.ids = rows?.map(item => item.id)
    state.single = state.ids.length != 1
    state.multiple = !state.ids.length
}


const handleDelete = async (row: TrainVideo) => {
    try {
        await confirms.confirm(`您确定删除当前(${row.name || state.ids})数据吗`)
        // 确定执行
        const { msg } = await TrainVideoApi.remove(row.id || state.ids as [])
        messages.success(msg)
    } catch (error: any) {
        if (error.msg) messages.error(error.msg)
    } finally {
        // 最后执行一下查询数据
        loadList();
    }
}

const openFrom = async (type: string, row?: TrainVideo) => {
    const currentId = row?.id || state.ids[0]
    await videoFromRef.value.open(type, currentId)
}

const openAssignFrom = async (row: TrainVideo) => {
    await trainVideoChildFrom.value.open(row.id)
}


const treeRef = ref()
const deptFilter = ref('')// 观察deptFilter是否发生变化|变化后watch触发函数
const onDeptClick = async (data: SimpleTree<SysDept>, node: TreeNode) => {
    query.value.createDept = data.id as string,
        await loadList()
}

const onDeptInput = (query: string) => {
    // TODO: fix typing when refactor tree-v2
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    treeRef.value!.filter(query)
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
    <div class="app-context">
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
                        <el-form-item label="警员警号" prop="code">
                            <el-input v-model="query.code" placeholder="请输入警员警号" @keyup.enter.native="loadList" clearable />
                        </el-form-item>

                        <el-form-item label="警员姓名" prop="name">
                            <el-input v-model="query.name" placeholder="请输入警员姓名" @keyup.enter.native="loadList" clearable />
                        </el-form-item>

                        <el-form-item label="身份号码" prop="idNo">
                            <el-input v-model="query.idNo" placeholder="请输入身份号码" @keyup.enter.native="loadList" clearable />
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
                        <el-table-column label="警情名称" show-overflow-tooltip prop="name" align="center" />
                        <el-table-column label="警情编码" show-overflow-tooltip prop="code" align="center" />

                        <el-table-column label="警情类型" show-overflow-tooltip align="center">
                            <template #default="scope">
                                <DictTag :type="DICT_TYPE.BIZ_TRAIN_VIDEO_TYPE" :value="scope.row.trainType"></DictTag>
                            </template>
                        </el-table-column>

                        <el-table-column label="警情级别" show-overflow-tooltip align="center">
                            <template #default="scope">
                                <DictTag :type="DICT_TYPE.BIZ_TRIAN_VIDEO_LEVEL" :value="scope.row.trainLevel"></DictTag>
                            </template>
                        </el-table-column>

                        <el-table-column label="状态" align="center">
                            <template #default="scope">
                                <DictTag :type="DICT_TYPE.COMMON_DATA_STATUS" :value="scope.row.status"></DictTag>
                            </template>
                        </el-table-column>
                        <el-table-column label="创建时间" show-overflow-tooltip align="center">
                            <template #default="scope">
                                {{ parseTime(scope.row.createTime) }}
                            </template>
                        </el-table-column>

                        <el-table-column label="操作"
                        width="200px"
                        align="center">
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

                                    <el-button link type="info" v-peri="[`${basePeri}getOne`]"
                                        @click="openAssignFrom(scope.row)">
                                        <template #icon>
                                            <!-- <i-ep-delete /> -->
                                            <svg-icon icon="ep:edit"></svg-icon>
                                        </template>
                                        视频
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
        <!-- 警员信息 -->
    </div>


    <VideoFrom @success="loadList" ref="videoFromRef" />

    <!-- 警情视频赋值 -->
    <TrainVideoChildFrom ref="trainVideoChildFrom" />
</template>

<style scoped lang="scss"></style>