<script setup lang="ts" name="TrainRecord">
import { onMounted, reactive, ref, shallowRef, unref } from 'vue';
import { parseTime } from '@/utils/common'

import { DICT_TYPE, getDictOptions } from '@/utils/common/dict'
import { confirms, messages, notify } from '@/utils/message/MessageUtils';
import { pageTrainRecord, type TrainRecordResult, basePeri, RecordApi } from '@/api/train/record';
import type { TrainVideo } from '@/api/train/type';
import { listTrainVideo } from '@/api/train/video';
import Details from './details.vue';
import type { SimpleTree } from '@/types';
import type { SysDept } from '@/api/system/type';
import { selectSysDeptSimpleList } from '@/api/system/dept';
import type { TreeNode } from 'element-plus';
import { useAsyncQueue } from '@vueuse/core';

const total = ref(0)
const loading = ref(false)
const query = ref({
    pageSize: 10,
    pageNumber: 1,
    trainVideoId: null,
    trainTaskId: null,
    policeIdNo: null,
    policeName: '',
    startTime: [],
    createDept: ''
})
const trainList = ref<TrainVideo[]>([])
const list = ref<TrainRecordResult[]>([])
const simpleDept = ref<SimpleTree<SysDept>[]>([])

const queryRef = shallowRef()
const detailsRef = shallowRef()


const loadList = async () => {
    loading.value = true;
    try {
        const { data } = await pageTrainRecord(unref(query))
        total.value = data.totalPage
        list.value = data.records
    } catch (error: any) { }
    finally {
        loading.value = false;
    }
}


const resetQuery = async () => {
    query.value = {
        pageSize: 10,
        pageNumber: 1,
        trainVideoId: null,
        trainTaskId: null,
        policeIdNo: null,
        policeName: '',
        startTime: [],
        createDept: ""
    }
    queryRef.value?.resetFields()
    await loadList();
}
const state = reactive({
    loading: false,
    single: true,
    multiple: true,
    ids: [] as number[] | string[],
})

const openFrom = (id: string) => {
    detailsRef.value.open(id)
}

const handleDelete = async (row?: TrainRecordResult) => {
    try {
        // 确定一下
        await confirms.confirm(`您确定删除训练数据吗?`)
        // 确定完成执行
        const { msg } = await RecordApi.remove(row?.id || state.ids)
        messages.success(msg)
        await loadList();
    } catch { }
}
const handleSelectionChange = (rows?: TrainRecordResult[]) => {
    // @ts-ignore
    state.ids = rows?.map(item => item.id)
    state.single = state.ids.length != 1
    state.multiple = !state.ids.length
}


const loadTrainList = async () => {
    const requests = [listTrainVideo({}), selectSysDeptSimpleList({})];
    const [trainResult, deptResult] = await Promise.all(requests);
    trainList.value = trainResult.data as Array<TrainVideo>
    simpleDept.value = deptResult.data as SimpleTree<SysDept>[]
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
    await loadList();
    await loadTrainList();
})

</script>

<template>
    <div class="app-context">
        <el-row :gutter="10">
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
                    <el-form :inline="true" :model="query" ref="queryRef" @submit.native.prevent>


                        <el-form-item label="身份号码" prop="policeIdNo">
                            <el-input v-model="query.policeIdNo"
                            class="!w-240px"
                            placeholder="请输入身份号码" @keyup.enter.native="loadList"
                                clearable />
                        </el-form-item>

                        <el-form-item label="训练警情" prop="trainVideoId">
                            <el-select v-model="query.trainVideoId" filterable
                            class="!w-240px"
                            placeholder="请选择训练警情">
                                <el-option v-for="item in trainList" :key="item.id" :label="item.name" :value="item.id" />
                            </el-select>
                        </el-form-item>

                        <el-form-item label="训练时间" prop="trainVideoId">
                            <el-date-picker v-model="query.startTime"
                                :default-time="[new Date('1 00:00:00'), new Date('1 23:59:59')]" 
                                end-placeholder="结束日期" start-placeholder="开始日期" type="daterange"
                                value-format="YYYY-MM-DD HH:mm:ss" />

                        </el-form-item>

                        <!-- 训练时间 -->


                        <el-form-item>
                            <el-button type="primary" @click="loadList">
                                <template #icon>
                                    <svg-icon class="mr-5px" icon="ep:search" />
                                </template>
                                查询
                            </el-button>

                            <el-button @click="resetQuery">
                                <template #icon>
                                    <svg-icon class="mr-5px" icon="ep:refresh" />
                                </template>
                                重置
                            </el-button>


                            <el-button type="danger" @click="handleDelete" :disabled="state.multiple" plain>
                                <template #icon>
                                    <svg-icon class="mr-5px" icon="ep:delete" />
                                </template>
                                删除
                            </el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
                <el-card class="mt-5">
                    <!-- 表单 -->
                    <el-table :data="list" row-key="id" @selection-change="handleSelectionChange" v-loading="loading" stripe
                        style="width: 100%">
                        <el-table-column type="selection" width="55" align="center" />
                        <el-table-column type="index" label="Index" align="center" />
                        <el-table-column label="警情名称" prop="bizTrainVideo.name" show-overflow-tooltip align="center" />
                        <el-table-column label="所属部门" prop="dept.deptName" show-overflow-tooltip align="center" />
                        <el-table-column label="警员名称" prop="policeInfo.name" show-overflow-tooltip align="center" />
                        <el-table-column label="身份号码" prop="policeInfo.idNo" show-overflow-tooltip align="center" />
                        <el-table-column label="上传IP" show-overflow-tooltip prop="uploadIp" align="center" />
                        <el-table-column label="发送版本" show-overflow-tooltip prop="uploadClientVersion" align="center" />
                        <el-table-column label="训练时间" show-overflow-tooltip align="center">
                            <template #default="scope">
                                {{ parseTime(scope.row.trainTime) }}
                            </template>
                        </el-table-column>

                        <el-table-column label="操作" width="200px" align="center">
                            <template #default="scope">
                                <div class="flex items-center justify-center">
                                    <el-button link type="primary" v-peri="[`${basePeri}update`]"
                                        @click="openFrom(scope.row.id)">
                                        <template #icon>
                                            <svg-icon class="mr-5px" icon="ep:view"></svg-icon>
                                        </template>
                                        查看
                                    </el-button>

                                    <el-button link type="danger" v-peri="[`${basePeri}remove`]"
                                        @click="handleDelete(scope.row)">
                                        <template #icon>
                                            <svg-icon class="mr-5px" icon="ep:delete"></svg-icon>
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
    <Details ref="detailsRef" />
</template>