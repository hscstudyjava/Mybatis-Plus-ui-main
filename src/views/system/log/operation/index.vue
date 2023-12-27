<script lang='ts' setup>
import { onMounted, reactive, ref } from 'vue';
import { parseTime } from '@/utils/common'
import { DICT_TYPE, getDictOptions } from '@/utils/common/dict'
import { confirms, messages, notify } from '@/utils/message/MessageUtils';
import { pageOperation, basePeri } from '@/api/system/log/operation';
import type {  SysOperatorLog } from '@/api/system/type';
//------------------------基础模板-------------------------------------------------
const state = reactive({

    loading: false,

    single: true,

    multiple: true,

    total: 0,

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
        state.list = data.records;
        state.total = data.totalRow;
        state.loading = false;
    } catch (error: any) {
        if (error.msg) {
            messages.error(error.msg)
        }
    }

}
const handleSelectionChange =(rows?: SysOperatorLog[]) => {
    // @ts-ignore
    state.ids = rows?.map(item => item.id)
    state.single = state.ids.length != 1
    state.multiple = !state.ids.length
}

const handleDelete = async (row:SysOperatorLog) => {
    try {
        
        
        if(row){

        }

    } catch (error: any) {
        if (error.msg) {
            messages.error(error.msg)
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
                
                <el-table-column label="接口时长" align="center" prop="status">
                    <template #default="scope">
                        {{scope.row.timeSteamp}}ms
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" align="center">
                    <template #default="scope">
                        {{ parseTime(scope.row.operateTime) }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="200px">
                    <template #default="scope">
                        <el-button link v-peri="[`${basePeri}update`]" type="primary">
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

            <Paginations v-show="state.total > 0" v-model:limit="state.params.pageSize"
                v-model:pageNum="state.params.pageNumber" :total="state.total" @paginations="loadList">
            </Paginations>
        </el-card>

    </div>
</template>

<style lang='scss' scoped></style>