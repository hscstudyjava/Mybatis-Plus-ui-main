<script lang='ts' setup>
import { onMounted, reactive, ref, shallowRef, unref } from 'vue';
import { parseTime } from '@/utils/common'
import { DICT_TYPE, getDictOptions } from '@/utils/common/dict'
import { confirms, messages, notify } from '@/utils/message/MessageUtils';
import type { SysCity } from '@/api/system/type';
import { queryCityTree, basePeri, querySimpleProvince, queryResultProvince, queryResultCity, queryResultCounty } from '@/api/system/city';
import { CityLevelType } from '@/utils/constants/SystemConstants';
//------------------------基础模板-------------------------------------------------
const loading = ref(false)
const list = ref<SysCity[]>()
const query = ref({
   name: '',
   shortName: '',
   levelType: '',
   pinyin: ''
})
const queryRef = shallowRef()

const loadList = async () => {
   loading.value = true;
   try {
      const { data } = await queryResultProvince()
      list.value = data
   } finally {
      loading.value = false
   }
}

const resetQuery = async () => {
   query.value = {
      name: '',
      shortName: '',
      levelType: '',
      pinyin: ''
   }
   queryRef.value.resetFields();
   await loadList();
}

/** 
 * 加载Tree
 */
const loadTree = async (
   row: SysCity,
   treeNode: unknown,
   resolve: (date: SysCity[]) => void) => {
   switch (row.levelType) {

      case CityLevelType.PROVINCE: {
         const { data } = await queryResultCity(row.id)
         resolve(data)
         break;
      }

      case CityLevelType.CITY: {
         const { data } = await queryResultCounty(row.id)
         resolve(data)
         break;
      }

   }

}

onMounted(async () => {
   await loadList();
})


</script>
<template>
   <div class='app-context'>

      <el-card>
         <el-table ref="treeTableRef" stripe border :data="list" style="width: 100%" row-key="id" lazy :load="loadTree"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
            <el-table-column prop="id" show-overflow-tooltip align="center" label="ID" />
            <el-table-column prop="name" show-overflow-tooltip align="center" label="名称" />
            <el-table-column prop="shortName" show-overflow-tooltip align="center" label="简称" />
            <el-table-column prop="pinyin" show-overflow-tooltip align="center" label="拼音" />
            <el-table-column prop="lng" show-overflow-tooltip align="center" label="经度" />
            <el-table-column prop="lat" show-overflow-tooltip align="center" label="维度" />
            <el-table-column prop="zipCode" show-overflow-tooltip align="center" label="邮编" />
            <el-table-column prop="cityCode" show-overflow-tooltip align="center" label="编码" />
         </el-table>
      </el-card>

   </div>
</template>

<style lang='scss' scoped></style>