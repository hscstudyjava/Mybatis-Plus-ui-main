import { createApp } from 'vue'
import { createPinia } from 'pinia'

import "@/routerPerssion"//使用路由
import "@/assets/icons/index.ts"
import "@/assets/style/index.scss"
import 'virtual:svg-icons-register'
import directives from './directive';
import App from './App.vue'
import router from './router'
const app = createApp(App)


// 自定义指令
app.use(directives)
app.use(createPinia())
app.use(router)

app.mount('#app')
