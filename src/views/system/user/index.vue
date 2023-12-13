<template>
    <div class="app-context">
        <el-form :inline="true" v-show="showQuery" :model="state.params" class="demo-form-inline" @submit.native.prevent>

            <el-form-item label="用户昵称">
                <el-input v-model="state.params.userNickName" placeholder="请输入用户昵称" @keyup.enter.native="loadList"
                    clearable></el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="loadList">
                    <template #icon>
                        <i-ep-search />
                    </template>
                    查询</el-button>
                <el-button @click="resetForm">
                    <template #icon>
                        <i-ep-Refresh />
                    </template>
                    重置</el-button>
            </el-form-item>
        </el-form>

        <!-- 表单数组 -->
        <el-row :gutter="10" class="mb8">

            <el-col :span="1.5" v-peri="[`${prefixPer}save`]">
                <el-button type="success" plain>
                    <template #icon>
                        <el-icon>
                            <i-ep-Plus />
                        </el-icon>
                    </template>
                    新增
                </el-button>
            </el-col>

            <el-col :span="1.5" v-peri="[`${prefixPer}update`]">
                <el-button type="primary" plain :disabled="state.single">
                    <template #icon>
                        <el-icon>
                            <i-ep-Edit />
                        </el-icon>
                    </template>
                    更新
                </el-button>
            </el-col>

            <el-col :span="1.5" v-peri="[`${prefixPer}:remove`]">
                <el-button type="danger" :disabled="state.multiple" plain>
                    <template #icon>
                        <i-ep-delete />
                    </template>
                    删除
                </el-button>
            </el-col>

            <el-col :span="1.5" v-peri="[`${prefixPer}:download`]">
                <el-button type="warning" plain>
                    <template #icon>
                        <i-ep-Download />
                    </template>
                    下载</el-button>
            </el-col>

            <el-col>
                <rightQuery :query="showQuery" @toggleQuery="toggleQuery" @refresh="loadList" />
            </el-col>
        </el-row>
        <!-- 表单 -->
        <el-table :data="state.list" row-key="userId" v-loading="state.loading" stripe style="width: 100%">
            <el-table-column label="ID" prop="userId" align="center" />
            <el-table-column label="账号" show-overflow-tooltip prop="userName" align="center" />
            <el-table-column label="昵称" show-overflow-tooltip prop="userNickName" align="center" />
            <el-table-column label="排序"  prop="sortValue" align="center" />
            <el-table-column label="创建时间"   align="center" >
                <template #default="scope">
                {{ parseTime(scope.row.createTime) }}
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template #default="scope">
                    <el-button link v-peri="[`${prefixPer}update`]" type="primary">
                        <template #icon>
                            <el-icon>
                                <i-ep-Edit />
                            </el-icon>
                        </template>
                        更新
                    </el-button>

                    <el-button link type="danger" v-peri="[`${prefixPer}:remove`]">
                        <template #icon>
                            <i-ep-delete />
                        </template>
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <Paginations v-show="state.total > 0" :limit="state.params.pageSize" :pageNum="state.params.pageNumber"
            :total="state.total" @paginations="loadList">
        </Paginations>
    </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import{parseTime }from '@/utils/common'
import { pageUser } from '@/api/system/user/index'
import type { SysUser } from '@/api/system/type';
const prefixPer = "system:user:";
/*****************参数************************* */

const showQuery = ref(true)
const state = reactive({

    loading: false,

    single: true,

    multiple: true,

    /** 
     * 查询参数
     */
    params: {
        pageNumber: 1,
        pageSize: 10,
        userId: "",
        userName: "",
        userNickName: "",
        sex: "",
        telPhone: "",
        userEmil: "",
        sortValues: []
    },
    /** 
     * 总量
     */
    total: 0,
    /** 
     * 数据
     */
    list: [] as SysUser[],

})

/*********************** */
const loadList = (value?: any) => {
    // 重新修改后
    if (value != null) Object.assign(state.params, value)
    state.loading = true;
    pageUser(state.params).then(res => {
        state.loading = false;
        state.list = res.data.records
        state.total = res.data.totalRow
    })
}

/** 
 * 重置列表
 */
const resetForm = () => {
    Object.assign(state.params, {
        pageNumber: 1,
        pageSize: 10,
        userId: "",
        userName: "",
        userNickName: "",
        sex: "",
        telPhone: "",
        userEmil: "",
        sortValues: []
    })
    loadList();
}

const toggleQuery = () => {
    showQuery.value = !showQuery.value
}

onMounted(() => {
    
    loadList()
})
</script>