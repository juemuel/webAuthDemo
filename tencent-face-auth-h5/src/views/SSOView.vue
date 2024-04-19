<template>
  <div class="sso">
    <div v-if="data.errorConfig.isShow" class="errorInfo">
      <ErrorComponent
        :image="data.errorConfig.image"
        :message="data.errorConfig.message"
        :show-login-button="data.errorConfig.showLoginButton"
      ></ErrorComponent>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter, useRoute } from 'vue-router'
import { onMounted, onBeforeMount, reactive } from 'vue'
import ErrorComponent from '@/components/ErrorComponent.vue'
import VantCompUtils from '@/utils/VantCompUtils'
import { Toast, Dialog } from 'vant'
import EnvUtils from '@/utils/EnvUtils'
import WeChatUtils from '@/utils/WeChatUtils'
import UrlUtils from '@/utils/UrlUtils'
import WxAuthApi from '@/api/wxAuth/WxAuthApi'
import LoginApi from '@/api/login/LoginApi'

const router = useRouter()
const route = useRoute()

/**
 * data数据
 */
const data = reactive({
  version: process.env.VUE_APP_VERSION,
  errorConfig: {
    showLoginButton: false,
    isShow: false,
    image: 'error',
    message: ''
  },
  dialogVisible: false
})

/**
 * 生命周期 - onBeforeMount
 */
onBeforeMount(() => {
  // todo...
})

/**
 * 生命周期 - onMounted
 */
onMounted(() => {
  // 清空缓存中的数据
  clearCacheData()
  // 初始化页面数据
  initData()
})

async function handleWeChatToLogin () {
  const code = route.query.code || null
  if (code) {
    console.log('1.2 授权成功，获取WeChat Code:', code)
    console.log('2.0 获取openId')
    const openIdSuccess = await WeChatUtils.getOpenIdByCode(code)

    if (!openIdSuccess?.success) {
      console.error('2.1 openId获取失败', openIdSuccess)
      VantCompUtils.costomShowToast('获取微信OpenId失败，请稍后再试', 'fail')
    } else {
      WeChatUtils.loginWithWeChatOpenId()
    }
  } else {
    console.log('1.1 首次进入无 Wechat Code')
    return VantCompUtils.customShowDialog(
      '您还未授权微信，是否去授权？',
      handleConfirm,
      handleCancel
    )
  }
}
/**
 * 初始化页面数据
 */
function initData () {
  // 扫码携带个人信息，并通过登录接口，如果结果是未注册那么跳注册页面，如果是已注册那么跳首页
  if (EnvUtils.isWeChat()) {
    handleWeChatToLogin()
  } else {
    // 后续可支持更多的登陆方式
    VantCompUtils.costomShowToast('请在微信客户端打开！', 'faile')
    return false
  }
}
const handleConfirm = () => {
  data.dialogVisible = false
  WeChatUtils.getWxCode()
  // const currentRoute = router.currentRoute.value
  // const newParams = { ...currentRoute.query, code: 'test' }
  // const newUrl = router.resolve({ path: currentRoute.path, query: newParams }).href
  // window.location.href = newUrl
  // window.location.reload(true)
}

const handleCancel = () => {
  data.dialogVisible = false
}
/**
 * 清空缓存中的数据
 */
function clearCacheData () {
  // 清除token
  if (localStorage.getItem('token')) {
    localStorage.removeItem('token')
  }
  if (localStorage.getItem('access_token')) {
    localStorage.removeItem('access_token')
  }
  if (localStorage.getItem('openid')) {
    localStorage.removeItem('openid')
  }
}

/**
 * 显示错误信息
 *
 * @param message 错误信息
 */
function showErrorInfo (message: string, showLoginButton: boolean) {
  data.errorConfig.isShow = true
  data.errorConfig.message = message
  data.errorConfig.showLoginButton = showLoginButton
}
</script>
