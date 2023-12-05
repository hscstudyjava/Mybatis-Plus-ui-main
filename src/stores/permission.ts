import { getRouter } from "@/api/login/login";
import type { Menu } from "@/types/menu";
import type { AjaxResult } from "@/utils/request/type";
import { defineStore } from "pinia";
import { reactive } from "vue";
// 父组件
import Layout from '@/layout/index.vue'






export const useAppStore = defineStore('permisionStore', () => {
    /**
     * 路由数据
     */
    var addRouter=reactive<Array<Menu>>([])

    
    const setAddRouter=(targetList:Array<Menu>)=>{
      Object.assign(addRouter,targetList)
    }

    // const loadView()

    async function getUserRouter():Promise<Array<Menu>> {
      let data=(await getRouter()).data
      setAddRouter(data)
      return data
    }

})