<template>
  <div v-if="data.loadingConfig.isShow && !data.errorConfig.isShow" class="loadingInfo">
    <LoadingComponent :type="data.loadingConfig.type" :size="data.loadingConfig.size" :message="data.loadingConfig.message" :color="data.loadingConfig.color"></LoadingComponent>
  </div>

  <div v-if="data.errorConfig.isShow && !data.loadingConfig.isShow" class="errorInfo">
    <ErrorComponent :image="data.errorConfig.image" :message="data.errorConfig.message" :show-login-button="data.errorConfig.showLoginButton"></ErrorComponent>
  </div>

  <div v-if="!data.errorConfig.isShow && !data.loadingConfig.isShow" class="questionPage">
    <van-nav-bar left-arrow @click-left="goPrePage" :title="data.pageTitle" />

    <div class="tabArea">
      <van-tabs v-model:active="data.active" color="#557DF4" @click-tab="onClickTab">
        <van-tab title="帮助中心">
          <div class="questionListArea">
            <van-collapse v-model="data.activeName" accordion>
              <template v-for="item in data.questionListData" :key="item.id">
                <van-collapse-item :title="item.title" :name="item.id">
                  {{ item.content }}
                </van-collapse-item>
                </template>
            </van-collapse>
          </div>
        </van-tab>
        <van-tab disabled title="我要反馈">
          <div class="feedbackArea">我要反馈</div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script lang="ts" setup>

import { useRouter, useRoute } from 'vue-router'
import { onMounted, onBeforeMount, reactive } from 'vue'
import ErrorComponent from '@/components/ErrorComponent.vue'
import LoadingComponent from '@/components/LoadingComponent.vue'
import CommonsUtils from '@/utils/CommonsUtils'
import LoginApi from '@/api/login/LoginApi'
import { Toast } from 'vant'

const router = useRouter()
const route = useRoute()

/**
 * data数据
 */
const data = reactive({
  currentPath: 'question',
  prePath: '',
  version: process.env.VUE_APP_VERSION,
  pageTitle: '常见问题',
  projectKey: '',
  active: '1',
  activeName: 0,
  questionListData: [{
    content: '',
    id: 0,
    sort: 0,
    title: ''
  }],
  loadingConfig: {
    isShow: true,
    type: 'spinner',
    message: '页面加载中...',
    color: '',
    size: '48px'
  },
  errorConfig: {
    isShow: false,
    image: 'error',
    message: '',
    showLoginButton: false
  }
})

/**
 * 生命周期 - onBeforeMount
 */
onBeforeMount(() => {
  // 无需判断是否登录
})

/**
 * 生命周期 - onMounted
 */
onMounted(() => {
  // 初始化页面样式
  initStyle()

  // 初始化页面数据
  initData()
})

/**
 * 初始化页面样式
 */
function initStyle () {
  // 自定义body样式
  const bodyElement = document.querySelector('body')
  if (bodyElement !== undefined && bodyElement !== null) {
    bodyElement.setAttribute('style', 'background-color:#fafafa;')
  }
}

/**
 * 初始化数据
 */
function initData () {
  // 获取路由中的参数
  if (route.query.key === undefined || route.query.key === null || route.query.key === '') {
    showErrorInfo('项目标识不能为空', false)
    return false
  }

  data.projectKey = route.query.key + ''

  // 调用接口获取页面数据
  getHelpListData()
}

/**
 * 获取套餐详情数据
 */
function getHelpListData () {
  const params = {
    key: data.projectKey
  }
  data.loadingConfig.isShow = true
  LoginApi.getHelpListApi(params).then((result) => {
    data.questionListData = []
    if (result.code === 0 || result.code === '0') {
      if (CommonsUtils.checkApiTokenFailure(result.message)) {
        showErrorInfo(result.message, true)
      } else showErrorInfo(result.message, false)
      return false
    }
    data.questionListData = result.data.cupHelps
    if (data.questionListData !== undefined && data.questionListData.length > 0) {
      data.activeName = data.questionListData[0].id
    }
    data.loadingConfig.isShow = false
  }).catch((error) => {
    data.questionListData = []
    console.log(error)
    showErrorInfo('网络请求错误', false)
  })
  data.loadingConfig.isShow = false
}

/**
 * 点击tab选择
 */
function onClickTab (item:any) {
}

/**
 * 返回上级菜单
 */
function goPrePage () {
  const routeInfo = CommonsUtils.getPrePageRouterInfo()
  router.push({ path: routeInfo.path, query: routeInfo.query })
}
/**
 * 显示错误信息
 *
 * @param message 错误信息
 */
function showErrorInfo (message:string, showLoginButton:boolean) {
  data.loadingConfig.isShow = false
  data.errorConfig.isShow = true
  data.errorConfig.message = message
  data.errorConfig.showLoginButton = showLoginButton
}

</script>
<style lang="scss" scoped>
::v-deep(.van-nav-bar .van-icon){
  color: #323233;
}
::v-deep(.van-nav-bar__title) {
  font-family: Helvetica;
  font-size: 1.125rem !important;
}
.questionPage{
  height: auto;
  padding-bottom: 6rem;
}

.questionListArea{
  margin-top: 1rem;
  height: 8rem;
  text-align: left;
  padding-left: 1rem;
  padding-right: 1rem;
}

.feedbackArea{
  margin-top: 1rem;
  height: 8rem;
  text-align: left;
  padding-left: 1rem;
  padding-right: 1rem;
}
</style>@/utils/VantCompUtils
