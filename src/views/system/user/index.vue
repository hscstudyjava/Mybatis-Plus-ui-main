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
                    <el-form ref="queryFromRef" :inline="true" v-show="showQuery" :model="state.params"
                        class="demo-form-inline" @submit.native.prevent>


                        <el-form-item label="用户账号" prop="userName">
                            <el-input v-model="state.params.userName" placeholder="请输入用户账号" @keyup.enter.native="loadList"
                                clearable></el-input>
                        </el-form-item>


                        <el-form-item label="用户昵称" prop="userNickName">
                            <el-input v-model="state.params.userNickName" placeholder="请输入用户昵称"
                                @keyup.enter.native="loadList" clearable></el-input>
                        </el-form-item>

                        <el-form-item label="手机号码" prop="telPhone">
                            <el-input v-model="state.params.telPhone" placeholder="请输入手机号码" @keyup.enter.native="loadList"
                                clearable></el-input>
                        </el-form-item>

                        <el-form-item label="联系邮箱" prop="userEmil">
                            <el-input v-model="state.params.userEmil" placeholder="请输入联系邮箱" @keyup.enter.native="loadList"
                                clearable></el-input>
                        </el-form-item>
                        <el-form-item label="创建时间" prop="createTimeList">
                            <el-date-picker v-model="state.params.createTimeList" type="datetimerange"
                                start-placeholder="开始时间" end-placeholder="结束时间" format="YYYY-MM-DD HH:mm:ss"
                                date-format="YYYY/MM/DD ddd" time-format="A hh:mm:ss" />

                        </el-form-item>

                        <el-form-item>
                            <el-button type="primary" @click="loadList">
                                <template #icon>
                                    <i-ep-search />
                                </template>
                                查询</el-button>
                            <el-button @click="resetQueryFrom">
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
                            <el-button type="primary" plain @click="openUserFrom('update', state.ids[0])"
                                :disabled="state.single">
                                <template #icon>
                                    <el-icon>
                                        <i-ep-Edit />
                                    </el-icon>
                                </template>
                                更新
                            </el-button>
                        </el-col>

                        <el-col :span="1.5" v-peri="[`${prefixPer}:remove`]">
                            <el-button type="danger" :disabled="state.multiple" @click="handleRemove" plain>
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
                    <el-table :data="state.list" row-key="userId" @selection-change="handleSelectionChange"
                        v-loading="state.loading" stripe style="width: 100%">
                        <el-table-column type="selection" width="55" align="center" />
                        <el-table-column label="ID" prop="userId" align="center" />
                        <el-table-column label="账号" show-overflow-tooltip prop="userName" align="center" />
                        <el-table-column label="昵称" show-overflow-tooltip prop="userNickName" align="center" />
                        <el-table-column label="排序" prop="sortValue" align="center" />
                        <el-table-column label="手机号码" show-overflow-tooltip prop="telPhone" align="center" />
                        <el-table-column label="用户邮箱" show-overflow-tooltip  prop="userEmil" align="center" />
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
                                <div class="flex items-center justify-center">

                                    <el-button link v-peri="[`${prefixPer}update`]"
                                        @click="openUserFrom('update', scope.row.userId)" type="primary">
                                        <template #icon>
                                            <el-icon>
                                                <i-ep-Edit />
                                            </el-icon>
                                        </template>
                                        更新
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


                                                <el-dropdown-item command="remove"
                                                    v-if="auth().hasPermiOr([`${prefixPer}remove`])">删除用户</el-dropdown-item>

                                                <el-dropdown-item command="reset"
                                                    v-if="auth().hasPermiOr([`${prefixPer}reset-passwd`])">重置密码</el-dropdown-item>


                                                <el-dropdown-item command="auth"
                                                    v-if="auth().hasPermiOr([`${prefixPer}auth-role`])">授权角色</el-dropdown-item>


                                            </el-dropdown-menu>
                                        </template>
                                    </el-dropdown>
                                </div>

                            </template>
                        </el-table-column>
                    </el-table>

                    <Paginations v-show="state.total > 0" v-model:limit="state.params.pageSize"
                        v-model:pageNum="state.params.pageNumber" :total="state.total" @paginations="loadList">
                    </Paginations>
                </el-card>
            </el-col>

        </el-row>

        <!-- 用户 -->
        <userFrom :post-list="simplePost" :dept-list="simpleDept" @success="loadList" ref="userFromRef" />

        <!-- 授权 -->
        <authRole :role-list="simpleRole" ref="authFromRef" @success="loadList" />
    </div>
</template>
<script setup lang="ts" name="SystemUser">
import { DICT_TYPE, getStrDictOptions } from '@/utils/common/dict'
import userFrom from './userFrom.vue';
import { onMounted, reactive, ref } from 'vue';
import { parseTime } from '@/utils/common'
import { pageUser, removeUser, resetPassWord } from '@/api/system/user/index'
import type { SimpleTree, SysDept, SysPost, SysRole, SysUser } from '@/api/system/type';
import { selectSysDeptSimpleList } from '@/api/system/dept';
// @ts-ignore
import { selectSimplePost } from '@/api/system/post';
import { confirms, messages } from '@/utils/message/MessageUtils';
import { queryRoleAllList } from '@/api/system/role';
import AuthRole from './authRole.vue';
import type { TreeNode } from 'element-plus';
import { auth } from '@/hooks/web/auth';
const prefixPer = "system:user:";
/*****************参数************************* */
const deptFilter = ref('')// 观察deptFilter是否发生变化|变化后watch触发函数
const userFromRef = ref()
const authFromRef = ref()
const showQuery = ref(true)
const state = reactive({

    loading: false,

    single: true,

    multiple: true,

    ids: [],

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
        sortValues: [],
        createDept: "",
        createTimeList: []
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
const treeRef = ref();
const queryFromRef = ref();
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

const handleSelectionChange = (rows?: SysUser[]) => {
    // @ts-ignore
    state.ids = rows?.map(item => item.userId)
    state.single = state.ids.length != 1
    state.multiple = !state.ids.length
}

const loadingOtherList = async () => {
    try {
        /*     // 加载部门信息
            simpleDept.value = (await selectSysDeptSimpleList({})).data
            simplePost.value = (await selectSimplePost({})).data
            simpleRole.value = (await queryRoleAllList({})).data */
        const requests = [
            selectSysDeptSimpleList({}),
            selectSimplePost({}),
            queryRoleAllList({})
        ];
        // 同时触发这写函数
        const [deptResponse, postResponse, roleResponse] = await Promise.all(requests);
        simpleDept.value = deptResponse.data as SimpleTree<SysDept>[];
        simplePost.value = postResponse.data as SysPost[];
        simpleRole.value = roleResponse.data as SysRole[];
    } finally { }
}

const openUserFrom = async (type: string, userId?: number) => {
    await loadingOtherList()
    userFromRef.value.open(type, userId)
}

const resetQueryFrom = () => {
    Object.assign(state.params, {
        pageNumber: 1,
        pageSize: 10,
        userId: "",
        userName: "",
        userNickName: "",
        sex: "",
        telPhone: "",
        userEmil: "",
        sortValues: [],
        createDept: "",
        createTimeList: []
    })
    if(queryFromRef){
        queryFromRef.value.resetFields();
    }
    loadList();
}


const handleCommand = (type: string, row: SysUser) => {

    switch (type) {

        case 'reset':
            resetPasswd(row.userId!!)
            break
        case 'auth':
            authFromOpen(row.userId!!)
            break

        case 'remove':
            // 
            handleRemove(row)
            break;

    }
}
const authFromOpen = (userId: number) => {
    authFromRef.value.open(userId)
}

const handleRemove = async (user: SysUser) => {
    try {
        await confirms.confirm(`你确定删除当前用户信息:(${user.userName || state.ids})`)
        const { msg } = await removeUser(user.userId || state.ids)
        messages.success(msg)
    } catch (error: any) {
        if (error.msg) {
            messages.error(error.msg)
        }
    }
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
        if (error.msg) {
            messages.error(error.msg)
        }
    }
}
const filterMethod = (query: string, node: TreeNode) => {
    // @ts-ignore
    return node.label!.includes(query)
}
//	(data: TreeNodeData, node: TreeNode, e: MouseEvent)
const onDeptClick = async (data: SimpleTree<SysDept>, node: TreeNode) => {
    state.params.createDept = data.id as string,
        await loadList()
}

const onDeptInput = (query: string) => {
    // TODO: fix typing when refactor tree-v2
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    treeRef.value!.filter(query)
}

const toggleQuery = () => {
    showQuery.value = !showQuery.value
}

onMounted(async () => {
    await loadList()
    await loadingOtherList()
})
</script>