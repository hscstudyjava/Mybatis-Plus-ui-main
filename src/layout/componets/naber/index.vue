<template>
    <div class="navbar">
        <Hamburger id="hamburger-container" :is-active="sibebar.open" class="hamburger-container"
            @toggleClick="toggleSideBar" />

        <breadcrumb id="breadcrumb-container" class="breadcrumb-container" v-if="!topNav" />
        <!-- <top-nav id="topmenu-container" class="topmenu-container" v-if="topNav" /> -->

        <div class="right-menu">

            <template v-if="device !== moddileDevice">
                <!-- message -->
                <div class="message-container right-menu-item hover-effect">
                    <el-tooltip class="box-item" effect="dark" content="我的消息" placement="bottom">
                        <!-- 后期优化一下 打开是翻开状态 -->
                        <el-icon class="messsage-wrapper" >
                            <Message />
                        </el-icon>
                    </el-tooltip>
                </div>
                <!-- screenFull|| 全屏设置 -->
                <div class="right-menu-item hover-effect ">
                    <FullScreen/>
                </div>

                <!--  -->

            </template>

            <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
                <div class="avatar-wrapper">
                    <!-- @vue-ignore -->
                    <img :src="avatar" class="user-avatar">
                    <el-icon class="el-icon-caret-bottom ">
                        <ArrowDown />
                    </el-icon>
                    <!-- <el-icon><i-ep-ArrowDown /></el-icon> -->
                </div>
                <!-- @vue-ignore v-shot="dropdown" -->
                <template #dropdown>
                    <el-dropdown-menu>

                        <router-link to="/user/profile">
                            <el-dropdown-item>个人中心</el-dropdown-item>
                        </router-link>

                        <el-dropdown-item divided @click="logout" :icon="Pointer">
                            <span>退出登录</span>
                        </el-dropdown-item>

                    </el-dropdown-menu>

                </template>
            </el-dropdown>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { ArrowDown, Pointer, Message } from '@element-plus/icons-vue'
// @ts-ignore
import FullScreen from './FullScreen.vue';
import Hamburger from './Hamburger.vue';
import Breadcrumb from './breadcrumb.vue';

import { DeviceEnum } from '@/utils/constants/SystemConstants';
import { messages } from '@/utils/message/MessageUtils';

import router from '@/router';
import { computed } from 'vue';

import { storeToRefs } from 'pinia';
import { useSettingStore } from '@/stores/setting'
import { useAppStore } from '@/stores/app';
import { useUserStore } from '@/stores/user';
const appStore = useAppStore();
const setting = useSettingStore()
const userSotre = useUserStore()

const { currentUser } = storeToRefs(userSotre)
const { device } = storeToRefs(appStore)
const { sibebar } = storeToRefs(appStore)
const avatar = currentUser.value.userImg
const topNav = computed(() => { return setting.topNav })
const moddileDevice = DeviceEnum.MOBILE;//手机模式



const logout = () => {
    userSotre.userLogout()
        .then(res => {
            messages.success(res.msg)
            router.push("/")
        }).catch(error => {
            // 捕捉异常
            userSotre.$resetOauth2();// 重置Oauth2
            messages.success("退出成功")
            router.push("/")
            new Error(error)
        })
}

const toggleSideBar = () => {
    appStore.TOGGLE_SIBEBAR();
}
</script>
  
<style lang="scss" scoped>
.navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

    .hamburger-container {
        line-height: 46px;
        height: 100%;
        float: left;
        cursor: pointer;
        transition: background .3s;
        -webkit-tap-highlight-color: transparent;

        &:hover {
            background: rgba(0, 0, 0, .025)
        }
    }

    .breadcrumb-container {
        float: left;
    }

    .topmenu-container {
        position: absolute;
        left: 50px;
    }

    .errLog-container {
        display: inline-block;
        vertical-align: top;
    }

    .right-menu {
        float: right;
        height: 100%;
        line-height: 50px;

        &:focus {
            outline: none;
        }



        .right-menu-item {
            display: inline-block;
            padding: 0 8px;
            height: 100%;
            font-size: 18px;
            color: #5a5e66;
            vertical-align: text-bottom;

            &.hover-effect {
                cursor: pointer;
                transition: background .3s;

                &:hover {
                    background: rgba(0, 0, 0, .025)
                }
            }
        }

        // 消息
        .message-container {
            line-height: 46px;
            height: 100%;
            cursor: pointer;
            transition: background .3s;
            -webkit-tap-highlight-color: transparent;

            .messsage-wrapper {
                display: inline-block;
                // vertical-align: middle;
                width: 1em;
                height: 1em;
                vertical-align: middle;
            }
        }

        .avatar-container {
            margin-right: 30px;

            .avatar-wrapper {
                margin-top: 5px;
                position: relative;

                .user-avatar {
                    cursor: pointer;
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                }

                .el-icon-caret-bottom {
                    cursor: pointer;
                    position: absolute;
                    right: -20px;
                    top: 25px;
                    font-size: 12px;
                }
            }
        }
    }
}
</style>
  