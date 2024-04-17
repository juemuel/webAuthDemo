<template>
  <div class="custom-empty-page">
    <van-empty :image-size="100" :description="customDescription" />
  </div>
</template>

<script setup>
import { computed, defineProps } from 'vue'

// 定义接收的 props
const props = defineProps({
  description: {
    type: String,
    required: true
  }
})

// 计算属性，直接返回外部传入的描述文字
const customDescription = computed(() => props.description)
</script>

<style scoped>
.custom-empty-page {
  flex: 1; /* 使该元素填充剩余空间 */
  padding-top: 4rem;
}
</style>
