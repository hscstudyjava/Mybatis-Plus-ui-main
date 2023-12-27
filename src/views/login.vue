<template class="">
  <!-- 登录容器 -->
  <div class=" login-container clearfix">

    <div class="login-left"></div>


    <div class="login-right flex-items-center">
      <!-- 标题 -->
      <img :src="logo" class="w-48px w-48px">

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

            <el-checkbox label="记住密码" />

            <el-link type="primary" class="ml-auto">忘记密码?</el-link>

          </el-form-item>

          <el-form-item>
            <el-button class="w-full" type="primary" @click="login">
              登录
            </el-button>
          </el-form-item>


          <el-divider border-style="dotted">
            第三方登录
          </el-divider>

        </el-form>

        <!-- 扩展第三方 -->

        <!-- 按钮组 -->
      </div>
    </div>


  </div>
</template>
 
<script setup lang="ts">
import logo from '@/assets/img/logo/logo.png'
import router from '@/router';
import { useSettingStore } from '@/stores/setting';
import { useUserStore } from '@/stores/user'
// @ts-ignore
import { storeToRefs } from 'pinia';
import { nextTick, onMounted, reactive, ref } from 'vue'
import { loading, messages } from '@/utils/message/MessageUtils';
import { getCaptchaInfo } from '@/api/login/login';
import type { Captcha } from '@/api/system/type';
const { title } = storeToRefs(useSettingStore())
const userStore = useUserStore()

const loadings = ref(false)
const captcha = ref<Captcha>()
const submitForm = reactive({
  userName: '',
  passWord: '',
  code: '',
  uuid: '',
})

// 校验对象
const ruleFrom = ref()
// 校验规则
const rules = reactive({

  userName: [
    {
      message: '用户名称不能为空', trigger: 'blur', required: true
    }
  ],

  passWord: [
    {
      message: '密码不能为空', trigger: 'blur', required: true
    }
  ],

  // code单独判断,因为后续可能使用邮箱或者手机号
  code: [
    {
      message: '验证码不能为空', trigger: 'blur', required: true
    }
  ]


})

const login = async () => {
  if (!ruleFrom) return
  const valid = await ruleFrom.value.validate()
  if (!valid) return
  loading.open()
  try {
    await userStore.login({
      userName: submitForm.userName.trim(),
      passWord: submitForm.passWord.trim()
    })
    router.push("/")

  } catch (error) {
    userStore.$clearCache();// 清空缓存中token
    userStore.$resetOauth2();//包括pinia中Oauth2对象
    await getCaptcha()
  } finally {
    loading.close();
  }
}

const getCaptcha = async () => {
  if (!ruleFrom){
    console.log(ruleFrom);

  }

  try {
    const { data } = await getCaptchaInfo()
    // 获得submitFrom表单属性
    
    captcha.value=data;
    submitForm.uuid=data.uuid
    // 我自己不想一直写code
    if(data.activeProfile==='pro'){
        submitForm.code=data.result
    }
  }finally{
    // 处理一下异常

  }
  
}

onMounted(async() => {
  
  await getCaptcha();
})



</script>
 

<!-- 
  https://juejin.cn/post/7004622232378966046#heading-14
  https://juejin.cn/post/7004622232378966046

彻底理解CSS Flexbox布局，看这一篇就够了

main axis: Flex 父元素的主轴是指子元素布局的主要方向轴，它由属性flex-direction来确定主轴是水平还是垂直的，默认为水平轴。
main-start & main-end: 分别表示主轴的开始和结束，子元素在父元素中会沿着主轴从main-start到main-end排布。
main size: 单个项目占据主轴的长度大小。
cross axis: 交叉轴，与主轴垂直。
cross-start & cross-end: 分别表示交叉轴的开始和结束。子元素在交叉轴的排布从cross-start开始到cross-end。
cross size: 子元素在交叉轴方向上的大小。


    1. flex 块状元素,inlinie-flex行内元素
    2. flex-direction: row | row-reverse | column | column-reverse; row从左向右 row-reverse 从右向左 column 从上向下 column-reverse取反
}
-->
<style lang="scss" scoped>
// $login-container-color: #fdfdfd;
.clearfix:after {
  visibility: hidden;
  display: block;
  font-size: 0;
  content: " ";
  clear: both;
  height: 0;
}

.login-container {
  width: 100%;
  height: calc(100vh);
  // position: relative;
  display: flex;
  flex-direction: row; // 从左向右
  // background-color: $login-container-color;

  .login-left {
    background: url('@/assets/img/svg/login.png');
    flex-basis: 50%;
  }

  .login-right {
    order: 1;
    display: flex;
    flex-basis: 50%;
    flex-direction: column; //上下布局
    transition: transform 0.3s ease;
  }


}

.container {
  display: flex;
  animation: slideLeft 0.3s ease;
}

// 当元素680px自动隐藏化
@media (max-width: 680px) {

  .login-container .login-left {
    display: none;
  }

  .login-container .login-right {
    flex-basis: 100%;
  }
}
</style>