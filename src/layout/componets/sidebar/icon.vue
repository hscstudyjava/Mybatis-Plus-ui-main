<template>
    <i class="el-icon">
        <svg-icon v-if="props.icon" :iconClass="props.icon" />
    </i>
    <span v-if="props.title !== null" class="el-sub-menu__title"> {{ props.title }}</span>
    <span v-if="props.title.length > 5" class="el-sub-menu__title">{{ props.title }}</span>
</template>

<script setup lang="ts">
interface MenuItemProps {
    icon: string;
    title: string;
}

const props = defineProps<MenuItemProps>();
</script>