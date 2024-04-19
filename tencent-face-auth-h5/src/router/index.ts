import { createRouter, createWebHashHistory, RouteRecordRaw, useRoute, useRouter } from 'vue-router'
import RegisterView from '@/views/RegisterView.vue'
// import LoginView from '@/views/LoginView.vue'

import Page404View from '@/views/error/Page404View.vue'
import ErrorView from '@/views/error/ErrorView.vue'

import DeviceView from '@/views/home/HomeView.vue'
import ScanView from '@/views/scan/ScanView.vue'

import SSOView from '@/views/SSOView.vue'
import QuestionView from '@/views/QuestionView.vue'
import PdfH5Component from '@/components/PdfH5Component.vue'
import CommonsUtils from '@/utils/CommonsUtils'
import WeChatUtils from '@/utils/WeChatUtils'
import ScanResultView from '@/views/scan/ScanResultView.vue'

import * as dd from 'dingtalk-jsapi'
const route = useRoute() // 此方式为整体加载，也可按需进行加载
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    alias: '/home',
    name: 'device',
    meta: {
      title: '设备'
    },
    component: DeviceView
  },
  {
    path: '/sso',
    name: 'sso',
    meta: {
      title: 'SSO登录'
    },
    component: SSOView
  },
  {
    path: '/register',
    name: 'register',
    meta: {
      title: '注册'
    },
    component: RegisterView
  },
  {
    path: '/pdf',
    name: 'pdf',
    meta: {
      title: '预览'
    },
    component: PdfH5Component
  },
  {
    path: '/scan',
    name: 'scan',
    meta: {
      title: '扫码'
    },
    component: ScanView
  },
  {
    path: '/scanResult',
    name: 'scanResult',
    meta: {
      title: '扫码结果'
    },
    component: ScanResultView
  },
  {
    path: '/question',
    name: 'question',
    meta: {
      title: '常见问题'
    },
    component: QuestionView
  },
  {
    path: '/error',
    name: 'error',
    meta: {
      title: '错误提示'
    },
    component: ErrorView
  },
  {
    path: '/page404',
    name: 'page404',
    meta: {
      title: '404'
    },
    component: Page404View
  },
  {
    path: '/:pathMatch(.*)',
    redirect: '/page404'
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const route = useRoute()
  document.title = to.meta.title as string
  // 按理说注册页也应该判断checkWxAuth的，这样拿不到openId了，只能从别的页面跳到register
  // const noLoginPage = ['pdf', 'register', 'sso', 'page404', 'error'] // 如果有临时要测试的页面，可以加入到这里，就不会走下面的if
  const noLoginPage = ['pdf', 'deviceDetail', 'scanResult', 'scan', 'register', 'device', 'report', 'sso', 'page404', 'error'] // 如果有临时要测试的页面，可以加入到这
  console.log(to.name, to.fullPath)
  if (to && typeof to.name === 'string' && noLoginPage.indexOf(to.name) === -1) {
    if (WeChatUtils.checkWxAuth()) {
      console.log('微信授权成功')
      if (CommonsUtils.checkUserLogin()) {
        console.log('用户登录成功')
        next()
      } else {
        console.log('需要登录 获取token')
        WeChatUtils.loginWithWeChatOpenId()
        // 此處也可能是需要注冊，如果在別的地方跳到注冊頁就又要重走路由守衛
        // 方案1：register需要驗證時，要在此處就直接跳轉到register
        // （目前的方案）方案2：register不需要驗證時，那麽就拿不到openId，可以考慮在进入register页面后，校验处openId不存在時，再跳到sso
      }
    } else {
      console.log('需要授权')
      next('/sso')
    }
  } else {
    console.log('直接跳转')
    next() // 成功跳转
  }
})

export default router
