<template>
  <div class="devicePage">
    <van-nav-bar v-if="!EnvUtils.isWeChat()" title="设备" />
    <div class="scrollArea" :class="{ 'withPlatFormInnerMargin': EnvUtils.isWeChat() }">
      <div class="headerArea">
        <div class="bannerArea">
          <div class="bannerImage"></div>
          <div class="bannerText"> 您好！{{ data.userInfo.userName }}</div>
        </div>
      </div>
      <div v-if="true" class="hasData">
        <div class="deviceGroupItem" v-for="groupItem in data.deviceGroupData" :key="groupItem.groupTitle">
          <div class="groupTitleArea" :class="{'groupTitleArea-type2': groupItem.groupTitle === '健康服务'}">
            <span class="groupTitle">{{ groupItem.groupTitle }}</span>
            <!-- <div class="groupShadow"></div> -->
            <div class="groupShadow"></div>
          </div>
          <div class="flexArea">
            <div class="deviceItem" :class="{ 'deviceItem-type1': deviceItem.type === '1' || deviceItem.type === '2', 'deviceItem-type2': deviceItem.type === '3' || deviceItem.type === '4' }"
              v-for="deviceItem in groupItem.deviceList" :key="deviceItem.img"
              @click="handleDeviceItemClick(deviceItem)"
            >
              <img :src="getImageSrc(deviceItem)" :alt="deviceItem.img"
              />
            </div>
          </div>
        </div>
      </div>
      <div v-if="false" class="noData" >
        <DefaultDataView description="暂无内容"></DefaultDataView>
      </div>
    </div>
    <div class="tabBarArea">
      <van-tabbar v-model="data.active" active-color="#5CC8A4" inactive-color="#000">
        <van-tabbar-item icon="desktop-o"
          @click.stop="switchTab({ name: 'device', to: '/home', text: 'tab1' })">
          tab1
        </van-tabbar-item>
        <!-- <van-tabbar-item icon="scan" @click.stop="switchTab({ name: 'scan', to: '/scan', text: '扫一扫' })">
          扫一扫
        </van-tabbar-item> -->
        <van-tabbar-item icon="comment-o" @click.stop="switchTab({ name: 'report', to: '/report', text: 'tab2' })">
          tab2
        </van-tabbar-item>
      </van-tabbar>
    </div>
  </div>
</template>
<script lang="ts" setup>

import { useRouter, useRoute } from 'vue-router'
import { onMounted, onBeforeMount, onUnmounted, reactive } from 'vue'
import EnvUtils from '@/utils/EnvUtils'
import DefaultDataView from '@/components/DefaultDataView.vue'

const router = useRouter()
const route = useRoute()

/**
 * data数据
 */
const data = reactive({
  currentPath: 'device',
  version: process.env.VUE_APP_VERSION,
  token: '',
  currentTab: 'device',
  active: 0,
  userInfo: {
    userName: '测试用户'
  },
  deviceGroupData: [
    {
      groupTitle: '健康检测',
      deviceList: [ // type1表示扫一扫，type2表示去设备详情页，type3表示去检查服务详情页，type4表示去咨询服务详情页
        {
          type: '1'
        }, {
          type: '1'
        }
      ]
    },
    {
      groupTitle: '居家监测',
      deviceList: [
        {
          type: '2'
        }, {
          type: '2'
        }
      ]
    },
    {
      groupTitle: '其他设备',
      deviceList: [
        {
          type: '3'
        }, {
          type: '3'
        }
      ]
    },
    {
      groupTitle: '健康服务',
      deviceList: [
        {
          type: '4'
        }, {
          type: '4'
        }
      ]
    }
  ],
  loadingConfig: {
    isShow: true,
    type: 'spinner',
    message: '页面加载中...',
    color: '',
    size: '48px'
  },
  errorConfig: {
    showLoginButton: false,
    isShow: false,
    image: 'error',
    message: ''
  },
  baseUrl: ''
})

/**
 * 生命周期 - onBeforeMount
 */
onBeforeMount(() => {
})

/**
 * 生命周期 - onMounted
 */
onMounted(() => {
  console.log('current: /home')
  data.baseUrl = baseUrl()
  console.log(data.baseUrl)
  // 初始化页面样式
  initStyle()

  // 初始化页面数据
  initData()
})
function baseUrl () {
  console.log('BaseUrl', process.env.VUE_APP_BASEURL)
  return process.env.VUE_APP_BASEURL
}
/**
 * 初始化页面样式
 */
function initStyle () {
}

/**
 * 生命周期 - onUnmounted
 */
onUnmounted(() => {
  // 恢复自定义body页面样式
  const bodyElement = document.querySelector('body')
  if (bodyElement !== undefined && bodyElement !== null) {
    bodyElement.setAttribute('style', '')
  }
})

/**
 * 初始化页面数据
 */
function initData () {
  const token = localStorage.getItem('token')
  if (token !== null) {
    data.token = token
  }
  const userName = localStorage.getItem('userName')
  if (userName !== null) {
    data.userInfo.userName = userName
  }
}
/**
 * 跳转到对应的tab页面
 */
function switchTab (item: { name: string; to: string; text: string; }) {
  const queryParams = {
    from: data.currentPath,
    v: data.version
  }
  if (item.to === '/home') {
    data.active = 0
  }
  console.log('激活为', data.active)
  // data.active = item
  const jumpPath = item.to
  router.push({ path: jumpPath, query: queryParams })
}
function handleDeviceItemClick (deviceItem: any) {
  console.log('Clicked device item:', deviceItem)
  // 在这里添加您的点击事件处理逻辑，例如导航到相应的页面、显示详细信息等
  if (deviceItem.type !== '1') {
    const queryParams = {
      productUrl: deviceItem.detail,
      type: deviceItem.type
    }
    router.push({ path: '/homeDetail', query: queryParams })
  } else {
    router.push('/scan')
  }
}
function getImageSrc (deviceItem: any) {
  switch (deviceItem.type) {
    case '1':
    // return `${data.baseUrl}/assets/images/default/type1-image.jpg`
      return 'https://fakeimg.pl/163x225/?text=%E6%AD%A3%E5%9C%A8%E5%8A%A0%E8%BD%BD&font=noto'
    case '2':
      return 'https://fakeimg.pl/163x225/?text=%E6%AD%A3%E5%9C%A8%E5%8A%A0%E8%BD%BD&font=noto'
    case '3':
      return 'https://fakeimg.pl/345x259/?text=%E6%AD%A3%E5%9C%A8%E5%8A%A0%E8%BD%BD&font=noto'
    case '4':
      return 'https://fakeimg.pl/345x259/?text=%E6%AD%A3%E5%9C%A8%E5%8A%A0%E8%BD%BD&font=noto'
    default:
      return 'https://fakeimg.pl/345x259/?text=%E6%AD%A3%E5%9C%A8%E5%8A%A0%E8%BD%BD&font=noto'
  }
}
/**
 * 获取首页数据
 */
function loginOut () {
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
  window.location.reload()
}

/**
 * 显示错误信息
 *
 * @param message 错误信息
 */
function showErrorInfo (message:string, showLoginButton:boolean) {
  data.loadingConfig.isShow = false
  data.errorConfig.isShow = true
  data.errorConfig.showLoginButton = showLoginButton
  data.errorConfig.message = message
}

</script>
<style lang="scss" scoped>
.devicePage{
  .van-nav-bar {
    height: 37px;
    position: sticky;
    top: 0;
    z-index: 1; /* 确保 nav-bar 在顶部 */
  }
  .scrollArea{
    margin-top: 0rem;
    height:calc(100vh - 3.125rem);
    margin-bottom:3.125rem;
    overflow-y: auto;
    .headerArea{
      width: 100%;
      text-align: center;
      .bannerArea {
        position: relative; /* 保证内部元素（如 .bannerTitle）能基于 .bannerArea 定位 */
        min-height: 170px;
        .bannerImage {
          // background-image: url('../../assets/images/home/homeBackGround.png'); // 这种写法依赖于src/assets
          background-image: url('../../../public/assets/images/home/homeBackGround.png');
          // z-index: 9;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-position: center center; /* 可选，居中显示背景图片 */
          background-repeat: no-repeat; /* 可选，禁止背景图片平铺 */
          background-size: cover; /* 关键样式，使背景图片按宽度等比例缩放，保持完全覆盖且不失真 */
        }
        .bannerText{
          position: relative; /* 或者使用 position: absolute，根据实际需求调整 */
          z-index: 99;
          text-align: left;
          padding-left: 1rem;
          padding-top: 3rem;
          font-size: 1.5rem;
          font-weight: 700;
        }
      }
    }
    .hasData{
      margin-top: -2rem;
      .deviceGroupItem {
        display: flex;
        flex-direction: column;
        margin-bottom: 14px; // 可自定义间距
        .groupTitleArea {
          // 设备组标题样式
          background-color: transparent;
          display: inline-block;
          align-items: baseline; /* 保证阴影与文本内容垂直对齐 */
          width: 5rem;
          font-size: 1.2rem;
          font-weight: bold;
          margin-bottom: 16px; // 可自定义间距
          margin-left: 1rem;
          z-index: 9;
          white-space: nowrap;
          background-image: url('../../../public/assets/images/home/greenTitleColor.png');
          background-position: left calc(100% - 2px);
          background-repeat: no-repeat;
          background-size: contain;
          .groupTitle{
            position: relative;
          }
        }
        .groupTitleArea-type2{
          margin-bottom: 2px !important; // 可自定义间距
        }
        .flexArea{
          display: flex;
          flex-wrap: wrap;
          // gap: 0.4%;
          // justify-content: center;
          .deviceItem {
            margin-left: 1rem;
            width: 163px;
            position: relative;
            margin-bottom: 1rem; // 可自定义间距
            cursor: pointer;
            img {
              display: block;
              max-width: 100%; // 保持图片不超过其容器宽度
            }
          }
          .deviceItem-type2{
            width: 345px;
            margin-left: 1rem;
            margin-bottom: 1rem;
          }
        }
      }
    }
  }
  .van-tabbar{
    z-index: 999 !important;
  }
}
.loadingInfo{
  margin-top: 4rem;
}

.withPlatFormInnerMargin{
  margin-bottom: 3.125rem + 2rem !important;
  height:calc(100vh - 3.125rem - 2rem) !important;
}
</style>
