<template>
  <div class="errorNotice">
    <van-empty :image="image" :description="message" />
    <div v-if="showLoginButton" class="loginBtnArea">
      <van-button class="btnLogin" block type="primary" @click="goLoginPage">{{ showLoginButton ? `立即登录 (${countdown} 秒)` : '立即登录' }}</van-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { defineProps, ref, onMounted, onUnmounted, toRefs } from 'vue'
import { Toast } from 'vant'
const countdown = ref(5)

const router = useRouter()

const props = defineProps({
  showLoginButton: Boolean,
  image: String,
  message: String
})
let timer: number | undefined
const { showLoginButton } = toRefs(props)
/**
 * 登录倒计时
 */
function startCountdown () {
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value === 0) {
      clearInterval(timer)
      goLoginPage()
    }
  }, 1000)
}
onMounted(() => {
  if (showLoginButton.value) {
    startCountdown()
  }
})

onUnmounted(() => {
  clearInterval(timer)
})
/**
 * 跳转至login页面
 */
function goLoginPage () {
  const getParams = {
    v: process.env.VUE_APP_VERSION
  }

  const projectKey = localStorage.getItem('projectKey')
  const loginType = localStorage.getItem('loginType')
  if (projectKey === null || projectKey === '') {
    Toast.fail('项目编码缺失')
    return false
  }
  clearInterval(timer)
  if (loginType === '2') {
    // 跳转至手机号+短信登录页面
    router.push({ path: '/mobile', query: getParams })
  } else {
    // 跳转至账号密码登录页面
    router.push({ path: '/login', query: getParams })
  }
}
</script>

<style scoped lang="scss">
  .loginBtnArea{
    width: 90%;
    margin-left: 5%;
  }

  .btnLogin{
    border-radius: 4px;
  }
</style>
