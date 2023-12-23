import { createApp } from 'vue'
import { createPinia } from 'pinia'
// import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import "@/routerPerssion"//使用路由
import 'element-plus/theme-chalk/dark/css-vars.css'
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

/* for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
} */

app.mount('#app')
