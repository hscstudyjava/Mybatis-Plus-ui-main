<template>
    <div class="app-context">
        <el-card class="box-card">
            <el-form :inline="true" v-show="state.showQuery" :model="state.params" @submit.native.prevent>

                <el-form-item label="标题">
                    <el-input v-model="state.params.title" placeholder="请输入字典标题" @keyup.enter.native="loadList"
                        clearable></el-input>
                </el-form-item>

                <el-form-item label="字符">
                    <el-input v-model="state.params.key" placeholder="请输入字典字符" @keyup.enter.native="loadList"
                        clearable></el-input>
                </el-form-item>

                <el-form-item label="类型">
                    <el-input v-model="state.params.type" placeholder="请输入字典字符" @keyup.enter.native="loadList"
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
                <el-col :span="1.5" v-peri="[basePeri + 'save']">
                    <!-- @click="handleInsert(ruleFormRef)" -->
                    <el-button type="success" plain @click="handleInsert()">
                        <template #icon>
                            <el-icon>
                                <i-ep-Plus />
                            </el-icon>
                        </template>
                        新增
                    </el-button>
                </el-col>

                <el-col :span="1.5" v-peri="[basePeri + 'update']">
                    <!--  -->
                    <el-button type="primary" plain :disabled="state.single" @click="handleUpdate(undefined, ruleFormRef)">
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

                <rightQuery style="float: right;" :query="state.showQuery" @toggleQuery="toggleQuery" @refresh="loadList" />
            </el-row>
        </el-card>
        <el-card class="mt-10">
            <el-table :data="state.list" v-loading="state.loading" @selection-change="handleSelectionChange" stripe
                style="width: 100%">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column label="ID" prop="id" align="center" />
                <el-table-column label="标题" show-overflow-tooltip prop="title" align="center" />
                <el-table-column label="字符" show-overflow-tooltip prop="key" align="center" />
                <el-table-column label="类型" show-overflow-tooltip align="center">
                    <template #default="scope">
                        <DictTag :type="DICT_TYPE.SYSTEM_MODULE" :value="scope.row.type"></DictTag>
                    </template>
                </el-table-column>
                <el-table-column label="排序" prop="sortValue" align="center" />

                <el-table-column label="状态" align="center">
                    <template #default="scope">
                        <DictTag :type="DICT_TYPE.COMMON_DATA_STATUS" :value="scope.row.status"></DictTag>
                    </template>
                </el-table-column>
                <el-table-column label="备注" show-overflow-tooltip prop="remark" align="center" />
                <el-table-column label="创建时间" align="center">
                    <template #default="scope">
                        {{ parseTime(scope.row.createTime) }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="200px">
                    <template #default="scope">
                        <el-button link v-peri="[`${basePeri}update`]" type="primary"
                            @click="handleUpdate(scope.row.id, ruleFormRef)">
                            <template #icon>
                                <el-icon>
                                    <i-ep-Edit />
                                </el-icon>
                            </template>
                            更新
                        </el-button>

                        <router-link :to="'/system/dict/value/' + scope.row.id">
                            <el-button link type="primary">数据</el-button>
                        </router-link>

                        <el-button link type="danger" v-peri="[`${basePeri}:remove`]" @click="handleDelete(scope.row)">
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
        </el-card>

        <!-- 弹窗 -->
        <el-dialog v-model="state.open" :close-on-click-modal="false" :draggable="true" :align-center="true" width="50%">
            <template #header="{ close, titleId, titleClass }">
                <div class="my-header">
                    <h6 :id="titleId" :class="titleClass">{{ state.title }}</h6>
                    <el-divider />

                </div>
            </template>
            <el-form ref="ruleFormRef" :model="state.form" :rules="rules" status-icon label-width="100px">
                <el-form-item label="标题" prop="title">
                    <el-input v-model="state.form.title" placeholder="请输入字典标题" clearable></el-input>
                </el-form-item>

                <el-form-item prop="key">
                    <template #label>
                        <span>
                            字典字符
                            <el-tooltip placement="top">
                                <template #content>模板字符用于保存至缓存:(system_notice_template)</template>
                                <svg-icon iconClass="question"></svg-icon>
                            </el-tooltip>
                        </span>
                    </template>
                    <el-input v-model="state.form.key" :disabled="state.form.id !== undefined" placeholder="请输入字典字符"
                        clearable></el-input>
                </el-form-item>

                <el-form-item label="类型" prop="type">
                    <el-select v-model="state.form.type" placeholder="请选择模块类型" class="w-full">
                        <el-option v-for="item in getDictOptions(DICT_TYPE.SYSTEM_MODULE)" :key="item.value"
                            :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>

                <el-form-item label="类型" prop="sortValue">
                    <el-input-number v-model="state.form.sortValue" style="width: 100%;" :min="0" :max="100"
                        controls-position="right" />
                </el-form-item>

                <el-form-item label="备注" prop="remark">
                    <el-input v-model="state.form.remark" placeholder="请输入备注" :autosize="{ minRows: 2, maxRows: 4 }"
                        type="textarea" clearable></el-input>
                </el-form-item>

            </el-form>

            <template #footer>
                <el-divider />
                <span class="dialog-footer">
                    <el-button type="primary" @click="submit">
                        提交
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import {
    selectSysDictTypeList,
    insertSysDictType,
    updateSysDictType,
    getSysDictTypeId,
    removeSysDictType,
    basePeri
}
    from '@/api/system/dict/type';
import { onMounted, reactive, ref } from 'vue';
import type { SysDictType } from '@/api/system/type';
import { confirms, messages, notify } from '@/utils/message/MessageUtils';
import type { FormInstance, FormRules } from 'element-plus';
import { parseTime } from '@/utils/common'
import { DICT_TYPE, getDictOptions } from '@/utils/common/dict'

const ruleFormRef = ref()
const rules = reactive({
    title: [
        { message: '字典标题必须填写', trigger: 'blur', required: true },
        { min: 2, max: 200, message: '字典标题长度 2 - 200之间', trigger: 'blur' }
    ],

    key: [
        { message: '字典字符必须填写', trigger: 'blur', required: true },
        { min: 2, max: 200, message: '字典字符长度 2 - 200之间', trigger: 'blur' }
    ],

    type: [
        { message: '字典类型必须填写', trigger: 'change', required: true },
    ]
})
const state = reactive({

    single: true,

    multiple: true,

    showQuery: true,

    expandAll: false,

    loading: false,

    open: false,

    title: '',

    ids: [],

    list: [] as Array<SysDictType>,

    total: 0,

    params: {
        title: undefined,
        key: undefined,
        type: undefined,
        pageNumber: 1,
        pageSize: 10
    },

    form: {
        id: undefined,
        title: undefined,
        key: undefined,
        type: undefined,
        status: "0",
        sortValue: 0,
        remark: undefined,
    }


})


const loadList = (value?: any) => {
    if (value != null) Object.assign(state.params, value)
    state.loading = true
    selectSysDictTypeList(state.params).then(res => {
        state.list = res.data.records
        state.total = res.data.totalRow
        state.loading = false
    })
}

const handleInsert = (formEl?: FormInstance | undefined) => {
    state.open = true;
    state.title = "新增模板"
    resetFormRule(formEl);// 清空表单
}

const handleUpdate = (id?: string, formEl?: FormInstance) => {
    state.open = true;
    state.title = "更新角色"
    const currnetId = id || state.ids;
    // @ts-ignore
    getSysDictTypeId(currnetId).then(res => {
        resetFormRule(formEl);// 清空表单
        Object.assign(state.form, res.data)
    }).catch(e => {
        state.open = false;
    })
}

const handleDelete = (row?: SysDictType) => {
    if (row) {
        confirms
            .confirm(`您是否删除${row?.title}消息模板数据?`)
            .then((res) => {
                removeSysDictType(row?.id).then((res) => {
                    loadList();
                    if (res.data.error) notify.error("系统提示", res.data.error, true, true)
                    if (res.data.success) notify.success("系统提示", res.data.success, true, true)

                });
            })
    } else {
        confirms
            .confirm(`您是否删除${state.ids}这些数据?`)
            .then((res) => {
                // @ts-ignore
                removeSysDictType(state.ids).then((res) => {
                    loadList();
                    if (res.data.error) notify.error("系统提示", res.data.error, true, true)
                    if (res.data.success) notify.success("系统提示", res.data.success, true, true)
                });
            })
    }
}


const submit = () => {
    if (!ruleFormRef) return
    ruleFormRef.value.validate((v: boolean) => {
        if (!v) {
            notify.error('系统提示', '抱歉您无法提交表单')
            return
        }
        if (state.form.id) {
            //@ts-ignore
            updateSysDictType(state.form)
                .then(res => {
                    messages.success(res.msg)
                    state.open = false;
                    loadList()
                }).catch(error => {
                    // messages.error(error.msg)
                    loadList()
                    // state.open = false;
                })
        } else {
            //@ts-ignore
            insertSysDictType(state.form).then(res => {
                messages.success(res.msg)
                state.open = false;
                loadList();
            }).catch(error => {
                // messages.error(error.msg)
                loadList()
                // state.open = false;
            })
        }

    })


}

const handleSelectionChange = (rows?: SysDictType[]) => {
    // @ts-ignore
    state.ids = rows?.map(item => item.id)
    state.single = state.ids.length != 1
    state.multiple = !state.ids.length
}

const resetForm = () => {
    Object.assign(state.form,
        {
            title: undefined,
            key: undefined,
            type: undefined,
            pageNumber: 1,
            pageSize: 10
        })
    loadList();
}


const resetFormRule = (formEl?: FormInstance | undefined) => {
    // 重新赋值
    Object.assign(state.form, {
        id: undefined,
        title: undefined,
        key: undefined,
        type: undefined,
        status: "0",
        sortValue: 0,
        remark: undefined,
    })
    if (!formEl) return
    formEl.resetFields()
}
const toggleQuery = () => {
    state.showQuery = !state.showQuery
}

onMounted(() => {
    loadList()
})

</script>