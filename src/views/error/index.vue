<template>
    <div class="wscn-http404-container">
        <div class="wscn-http404">
            <div class="pic-404">
                <img class="pic-404__parent" src="@/assets/img/error/network/network_error.png" alt="404">
                <img class="pic-404__child left" src="@/assets/img/error/network/lost_air.png" alt="404">
                <img class="pic-404__child mid" src="@/assets/img/error/network/lost_air.png" alt="404">
                <img class="pic-404__child right" src="@/assets/img/error/network/lost_air.png" alt="404">
            </div>
            <div class="bullshit">
                <div class="bullshit__oops">Network!</div>
                <div class="bullshit__info">All rights reserved
                    <a style="color:#20a0ff" href="https://system.scweb.com" target="_blank">芒星管理后台</a>
                </div>
                <div class="bullshit__headline">{{ message }}</div>
                <div class="bullshit__info">
                    请点击下面按钮测试重试
                    <span v-if="retryCount !== 0">
                        当前重试次数为:{{ retryCount }}
                    </span>
                </div>
                <el-collapse>
                    <el-collapse-item title="网络建议" name="1">
                        <p>
                            1.网络连接问题：如果你的网络连接不稳定，或者网络带宽不足，可能会导致 TCP 连接被重置。
                        </p>
                        <p>
                            2.服务器问题：如果服务器遇到问题，如过载或崩溃，也可能会断开 TCP 连接。
                        </p>
                        <p>
                            3.网络设备问题：例如，路由器、交换机或防火墙可能会由于各种原因中断 TCP 连接。

                        </p>
                        <p>
                            4.浏览器问题：浏览器或浏览器插件的错误也可能导致此问题
                        </p>
                        <p>
                            5.代理服务器或 VPN：如果你正在使用代理服务器或 VPN，而它们的设置或状态有问题，也可能导致这个错误。
                        </p>
                    </el-collapse-item>

                </el-collapse>
                <br />
                <button @click="retryPullInfo" class="bullshit__return-home">尝试拉取</button>

            </div>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import router from '@/router';
import { useDictStore } from '@/stores/dict';
import { usePeriStroe } from '@/stores/permission';
import { useUserStore } from '@/stores/user';
import { confirms } from '@/utils/message/MessageUtils';
import { computed, onMounted, ref } from 'vue';
import type { RouteRecordRaw } from 'vue-router';
import { useRoute } from 'vue-router';


const route = useRoute()
const message = ref(route.params.message || '未知异常')
const retryCount = ref(0)//默认次数
const maxRetryCount = ref(3)

const userDict = useDictStore()
const usePri = usePeriStroe()
const userStore = useUserStore()
/** 
 * 尝试重试
 */
const canRetry = computed(() => {
    return retryCount.value < maxRetryCount.value;
})

/** 
 * 尝试拉取
 */
const retryPullInfo = async () => {

    // 重新尝试获取数据
    try {
        await userDict.loadingDictMap()
        await userStore.getCurrentUser();// 拉取用户数据
        await usePri.loadingRouter();// 拉取后端数据

        usePri.routes.forEach(menu => {
            router.addRoute(menu as unknown as RouteRecordRaw)
        })
        /** 
         * 如果说没有redirect则跳转到/首页
         */
        // 重试成功后将 retryCount 重置为 0
        retryCount.value = 0;
        // @ts-ignore
        router.push({
            path: route.query.redirect || "/"
        })
        return;
    } catch (error) {
        console.error(error)

        if (!canRetry.value) {
            // 提示用户,可以退出登录
            await resetLogin()
        }
        // 当大于重试次数后清token数据
        retryCount.value++;

        // 在异常页面上更新 message 属性
        // message.value = error as string;
    }
}

const resetLogin = async () => {
    await confirms.confirm(`很抱歉,因为尝试次数已经超过${maxRetryCount.value}次依旧无法获得数据`, "系统提示", "error", "重置登录", "取消")
    // 清空登录数据
    userStore.$clearCache()
    router.push({ path: "/login" })
}

onMounted(async () => {
    await retryPullInfo()

})
</script>

<!-- 粘贴的是花裤衩大神的样式 本人不太会样式,希望有机会好好学学样式!!! -->
<style lang="scss" scoped>
.wscn-http404-container {
    transform: translate(-50%, -50%);
    position: absolute;
    top: 40%;
    left: 50%;
}

.wscn-http404 {
    position: relative;
    width: 1200px;
    padding: 0 50px;
    overflow: hidden;

    .pic-404 {
        position: relative;
        float: left;
        width: 600px;
        overflow: hidden;

        &__parent {
            width: 100%;
        }

        &__child {
            position: absolute;

            &.left {
                width: 80px;
                top: 17px;
                left: 220px;
                opacity: 0;
                animation-name: cloudLeft;
                animation-duration: 2s;
                animation-timing-function: linear;
                animation-fill-mode: forwards;
                animation-delay: 1s;
            }

            &.mid {
                width: 46px;
                top: 10px;
                left: 420px;
                opacity: 0;
                animation-name: cloudMid;
                animation-duration: 2s;
                animation-timing-function: linear;
                animation-fill-mode: forwards;
                animation-delay: 1.2s;
            }

            &.right {
                width: 62px;
                top: 100px;
                left: 500px;
                opacity: 0;
                animation-name: cloudRight;
                animation-duration: 2s;
                animation-timing-function: linear;
                animation-fill-mode: forwards;
                animation-delay: 1s;
            }

            @keyframes cloudLeft {
                0% {
                    top: 17px;
                    left: 220px;
                    opacity: 0;
                }

                20% {
                    top: 33px;
                    left: 188px;
                    opacity: 1;
                }

                80% {
                    top: 81px;
                    left: 92px;
                    opacity: 1;
                }

                100% {
                    top: 97px;
                    left: 60px;
                    opacity: 0;
                }
            }

            @keyframes cloudMid {
                0% {
                    top: 10px;
                    left: 420px;
                    opacity: 0;
                }

                20% {
                    top: 40px;
                    left: 360px;
                    opacity: 1;
                }

                70% {
                    top: 130px;
                    left: 180px;
                    opacity: 1;
                }

                100% {
                    top: 160px;
                    left: 120px;
                    opacity: 0;
                }
            }

            @keyframes cloudRight {
                0% {
                    top: 100px;
                    left: 500px;
                    opacity: 0;
                }

                20% {
                    top: 120px;
                    left: 460px;
                    opacity: 1;
                }

                80% {
                    top: 180px;
                    left: 340px;
                    opacity: 1;
                }

                100% {
                    top: 200px;
                    left: 300px;
                    opacity: 0;
                }
            }
        }
    }

    .bullshit {
        position: relative;
        float: left;
        width: 300px;
        padding: 30px 0;
        overflow: hidden;

        &__oops {
            font-size: 32px;
            font-weight: bold;
            line-height: 40px;
            color: #1482f0;
            opacity: 0;
            margin-bottom: 20px;
            animation-name: slideUp;
            animation-duration: 0.5s;
            animation-fill-mode: forwards;
        }

        &__headline {
            font-size: 20px;
            line-height: 24px;
            color: #222;
            font-weight: bold;
            opacity: 0;
            margin-bottom: 10px;
            animation-name: slideUp;
            animation-duration: 0.5s;
            animation-delay: 0.1s;
            animation-fill-mode: forwards;
        }

        &__info {
            font-size: 13px;
            line-height: 21px;
            color: grey;
            opacity: 0;
            margin-bottom: 30px;
            animation-name: slideUp;
            animation-duration: 0.5s;
            animation-delay: 0.2s;
            animation-fill-mode: forwards;
        }

        &__return-home {
            display: block;
            float: left;
            width: 110px;
            height: 36px;
            background: #1482f0;
            border-radius: 100px;
            text-align: center;
            color: #ffffff;
            opacity: 0;
            font-size: 14px;
            line-height: 36px;
            cursor: pointer;
            animation-name: slideUp;
            animation-duration: 0.5s;
            animation-delay: 0.3s;
            animation-fill-mode: forwards;
        }

        @keyframes slideUp {
            0% {
                transform: translateY(60px);
                opacity: 0;
            }

            100% {
                transform: translateY(0);
                opacity: 1;
            }
        }
    }
}
</style>
  