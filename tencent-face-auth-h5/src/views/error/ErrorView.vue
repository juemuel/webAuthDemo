<template>
  <div class="page">
    <van-empty image="error" :description="data.errorInfo" />
  </div>
</template>

<style lang="scss" scoped>
  .page {
    padding-top: 4rem;
  }
</style>
<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { reactive } from 'vue'

const route = useRoute()

/**
 * data数据
 */
const data = reactive({
  errorCode: '0',
  errorInfo: '系统遇到错误'
})

if (route.params.info !== undefined && route.params.info !== '' && route.params.info !== null) {
  console.log('Error:', data.errorInfo)
  data.errorInfo = route.params.info.toString()
}

if (route.params.code !== undefined && route.params.code !== '' && route.params.code !== null) {
  console.log('Error:', data.errorInfo)
  data.errorCode = route.params.code.toString()
}
</script>
