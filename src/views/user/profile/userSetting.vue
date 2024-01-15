<script setup name="UserSetting" lang="ts">
import { ref } from 'vue';


const userFrom = ref({
    name:'',
    region:'',
    type:''
})

const dialogVisibleCorpper = ref(false)
// 组件点击事件
const btnClick = () => {
  dialogVisibleCorpper.value = true
}
// 组件提交事件
const confirm = () => {
  dialogVisibleCorpper.value = false
}



</script>

<template>
    <div class="app-context">
        <el-row :gutter="20">
            <el-divider>
                基础设置
            </el-divider>
            <!-- 用户表单 -->
            <el-col :span="12" :xs=24>
                <el-form label-width="100px" :model="userFrom">
                    <el-form-item label="用户昵称">
                        <el-input v-model="userFrom.name" />
                    </el-form-item>
                    <el-form-item label="联系邮箱">
                        <el-input v-model="userFrom.region" />
                    </el-form-item>
                    <el-form-item label="手机号码">
                        <el-input v-model="userFrom.type" />
                    </el-form-item>
                </el-form>
            </el-col>
            <!-- 头像 -->
            <el-col :span="12" :xs=24>
                <el-button @click="btnClick">点击</el-button>
                <CropperAvatar v-model:dialogVisibleCorpper="dialogVisibleCorpper" @confirm="confirm" />
            </el-col>
        </el-row>
    </div>
</template>