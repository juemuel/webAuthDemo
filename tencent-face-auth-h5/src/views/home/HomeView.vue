<template>
  <div id="app">
    <video ref="cameraFeed" autoplay></video>
    <button @click="startVerification">开始人脸识别</button>
    <div id="result-container">{{ verificationResult }}</div>
  </div>
</template>

<script>
import FaceVerification from '@/components/FaceVerification.vue'

export default {
  components: {
    FaceVerification
  }
}
</script>

<style>
  /* 全局样式 */
</style>
