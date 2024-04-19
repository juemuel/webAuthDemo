<template>
  <div class="loadingComponent">
    <van-loading :size="size" :color="color" type="spinner" vertical>{{ message }}</van-loading>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'

// 语法糖必须使用defineProps替代props
defineProps({
  message: String,
  size: String,
  color: String
})
</script>
<style lang="scss" scoped>
</style>
