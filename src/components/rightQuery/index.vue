<template>
    <div class="top-right-btn" :style="stylePx">
      <el-row>
        <el-tooltip placement="top" v-if="prop.showQuery">
          <template #content>
            <span v-text="prop.query ? '隐藏搜索' : '显示搜索'"></span>
          </template>
          <el-button circle @click="toggleQuery">
            <template #icon>
              <i-ep-search />
            </template>
          </el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="刷新" placement="top">
          <el-button circle @click="refresh">
            <template #icon>
              <i-ep-refresh />
            </template>
          </el-button>
        </el-tooltip>
      </el-row>
    </div>
  </template>
  
  <script setup>
  import { defineProps, computed, ref, defineEmits } from "vue";
  
  const prop = defineProps({
    showQuery: {
      type: Boolean,
      default: true,
    },
    query: {
      type: Boolean,
      default: true,
    },
    gutter: {
      type: Number,
      default: 10,
    },
  });
  
  const emit = defineEmits(["toggleQuery", "refresh"]);
  
  const stylePx = computed(() => {
    const ret = {};
    if (prop.gutter) {
      ret.marginRight = `${prop.gutter / 2}px`;
    }
    return ret;
  });
  
  const toggleQuery = () => {
    emit("toggleQuery");
  };
  
  const refresh = () => {
    emit("refresh");
  };
  </script>
  
  <style scoped>
  .el-transfer__button :deep {
    border-radius: 50%;
    padding: 12px;
    display: block;
    margin-left: 0px;
  }
  
  .el-transfer__button:first-child :deep {
    margin-bottom: 10px;
  }
  </style>
  