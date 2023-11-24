/*
 * @Author: hsc 1825713423@qq.com
 * @Date: 2023-11-23 18:13:45
 * @LastEditors: hsc 1825713423@qq.com
 * @LastEditTime: 2023-11-23 19:01:39
 * @FilePath: \Mybatis-Plus-ui-main\src\main.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import "@/routerPerssion"//使用路由
import "@/assets/icons/index.ts"
import "@/assets/style/index.scss"
import 'virtual:svg-icons-register'
import diirectives from '@/directives'
// @ts-ignore
import App from './App.vue'
import router from './router'
const app = createApp(App)
app.use(diirectives);
app.use(createPinia())
app.use(router)

app.mount('#app')
