<template>

    <el-form :model="submitForm" class="demo-form-inline">
     <el-form-item label="用户账号">
       <el-input v-model="submitForm.userName" placeholder="Approved by" clearable />
     </el-form-item>
     
     <el-form-item label="用户密码">
       <el-input v-model="submitForm.passWord" placeholder="Approved by" clearable />
     </el-form-item>
   
    
     <el-form-item>
       <el-button type="primary" @click="onSubmit">登录</el-button>
     </el-form-item>
   </el-form>
 </template>
 
 <script setup lang="ts">
 
 import router from '@/router';
import { useUserStore } from '@/stores/user'
 // @ts-ignore
 import type { AjaxResult } from '@/utils/request/type';
 import { reactive } from 'vue'
 
 const userStore=useUserStore()
 
 const submitForm = reactive({
   userName: 'admin',
   passWord: 'hsc@1825713423',
 })
 
 const onSubmit = () => {
   userStore.login({
     userName:submitForm.userName.trim(),
     passWord:submitForm.passWord.trim()
   }).then(res=>{
        router.push("/system/user")
   })
 }
 </script>
 
 <style  scoped>
 
 </style>