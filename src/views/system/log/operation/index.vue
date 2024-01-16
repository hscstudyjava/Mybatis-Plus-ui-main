<script lang='ts' setup name="SystemLogOperation">
import { onMounted, reactive, ref } from 'vue';
import { parseTime } from '@/utils/common'
import { DICT_TYPE, getDictOptions, getIntDictOptions } from '@/utils/common/dict'
import { confirms, messages, notify } from '@/utils/message/MessageUtils';
import { pageOperation, basePeri, removeOperation, getOperation, clearOperation } from '@/api/system/log/operation';
import type { SysOperatorLog } from '@/api/system/type';
import { object } from 'vue-types';
//------------------------基础模板-------------------------------------------------
const state = reactive({

    loading: false,

    single: true,

    multiple: true,

    total: 0,

    open: false,

    ids: [],

    params: {
        pageNumber: 1,
        pageSize: 10,
        operatorType: undefined,
        operateTitle: "",
        businessType: "",
        operateIp: "",
        operateAddress: "",
        operateMethod: "",
        operateUserName: ""
    },

    list: []

})

const from = reactive<SysOperatorLog>({
    id: 0,
    operatorType: 0,
    operateTitle: '',
    businessType: '',
    operateIp: '',
    operateAddress: '',
    operateMethod: '',
    operateUserName: '',
    requestMethod: '',
    requestParams: '',
    requestUrl: '',
    responseParams: '',
    status: '',
    errorMsg: '',
    operateTime: '',
    timeStamp: 0
})

const paramRef = ref()

const resetParam = () => {
    Object.assign(state.params, {
        pageNumber: 1,
        pageSize: 10,
        operatorType: undefined,
        operateTitle: "",
        businessType: "",
        operateIp: "",
        operateAddress: "",
        operateMethod: "",
        operateUserName: ""
    })
    loadList()
    if (paramRef) {
        paramRef.value?.resetFields()
    }
}

const loadList = async () => {
    state.loading = true
    try {
        const { data } = await pageOperation(state.params)
        state.list = data.records as [];
        state.total = data.totalRow;
        state.loading = false;
    } catch (error: any) {
        if (error.msg) {
            messages.error(error.msg)
        }
    }

}
const handleSelectionChange = (rows?: SysOperatorLog[]) => {
    // @ts-ignore
    state.ids = rows?.map(item => item.id)
    state.single = state.ids.length != 1
    state.multiple = !state.ids.length
}

const handleDelete = async (row: SysOperatorLog) => {
    try {
        await confirms.confirm(`您是否删除操作日志:(${row.operateTitle || state.ids})`)
        const { msg } = await removeOperation(row.id || state.ids as [])
        await loadList();
    } catch (error: any) {
        if (error.msg) {
            messages.error(error.msg)
        }
    }
}

const openOnceLog = async (row: SysOperatorLog) => {
    state.open = true;
    try {
        const { data } = await getOperation(row.id)
        Object.assign(from, data)
    } catch (error: any) {
        if (error.msg) {
            state.open = false;
            messages.error(error.msg)
        }
    }
}

const clearLog = async () => {
    try {
        const { value } = await confirms.prompt(`请您确定清空操作日志信息`, '请您输入Y/y确定清空日志信息!!!')
        if (value !== '' && value === 'Y' || value === "y") {
            await clearOperation()
            messages.success('清除成功')
            await loadList()
        }
    } catch (error: any) {
        if (error.msg) {
            messages.error(error.msg)
            await loadList()
        }
    }
}

onMounted(async () => {
    await loadList()
})


</script>
<template>
    <div class='app-context'>

        <el-card class="box-card" ref="paramRef">
            <el-form :inline="true" :model="state.params" @submit.native.prevent>

                <el-form-item label="请求标题" prop="operateTitle">
                    <el-input v-model="state.params.operateTitle" placeholder="请输入请求标题" @keyup.enter.native="loadList"
                        clearable></el-input>
                </el-form-item>

                <el-form-item label="所属地址" prop="operateAddress">
                    <el-input v-model="state.params.operateAddress" placeholder="请输入所属地址" @keyup.enter.native="loadList"
                        clearable></el-input>
                </el-form-item>


                <el-form-item>
                    <el-button type="primary" @click="loadList">
                        <template #icon>
                            <i-ep-search />
                        </template>
                        查询</el-button>

                    <el-button @click="resetParam">
                        <template #icon>
                            <i-ep-Refresh />
                        </template>
                        重置</el-button>

                    <el-button type="danger" v-peri="[`${basePeri}remove`]" :disabled="state.multiple" @click="handleDelete"
                        plain>
                        <template #icon>
                            <i-ep-delete />
                        </template>
                        删除
                    </el-button>

                    <el-button type="warning" v-peri="[`${basePeri}remove`]" @click="clearLog" plain>
                        <template #icon>
                            <svg-icon icon="ep:delete-filled"></svg-icon>
                        </template>
                        清除
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card class="mt-10">
            <el-table :data="state.list" v-loading="state.loading" @selection-change="handleSelectionChange" stripe
                style="width: 100%">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column label="ID" prop="id" align="center" />
                <el-table-column label="请求标题" show-overflow-tooltip prop="operateTitle" align="center" />
                <el-table-column label="所属地址" show-overflow-tooltip prop="operateAddress" align="center" />
                <el-table-column label="Method" prop="operateMethod" show-overflow-tooltip align="center" />
                <el-table-column label="请求地址" prop="requestUrl" show-overflow-tooltip align="center" />
                <el-table-column label="状态" align="center" prop="status" />
                <el-table-column label="操作类型" align="center" prop="status">
                    <template #default="scope">
                        <dictTag :type="DICT_TYPE.SYSTEM_OPERATION_TYPE" :value="scope.row.operatorType"></dictTag>
                    </template>
                </el-table-column>
                <el-table-column label="接口时长" align="center" prop="status">
                    <template #default="scope">
                        {{ scope.row.timeStamp }} ms
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" align="center">
                    <template #default="scope">
                        {{ parseTime(scope.row.operateTime) }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="200px">
                    <template #default="scope">
                        <el-button link v-peri="[`${basePeri}getOne`]" @click="openOnceLog(scope.row)" type="primary">
                            <template #icon>
                                <el-icon>
                                    <i-ep-Edit />
                                </el-icon>
                            </template>
                            查看
                        </el-button>

                        <el-button link type="danger" v-peri="[`${basePeri}:remove`]" @click="handleDelete(scope.row)">
                            <template #icon>
                                <i-ep-delete />
                            </template>
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <Paginations v-show="state.total > 0" v-model:limit="state.params.pageSize"
                v-model:pageNum="state.params.pageNumber" :total="state.total" @paginations="loadList">
            </Paginations>
        </el-card>

    </div>

    <el-dialog v-model="state.open" title="日志详情" :close-on-click-modal="false" :draggable="true" :align-center="true"
        width="50%">
        <el-descriptions class="margin-top" :column="1" border>

            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        操作用户
                    </div>
                </template>
                {{ from.operateUserName }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        请求接口
                    </div>
                </template>
                {{ from.requestUrl }}
            </el-descriptions-item>

            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        请求标题
                    </div>
                </template>
                {{ from.operateTitle }}
            </el-descriptions-item>

            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        请求类型
                    </div>
                </template>
                {{ from.requestMethod }}
            </el-descriptions-item>

            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        操作类型
                    </div>
                </template>
                <dictTag :type="DICT_TYPE.SYSTEM_OPERATION_TYPE" :value="from.operatorType"></dictTag>
            </el-descriptions-item>


            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        所属Ip
                    </div>
                </template>

                {{ from.operateIp }}
            </el-descriptions-item>

            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        所属地区
                    </div>
                </template>
                {{ from.operateAddress }}
            </el-descriptions-item>

            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        请求时间
                    </div>
                </template>
                {{ from.operateTime }}
            </el-descriptions-item>


            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        调用方法
                    </div>
                </template>
                {{ from.operateMethod }}
            </el-descriptions-item>

            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        响应时间
                    </div>
                </template>
                {{ from.timeStamp }} ms
            </el-descriptions-item>


            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        请求参数
                    </div>
                </template>
                {{ from.requestParams }}
                <!-- <json-preview :data="JSON.parse(from.requestParams)"/> -->
            </el-descriptions-item>
            <el-descriptions-item >
                <template #label>
                    <div class="cell-item">
                        响应数据
                    </div>
                </template>
                <div class="text-truncate ">
                    {{ from.responseParams }}
                </div>
                <!-- <json-preview :data="JSON.parse(from.responseParams)"/> -->
            </el-descriptions-item>


        </el-descriptions>
      
    </el-dialog>
</template>

<style lang='scss' scoped></style>