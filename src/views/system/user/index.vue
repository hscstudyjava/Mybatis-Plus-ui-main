<template>
    <div class="app-context">
        <el-card>
            <el-form :inline="true" v-show="showQuery" :model="state.params" class="demo-form-inline"
                @submit.native.prevent>

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
                    <el-button type="success" plain @click="openUserFrom('create', undefined)">
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

                <rightQuery :query="showQuery" @toggleQuery="toggleQuery" @refresh="loadList" />
            </el-row>
        </el-card>

        <el-card class="mt-10">
            <!-- 表单 -->
            <el-table :data="state.list" row-key="userId" v-loading="state.loading" stripe style="width: 100%">
                <el-table-column label="ID" prop="userId" align="center" />
                <el-table-column label="账号" show-overflow-tooltip prop="userName" align="center" />
                <el-table-column label="昵称" show-overflow-tooltip prop="userNickName" align="center" />
                <el-table-column label="排序" prop="sortValue" align="center" />
                <el-table-column label="性别" align="center">
                    <template #default="scope">
                        <DictTag :value="scope.row.sex" :type="DICT_TYPE.USER_SEX"></DictTag>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" align="center">
                    <template #default="scope">
                        {{ parseTime(scope.row.createTime) }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template #default="scope">
                        <el-button link v-peri="[`${prefixPer}update`]" @click="openUserFrom('update', scope.row.userId)"
                            type="primary">
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

                        <el-dropdown @command="handleCommand($event, scope.row)" teleported>
                            <el-button link type="primary">
                                更多<el-icon class="el-icon--right">
                                    <svg-icon icon="ep:right"></svg-icon>
                                </el-icon>
                            </el-button>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item command="reset">重置密码</el-dropdown-item>
                                    <el-dropdown-item command="auth">授权角色</el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </template>
                </el-table-column>
            </el-table>

            <Paginations v-show="state.total > 0" v-model:limit="state.params.pageSize"
                v-model:pageNum="state.params.pageNumber" :total="state.total" @paginations="loadList">
            </Paginations>
        </el-card>

        <!-- 用户 -->
        <userFrom :post-list="simplePost" :dept-list="simpleDept" @success="loadList" ref="userFromRef" />

        <!-- 授权 -->
        <authRole :role-list="simpleRole" ref="authFromRef" @success="loadList" />
    </div>
</template>
<script setup lang="ts">
import { DICT_TYPE, getStrDictOptions } from '@/utils/common/dict'
import userFrom from './userFrom.vue';
import { onMounted, reactive, ref } from 'vue';
import { parseTime } from '@/utils/common'
import { pageUser, resetPassWord } from '@/api/system/user/index'
import type { SimpleTree, SysDept, SysPost, SysRole, SysUser } from '@/api/system/type';
import { selectSysDeptSimpleList } from '@/api/system/dept';
// @ts-ignore
import { selectSimplePost } from '@/api/system/post';
import { confirms, messages } from '@/utils/message/MessageUtils';
import { queryRoleAllList } from '@/api/system/role';
import AuthRole from './authRole.vue';
const prefixPer = "system:user:";
/*****************参数************************* */
const userFromRef = ref()
const authFromRef = ref()
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

// 默认部门信息
const simpleDept = ref<SimpleTree<SysDept>[]>([]);
const simplePost = ref<SysPost[]>([]);
const simpleRole = ref<SysRole[]>([]);

/*********************** */
const loadList = async () => {
    state.loading = true
    try {
        // 重新修改后
        const { data } = await pageUser(state.params)
        state.total = data.totalRow
        state.list = data.records;

    } finally {
        state.loading = false;
    }
}

const loadingOtherList = async () => {
    try {
        // 加载部门信息
        simpleDept.value = (await selectSysDeptSimpleList({})).data
        simplePost.value = (await selectSimplePost({})).data
        simpleRole.value = (await queryRoleAllList({})).data
    } finally {


    }
}

const openUserFrom = async (type: string, userId?: number) => {
    await loadingOtherList()
    userFromRef.value.open(type, userId)
}


const handleCommand = (type: string, row: SysUser) => {

    switch (type) {

        case 'reset':
            resetPasswd(row.userId!!)
            break
        case 'auth':
            authFromOpen(row.userId!!)
            break

    }
}
const authFromOpen = (userId: number) => {
    authFromRef.value.open(userId)
}

/** 
 * 重置密码
 */
const resetPasswd = async (userId: number) => {
    try {
        const { value } = await confirms.prompt("请填充重置密码", "重置密码", "info")
        // 判断密码是否为空
        if (value === "" || value === null) {
            messages.error("填写密码不能为空")
            return
        }
        const { msg } = await resetPassWord(userId, value)
        messages.success(msg)
    } catch (error: any) {
        messages.success(error.msg)
    }
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

onMounted(async () => {
    await loadList()
    await loadingOtherList()
})
</script>