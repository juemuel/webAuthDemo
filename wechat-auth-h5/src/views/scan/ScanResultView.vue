<template>
  <div class="ScanResultView">
    <van-empty :image="data.img" :description="data.message" image-size="80"/>
    <div class="btnArea">
      <van-row>
        <van-col span="11">
          <van-button class="btnItem" color="#557DF4" block type="primary" @click="goPage">{{ `返回首页(${countdown}s)`  }}</van-button>
        </van-col>
        <van-col offset="2" span="11">
          <van-button class="btnItem" color="#557DF4" block type="primary" @click="goScanPage">继续扫码</van-button>
        </van-col>
      </van-row>
    </div>
  </div>

</template>

<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import { defineProps, ref, onMounted, onUnmounted, toRefs, reactive } from 'vue'
const route = useRoute()
const countdown = ref(25)
const router = useRouter()
const data = reactive({
  img: '',
  messgae: ''
})
let timer: number | undefined
/**
 * 登录倒计时
 */
function startCountdown () {
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value === 0) {
      clearInterval(timer)
      goPage()
    }
  }, 1000)
}

onMounted(() => {
  const type = route.query.type
  console.log('scanResultPage:', type)
  if (type === 'success') {
    data.img = 'success'
    data.message = '扫描成功。'
  } else if (type === 'fail') {
    data.img = 'error'
    data.message = '激活失败'
  } else {
    data.img = 'error'
    data.message = '激活异常'
  }
  startCountdown()
})
onUnmounted(() => {
  clearInterval(timer)
})
/**
 * 跳转至login页面
 */
function goPage () {
  clearInterval(timer)
  router.replace({ path: '/home' })
}

function goScanPage () {
  clearInterval(timer)
  router.replace({ path: '/scan' })
}
</script>

<style scoped lang="scss">
.btnArea {
  // display: flex;
  // justify-content: center;
  width: 80%;
  padding-left: 10%;
  padding-right: 10%;
  .btnItem {
    border-radius: 4px;
    font-size: 16px; /* 调整字体大小以适应设计需求 */
    width: 100%;
    // opacity: 0.4;
  }
}
</style>
