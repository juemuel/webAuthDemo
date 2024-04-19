<template>
  <div class="pdfView">
    <van-nav-bar left-arrow @click-left="goPrePage"  v-if="!EnvUtils.isWeChat()" title="报告" />
    <div id="demo"></div>
  </div>
</template>
<script setup>
import { ref, onMounted, defineProps } from 'vue'
import Pdfh5 from 'pdfh5'
import { useRoute, useRouter } from 'vue-router'
import EnvUtils from '@/utils/EnvUtils'
const route = useRoute()
const router = useRouter()
// 定义props
// const props = defineProps({
//   pdfUrl: {
//     type: String,
//     required: true
//   }
// })
onMounted(() => {
  const pdfUrl = route.query.pdfUrl
  console.log('pdfUrl', pdfUrl)
  const pdfPreview = new Pdfh5('#demo', {
    pdfurl: pdfUrl
  })
})

function goPrePage () {
  router.go(-1)
}
</script>
<style scoped>
@import '../../node_modules/pdfh5/css/pdfh5.css';
.pdfView {
  /* width: 100vw;
  height: 100vh; */
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
}
</style>
