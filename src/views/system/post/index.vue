<script lang='ts' setup name="SystemPost">
import { onMounted, reactive, ref, unref } from 'vue';
import type { SysPost } from "@/api/system/type";

import { parseTime, downloadUtil, randomUtil } from '@/utils/common'
import { DICT_TYPE, getDictOptions } from '@/utils/common/dict'
import { confirms, messages, notify } from '@/utils/message/MessageUtils';
import { selectPostPage, basePeri, insertPost, updatePost, getOnce, removeBatchOrOnce, exportPost } from '@/api/system/post'
import PostFrom from './postFrom.vue';


//------------------------基础模板-------------------------------------------------
const total = ref(0)
const list = ref<SysPost[]>([])
const state = reactive({

    loading: false,

    single: true,

    multiple: true,

    ids: [],

})
const queryFromRef = ref()
const openPostRef = ref()
const loading = ref(false)
const query = ref({
    pageSize: 10,
    pageNumber: 1,
    postName: '',
    postCode: '',
    status: ''
})
const exportLoding = ref(false)

// 加载数据
const loadList = async () => {
    loading.value = true
    try {
        const { data } = await selectPostPage(unref(query))
        list.value = data.records
        total.value = data.totalRow
    } finally {
        loading.value = false
    }
}

const resetFrom = () => {
    query.value = {
        pageSize: 10,
        pageNumber: 1,
        postName: '',
        postCode: '',
        status: ''
    }
    queryFromRef.value?.resetFields()
}

const handleSelectionChange = (rows?: SysPost[]) => {
    // @ts-ignore
    state.ids = rows?.map(item => item.id)
    state.single = state.ids.length != 1
    state.multiple = !state.ids.length
}

const handleDelete = async (row: SysPost) => {
    try {
        await confirms.confirm(`您确定删除当前(${row.postName || state.ids})数据吗`)
        // 确定执行
        const { msg } = await removeBatchOrOnce(row.id || state.ids as [])
        messages.success(msg)
    } catch (error: any) {
        if (error.msg) messages.error(error.msg)
    } finally {
        // 最后执行一下查询数据
        loadList();
    }
}

const openFrom = async (type: string, row?: SysPost) => {
    const currentId = row?.id || state.ids[0]
    openPostRef.value.open(type, currentId)
}

const hadnleExport = async () => {
    try {
        exportLoding.value = true
        await confirms.confirm("您确定是否下载Excel")
        const data = await exportPost(unref(query))
        downloadUtil.excel(data, `角色名称-${randomUtil().randomTime()}.xls`)
    } catch (error) { }
    finally {
        exportLoding.value = false;
    }
}

onMounted(async () => {
    await loadList()
})
</script>
<template>
    <div class='app-context'>
        <el-card>
            <!-- 表单 -->
            <el-form :inline="true" :model="query" ref="queryFromRef" class="demo-form-inline" @submit.native.prevent>
                <el-form-item label="岗位名称">
                    <el-input v-model="query.postName" placeholder="请输入岗位名称" @keyup.enter.native="loadList" clearable />
                </el-form-item>

                <el-form-item label="岗位编码">
                    <el-input v-model="query.postCode" placeholder="请输入岗位编码" @keyup.enter.native="loadList" clearable />
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
                                <svg-icon class="mr-5px" icon="ep:edit" />
                            </el-icon>
                        </template>
                        更新
                    </el-button>
                </el-col>

                <el-col :span="1.5" v-peri="[`${basePeri}remove`]">
                    <el-button type="danger" @click="handleDelete" :disabled="state.multiple" plain>
                        <template #icon>
                            <svg-icon class="mr-5px" icon="ep:delete" />
                        </template>
                        删除
                    </el-button>
                </el-col>
                <el-col :span="1.5" v-peri="[`${basePeri}export`]">
                    <el-button plain :loading="exportLoding" @click="hadnleExport">
                        <template #icon>
                            <svg-icon class="mr-5px" icon="ep:download" />
                        </template>
                        导出
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
                <el-table-column label="岗位名称" show-overflow-tooltip prop="postName" align="center" />
                <el-table-column label="岗位名称" show-overflow-tooltip prop="postCode" align="center" />

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

                            <el-button link type="danger" v-peri="[`${basePeri}remove`]" @click="handleDelete(scope.row)">
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

            <Paginations v-show="total > 0" v-model:limit="query.pageSize" v-model:pageNum="query.pageNumber" :total="total"
                @paginations="loadList">
            </Paginations>
        </el-card>

    </div>

    <PostFrom ref="openPostRef" @success="loadList"></PostFrom>
</template>

<style lang='scss' scoped></style>