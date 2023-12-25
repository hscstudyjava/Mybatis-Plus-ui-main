import { createApp } from 'vue'
import { createPinia } from 'pinia'
// main.ts
// import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import "@/routerPerssion"//使用路由
import "@/assets/icons/index.ts"
import "@/assets/style/index.scss"


import 'element-plus/theme-chalk/dark/css-vars.css'
import 'animate.css/animate.min.css' //引入
import 'virtual:svg-icons-register'
import 'virtual:uno.css'

import diirectives from '@/directives'
// @ts-ignore
import App from './App.vue'
import router from './router'
const app = createApp(App)
app.use(diirectives);
app.use(createPinia())
app.use(router)
// app.use(animated)

/* for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
} */

app.mount('#app')
