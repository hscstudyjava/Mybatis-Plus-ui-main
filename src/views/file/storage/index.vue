<script setup lang="ts" name="FileStorage">
import { onMounted, reactive, ref, shallowRef } from 'vue';
import { getPageFileStorage, SysStorageApi, basePeri } from '@/api/files/storage';
import { type SysStorage } from '@/api/files/type';
import { confirms, messages, notify } from '@/utils/message/MessageUtils';
import { parseTime } from '@/utils/common'
import { DICT_TYPE, getDictOptions } from '@/utils/common/dict'
import storageFrom from './storageFrom.vue';
import assginValue from './assginValue.vue';
import { useAppStore } from '@/stores/app';


const query = reactive({
    pageNumber: 1,
    pageSize: 10,
    storageName: '',
    storageKey: '',
    storageType: ''
})
const state = reactive({

    loading: false,

    single: true,

    multiple: true,

    ids: [],

})
const queryRef = shallowRef()
const openFormRef = shallowRef()
const assginFromRef = shallowRef()
const list = ref()
const total = ref(0)
const loading = ref(false)

const loadList = async () => {
    loading.value = true
    try {
        const { data } = await getPageFileStorage(query)
        list.value = data.records
        total.value = data.totalPage
    } finally {
        loading.value = false
    }
}

const resetQuery = async () => {
    Object.assign(query, {
        pageNumber: 1,
        pageSize: 10,
        storageName: '',
        storageKey: '',
        storageType: ''
    })
    queryRef.value?.resetFields()
    await loadList()
}

const handleSelectionChange = (rows?: SysStorage[]) => {
    // @ts-ignore
    state.ids = rows?.map(item => item.id)
    state.single = state.ids.length != 1
    state.multiple = !state.ids.length
}

const handleDelete = async (row: SysStorage) => {
    try {
        await confirms.confirm(`您确定删除当前(${row.storageName || state.ids})数据吗`)
        // 确定执行
        const { msg } = await SysStorageApi.remove(row.id || state.ids as [])
        messages.success(msg)
    } catch (error: any) {
        if (error.msg) messages.error(error.msg)
    } finally {
        // 最后执行一下查询数据
        loadList();
    }
}
const openFrom = async (type: string, row?: SysStorage) => {
    const currentId = row?.id || state.ids[0]
    openFormRef.value.open(type, currentId)
}

const openAssgin = async (row: SysStorage) => {
    assginFromRef.value.open(row.id, row.storageType)
}

const handleCommand = (type: string, row: SysStorage) => {
    switch (type) {
        // 配置数据
        case 'setting-value':
            openAssgin(row)
            break
        // 设置系统配置
        case 'setting-config':
            break

    }
}

onMounted(async () => {
    await loadList()
})



</script>

<template>
    <div class='app-context'>
        <el-card>

            <el-form :inline="true" :model="query" ref="openFormRef" class="demo-form-inline" @submit.native.prevent>
                <el-form-item label="存储名称" prop="storageName">
                    <el-input v-model="query.storageName" placeholder="请输入存储名称" @keyup.enter.native="loadList" clearable />
                </el-form-item>

                <el-form-item label="存储字符" prop="storageKey">
                    <el-input v-model="query.storageKey" placeholder="请输入存储字符" @keyup.enter.native="loadList" clearable />
                </el-form-item>

                <el-form-item prop="storageType" label="存储类型">
                    <el-select v-model="query.storageType" class="w-full" placeholder="请选择存储类型">
                        <el-option v-for="item in getDictOptions(DICT_TYPE.SYSTEM_FILE_TYPE)" :key="item.value"
                            :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="loadList">查询</el-button>
                    <el-button @click="resetQuery">重置</el-button>
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
            <el-table :data="list" row-key="id" @selection-change="handleSelectionChange" v-loading="loading" stripe
                style="width: 100%">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column label="ID" prop="id" align="center" />
                <el-table-column label="存储名称" show-overflow-tooltip prop="storageName" align="center" />
                <el-table-column label="存储字符" show-overflow-tooltip prop="storageKey" align="center" />

                <el-table-column label="存储状态" show-overflow-tooltip align="center">
                    <template #default="scope">
                        <el-tag type="success" v-if="scope.row.storageEnable">正常</el-tag>
                        <el-tag type="error" v-else>禁用</el-tag>
                    </template>
                </el-table-column>

                <el-table-column label="存储类型" show-overflow-tooltip align="center">
                    <template #default="scope">
                        <DictTag :type="DICT_TYPE.SYSTEM_FILE_TYPE" :value="scope.row.storageType"></DictTag>

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

                            <el-button link type="danger" v-peri="[`${basePeri}remove`]" @click="handleDelete(scope.row)">
                                <template #icon>
                                    <!-- <i-ep-delete /> -->
                                    <svg-icon icon="ep:delete"></svg-icon>
                                </template>
                                删除
                            </el-button>

                            <el-dropdown @command="handleCommand($event, scope.row)" teleported>
                                <el-button link type="primary">
                                    <el-icon class="el-icon--right">
                                        <svg-icon icon="ep:arrow-down-bold"></svg-icon>
                                    </el-icon>
                                    更多
                                </el-button>
                                <template #dropdown>
                                    <el-dropdown-menu>

                                        <el-dropdown-item command="setting-value">
                                            存储配置
                                        </el-dropdown-item>

                                        <el-dropdown-item command="setting-config">
                                            默认存储
                                        </el-dropdown-item>

                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                        </div>

                    </template>
                </el-table-column>
            </el-table>

            <Paginations v-show="total > 0" v-model:limit="query.pageSize" v-model:pageNum="query.pageNumber" :total="total"
                @paginations="loadList">
            </Paginations>
        </el-card>

    </div>
    <storageFrom @success="loadList" ref="openFormRef" />
    <assginValue @success="loadList" ref="assginFromRef" />
</template>