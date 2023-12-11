<template>
  <div class="login-container">

    <div class="login-context">
      <div class="login-left">
        <img :src="loginSvg" style="height: 100%;width: 100%;">
      </div>

      <div class="login-right">

        <!-- logo -->
        <img :src="logo" class="logo" />

        <el-divider size="large">
          <span class="title">
            {{ title }}
          </span>
        </el-divider>
        <el-form :model="submitForm" size="large">


          <el-form-item>
            <el-input v-model="submitForm.userName" placeholder="用户账号" :prefix-icon="UserFilled" />
          </el-form-item>

          <el-form-item>
            <el-input v-model="submitForm.passWord" placeholder="用户密码" show-password type="password"
              :prefix-icon="Lock" />
          </el-form-item>

         <!--  <el-form-item>
            <el-input v-model="submitForm.passWord" placeholder="用户密码" show-password type="password"
              :prefix-icon="Lock" />
            <img :src="logo" class="logo" />
          </el-form-item>
 -->

          <el-form-item>
            <el-button type="primary" @click="onSubmit" style="width: 100%;">
              <span v-if="!loading">登录</span>
              <span v-else>登录中...</span>
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

  </div>
</template>
 
<script setup lang="ts">
import { UserFilled, Lock } from '@element-plus/icons-vue'
import loginSvg from '@/assets/img/svg/login.png'
import logo from '@/assets/img/logo/logo.png'
import router from '@/router';
import { useSettingStore } from '@/stores/setting';
import { useUserStore } from '@/stores/user'
// @ts-ignore
import type { AjaxResult } from '@/utils/request/type';
import { defineStore, storeToRefs } from 'pinia';
import { onMounted, reactive, ref } from 'vue'
import { messages } from '@/utils/message/MessageUtils';
import { getCaptchaInfo } from '@/api/login/login';
const { title } = storeToRefs(useSettingStore())

const userStore = useUserStore()
const loading = ref(false)

const submitForm = reactive({
  userName: '',
  passWord: '',
})

const onSubmit = () => {
  loading.value = true;
  userStore.login({
    userName: submitForm.userName.trim(),
    passWord: submitForm.passWord.trim()
  }).then(res => {
    loading.value = false;
    router.push("/")
  }).catch(error=>{
    messages.error(error.msg)
    userStore.$clearCache();// 清空缓存中token
    userStore.$resetOauth2();//包括pinia中Oauth2对象
    loading.value = false;
    
  })
}
onMounted(()=>{
  initCaptcha();
})

const initCaptcha=()=>{
  getCaptchaInfo().then(res=>{

  })
}


</script>
 
<style lang="scss" scoped>
$login-container-color: #fdfdfd;

.login-container {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: $login-container-color;

  // 内容
  .login-context {
    width: calc(100% - 200px);
    height: calc(100% - 100px);
    position: absolute;
    margin: auto;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    box-shadow: 0.1px 0.1px 5px #000000;
    border-radius: 10px;

    .login-left {
      width: 50%;
      height: 100%;
      float: left;
    }

    .login-right {
      float: left;
      width: 50%;
      height: 100%;
      padding: 50px;

      .logo {
        width: 50px;
        height: 50px;
        // margin: auto;
      }

      .title {}

    }
  }

}
</style>