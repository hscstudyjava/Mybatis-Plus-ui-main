<script setup lang="ts" name="TrainRecord">
import { onMounted, reactive, ref, shallowRef, unref } from 'vue';
import { parseTime } from '@/utils/common'

import { DICT_TYPE, getDictOptions } from '@/utils/common/dict'
import { confirms, messages, notify } from '@/utils/message/MessageUtils';
import { pageTrainRecord, type TrainRecordResult, basePeri } from '@/api/train/record';
import type { TrainVideo } from '@/api/train/type';
import { listTrainVideo } from '@/api/train/video';

const total = ref(0)
const loading = ref(false)
const query = ref({
    pageSize: 10,
    pageNumber: 1,
    trainVideoId: null,
    trainTaskId: null,
    policeIdNo: null,
    policeName: '',
    startTime:[]
})
const trainList = ref<TrainVideo[]>([])
const list = ref<TrainRecordResult[]>([])
const queryRef = shallowRef()
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
        startTime:[]
    }
    queryRef.value?.resetFields()
    await loadList();
}
const state = reactive({
    loading: false,
    single: true,
    multiple: true,
    ids: [],
})

const openFrom = (type: string) => {

}

const handleDelete = (row: TrainRecordResult) => {

}
const handleSelectionChange = (rows?: TrainRecordResult[]) => {
    // @ts-ignore
    state.ids = rows?.map(item => item.id)
    state.single = state.ids.length != 1
    state.multiple = !state.ids.length
}
const loadTrainList = async () => {
    trainList.value = (await listTrainVideo({})).data
}
onMounted(async () => {
    await loadList();
    await loadTrainList();
})

</script>

<template>
    <div class="app-context">
        <el-card>
            <!-- 表单 -->
            <el-form :inline="true" :model="query" ref="queryRef" @submit.native.prevent>
                <el-form-item label="警员名称" prop="policeName">
                    <el-input v-model="query.policeName" placeholder="请输入警员名称" @keyup.enter.native="loadList" clearable />
                </el-form-item>

                <el-form-item label="身份号码" prop="policeIdNo">
                    <el-input v-model="query.policeIdNo" placeholder="请输入身份号码" @keyup.enter.native="loadList" clearable />
                </el-form-item>

                <el-form-item label="训练警情" prop="trainVideoId">
                    <el-select v-model="query.trainVideoId" filterable placeholder="请选择训练警情">
                        <el-option v-for="item in trainList" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                </el-form-item>

                <el-form-item label="训练警情" prop="trainVideoId">
                    <el-date-picker v-model="query.startTime" type="datetimerange" start-placeholder="开始时间"
                        end-placeholder="结束时间" format="YYYY-MM-DD HH:mm:ss" date-format="YYYY/MM/DD ddd"
                        time-format="A hh:mm:ss" />
                </el-form-item>

                <!-- 训练时间 -->


                <el-form-item>
                    <el-button type="primary" @click="loadList">
                        <template #icon>
                            <svg-icon icon="ep:search" />
                        </template>
                        查询</el-button>
                    <el-button @click="resetQuery">
                        <template #icon>
                            <svg-icon icon="ep:refresh" />
                        </template>
                        重置</el-button>
                </el-form-item>
            </el-form>

            <el-row :gutter="10">

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
                <el-table-column type="index" label="Index" align="center" />
                <el-table-column label="警情名称" prop="bizTrainVideo.name" align="center" />
                <el-table-column label="警员名称" prop="policeInfo.name" align="center" />
                <el-table-column label="身份号码" prop="policeInfo.idNo" align="center" />
                <el-table-column label="上传IP" prop="uploadIp" align="center" />
                <el-table-column label="发送版本" prop="uploadClientVersion" align="center" />
                <el-table-column label="训练时间" show-overflow-tooltip align="center">
                    <template #default="scope">
                        {{ parseTime(scope.row.trainTime) }}
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="200px" align="center">
                    <template #default="scope">
                        <div class="flex items-center justify-center">
                            <el-button link type="primary" v-peri="[`${basePeri}update`]" @click="openFrom('update')">
                                <template #icon>
                                    <svg-icon icon="ep:edit"></svg-icon>
                                </template>
                                更新
                            </el-button>

                            <el-button link type="danger" v-peri="[`${basePeri}remove`]" @click="handleDelete(scope.row)">
                                <template #icon>
                                    <svg-icon icon="ep:delete"></svg-icon>
                                </template>
                                删除
                            </el-button>
                        </div>

                    </template>
                </el-table-column>
            </el-table>

            <Paginations v-show="total > 0" v-model:limit="query.pageSize" v-model:pageNum="query.pageNumber" :total="total"
                @paginations="loadList">
            </Paginations>
        </el-card>
    </div>
</template>