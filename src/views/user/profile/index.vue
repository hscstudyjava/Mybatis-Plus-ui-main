<script setup name="UserProfile" lang="ts">
import UserSetting from './userSetting.vue';


</script>

<template>
    <div class="app-context">
        <el-tabs tab-position="left" type="border-card" class="h-500px">
            <el-tab-pane label="基本设置">
                <UserSetting/>
            </el-tab-pane>
            <el-tab-pane label="安全设置">Config</el-tab-pane>
            <el-tab-pane label="账号绑定">Role</el-tab-pane>
        </el-tabs>
    </div>
</template>