<template>
    <div class="navbar">
        <hamburger id="hamburger-container" :is-active="sidebar.open" class="hamburger-container"
            @toggleClick="toggleSideBar" />

        <breadcrumb id="breadcrumb-container" class="breadcrumb-container" v-if="!topNav" />
        <top-nav id="topmenu-container" class="topmenu-container" v-if="topNav" />

        <div class="right-menu">
            <template v-if="device !== 'mobile'">

            </template>

            <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
                <div class="avatar-wrapper">
                    <!-- @vue-ignore -->
                    <img :src="avatar" class="user-avatar">
                    <i class="el-icon-caret-bottom" />
                </div>
                <!-- @vue-ignore -->
                <el-dropdown-menu v-shot="dropdown">

                    <router-link to="/user/profile">
                        <el-dropdown-item>个人中心</el-dropdown-item>
                    </router-link>

                    <el-dropdown-item divided @click="logout">
                        <span>退出登录</span>
                    </el-dropdown-item>

                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>
  
<script setup lang="ts">
// @ts-ignore
import { useSettingStore } from '@/stores/setting'
import { useAppStore } from '@/stores/app';
import { useUserStore } from '@/stores/user';
const appStore = useAppStore();
const setting = useSettingStore()
const userSotre = useUserStore()

const avatar = userSotre.currentUser.userImg;
const sidebar = appStore.sibebar
const device = appStore.device
const topNav = setting.topNav


const logout = () => {

}

const toggleSideBar = () => {
    appStore.TOGGLE_SIBEBAR
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
  