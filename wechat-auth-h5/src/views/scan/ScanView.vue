<template>
  <div class="pageScan">
    <video ref="video" id="video" class="scanVideo" autoplay></video>
    <!-- 这是样式 -->
    <!-- <div ref="scanIndicator" class="scan-indicator" v-show="data.scanIndicatorShow"></div> -->
    <div
      ref="scanIndicator"
      class="scan-indicator"
      :style="data.indicatorStyle"
      v-show="data.scanIndicatorShow"
    ></div>
    <div v-if="data.tipShow" class="message-status">
      {{ data.tipMsg }}
    </div>
    <div class="scanner">
      <div class="box">
        <div class="line"></div>
        <div class="angle"></div>
      </div>
    </div>
    <audio id="qrCodeAudio" :src="`${data.baseUrl}`+'/assets/mp3/scanDi.mp3'" style="display:none;"></audio>
  </div>
</template>
<script lang="ts" setup>
import { reactive, onUnmounted, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { BrowserMultiFormatReader } from '@zxing/library'
import DeviceApi from '@/api/home/HomeApi'
import VantCompUtils from '@/utils/VantCompUtils'
import { Toast } from 'vant'
const data = reactive({
  loadingShow: false,
  scanText: '',
  vin: null,
  tipMsg: '识别中...',
  tipShow: false,
  scanIndicatorShow: false,
  active: 1,
  savedBackCameraId: null,
  decodeLoopRunning: false,
  indicatorStyle: reactive({ top: '0', left: '0' }),
  qrCodePosition: null,
  baseUrl: ''
})
const result = ref('')
const router = useRouter()

onMounted(() => {
  data.baseUrl = baseUrl()
  openScan()
})
function baseUrl () {
  console.log('BaseUrl', process.env.VUE_APP_BASEURL)
  return process.env.VUE_APP_BASEURL
}
// 销毁组件
onUnmounted(() => {
  codeReader.reset()
  data.decodeLoopRunning = false
  console.log('销毁组件')
})
// 初始化二维码读取器
const codeReader = new BrowserMultiFormatReader()
// const afterRead = (file) => {
//   getUrl(file.file)
// }
// const fileChange = () => {
//   // 获取dom 对象
//   const file = document.getElementById('avatar')
//   const resultFile = file?.files[0]
//   console.log('resultFile', resultFile)
//   getUrl(resultFile)
//   // let reader = new FileReader();
//   // reader.readAsText(resultFile, "UTF-8");
//   // console.log("reader", reader);
// }
// const getUrl = (file) => {
//   // const qr = new QrCode()
//   const url = getObjectURL(file)
//   console.log('解码url', url)
//   // qr.decodeFromImage(url).then((res) => {
//   //   // 打印结果为 解析出来的 二维码地址
//   //   // alert(`res.data ${res.data}`);
//   //   if (res.data) {
//   //     router.push({
//   //       path: '/TransferAccout',
//   //       query: { codeResult: res.data }
//   //     })
//   //   }
//   //   // alert(`res.data====${res.data}`, res.data);
//   // })
// }

// const getObjectURL = (file) => {
//   let url = null
//   if (window.createObjectURL !== undefined) {
//     // basic
//     url = window.createObjectURL(file)
//   } else if (window.URL !== undefined) {
//     // mozilla(firefox)
//     url = window.URL.createObjectURL(file)
//   } else if (window.webkitURL !== undefined) {
//     // webkit or chrome
//     url = window.webkitURL.createObjectURL(file)
//   }
//   return url
// }
const openScan = async () => {
  // console.log('第一次播放')
  // const qrCodeAudio = document.getElementById('qrCodeAudio') as HTMLAudioElement
  // qrCodeAudio.currentTime = 0 // 重置音频到开始
  // qrCodeAudio.play() // 播放音效
  try {
    data.scanIndicatorShow = false
    data.tipShow = true
    data.tipMsg = '开启中...'
    // 如果已保存后置摄像头的 deviceId，则直接使用
    let selectedDeviceId = data.savedBackCameraId
    console.log('selectedDeviceId', selectedDeviceId)
    // 否则，查找并保存后置摄像头的 deviceId
    if (!selectedDeviceId) {
      codeReader.listVideoInputDevices().then((videoDevices) => {
        console.log('videoDevices', videoDevices)
        selectedDeviceId = videoDevices.find(
          device => device.label.includes('back')
        )?.deviceId ?? videoDevices[0].deviceId
      }).catch((error) => {
        console.error('Error listing video input devices:', error)
      })
      // 保存后置摄像头的 deviceId
      data.savedBackCameraId = selectedDeviceId
    }
    decodeFromInputVideoFunc(selectedDeviceId)

    // // 默认获取第一个摄像头设备id
    // let firstDeviceId = videoInputDevices[0].deviceId
    // // 获取第一个摄像头设备的名称
    // const videoInputDeviceslablestr = JSON.stringify(videoInputDevices[0].label)
    // if (videoInputDevices.length > 1) {
    //   // 判断是否后置摄像头
    //   if (videoInputDeviceslablestr.indexOf('back') > -1) {
    //     firstDeviceId = videoInputDevices[0].deviceId
    //   } else {
    //     firstDeviceId = videoInputDevices[1].deviceId
    //   }
    // }
  } catch (err) {
    data.tipShow = false
    console.error(`失败出错： ${err}`)
  }
}

const decodeFromInputVideoFunc = (deviceId: any) => {
  codeReader.reset() // 重置
  data.tipMsg = '扫描中...'
  data.scanText = ''
  data.decodeLoopRunning = true
  function decodeLoop () {
    if (!data.decodeLoopRunning) return
    codeReader.decodeOnceFromVideoDevice(deviceId, 'video')
      .then(result => {
        data.tipMsg = '识别到二维码...'
        data.tipShow = true
        data.scanText = ''
        const qrCodeAudio = document.getElementById('qrCodeAudio') as HTMLAudioElement
        qrCodeAudio.currentTime = 0 // 重置音频到开始
        qrCodeAudio.play() // 播放音效
        if (result) {
          data.decodeLoopRunning = false
          console.log('扫描结果', result)
          data.scanIndicatorShow = true
          data.scanText = result.getText()
          if (checkScanToActive(data.scanText)) {
            const url = new URL(data.scanText)
            const searchParams = new URLSearchParams(url.search)
            const params = {
              deviceId: searchParams.get('deviceId'),
              channel: searchParams.get('channel')
            }
            handleScanToActive(params)
          }
        }
      })
      .catch(err => {
        data.tipMsg = '识别失败...'
        setTimeout(() => {
          data.tipShow = false
        }, 2000)
        console.error(err)
      })
      .finally(() => {
        if (data.decodeLoopRunning) {
          requestAnimationFrame(decodeLoop)
        }
      })
  }
  decodeLoop()
  data.decodeLoopRunning = true
}
function checkScanToActive (qrCodeData: any) {
  console.log('CHECK SCAN DATA:', qrCodeData)
  // 格式爲：https://aaaaa.com/healthstation/favi.ico?channel=cnprs&deviceId=P20206489566
  const url = new URL(qrCodeData)
  const searchParams = new URLSearchParams(url.search)

  const deviceId = searchParams.get('deviceId') || ''
  const channel = searchParams.get('channel') || ''
  // const channel = searchParams.get('channel') || '';
  if (deviceId === '' || channel === '') {
    VantCompUtils.costomCountdownToastAndRedirect('当前条码缺少激活参数', '/scanResult', 1, 'fail', { type: 'fail' })
    return false
  }
  return true
}
const handleScanToActive = (params: any) => {
  const headers = {
    token: localStorage.getItem('token')
  }
  DeviceApi.scanToActive(params, headers).then((result: any) => {
    console.log('scan result', result)
    if (result.code === 1 || result.code === '1') {
      Toast.success('设备激活成功')
      VantCompUtils.costomCountdownToastAndRedirect(result.message, '/scanResult', 1, 'fail', { type: 'success' })
    } else {
      Toast.fail('设备激活失敗')
      VantCompUtils.costomCountdownToastAndRedirect(result.message, '/scanResult', 1, 'fail', { type: 'fail' })
    }
  }).catch((error: any) => {
    console.error(error)
    Toast.success('设备激活失敗')
    VantCompUtils.costomCountdownToastAndRedirect(error, '/home', 3, 'fail')
    return false
  })
}
// function getQrCodeCorners (qrResult : any) {
//   // 获取二维码定位点
//   const qrCodeCorners = qrResult.resultPoints

//   // 计算二维码中心点坐标
//   const qrCodeCenter = {
//     x: Math.round((qrCodeCorners[0].x + qrCodeCorners[2].x) / 2),
//     y: Math.round((qrCodeCorners[0].y + qrCodeCorners[2].y) / 2) // 可以选择不同对角线的点计算中心
//   }

//   // 假设videoElement是您的视频元素，用于获取视频流尺寸和缩放比例
//   const videoElement = document.querySelector('video')

//   // 计算二维码在视频流中的实际坐标
//   const videoRect = videoElement.getBoundingClientRect()
//   const videoWidth = videoElement.videoWidth
//   const videoHeight = videoElement.videoHeight
//   const scale = videoWidth / videoRect.width

//   const qrCodePositionInVideo = {
//     x: qrCodeCenter.x * scale,
//     y: qrCodeCenter.y * scale
//   }
//   updateIndicatorPosition(qrCodePositionInVideo)
// }
// function updateIndicatorPosition (qrCodePositionInVideo: { x: number; y: number }) {
//   data.indicatorStyle.left = `${qrCodePositionInVideo.x}px`
//   data.indicatorStyle.top = `${qrCodePositionInVideo.y}px`
// }
</script>
<style scoped  lang="scss">
// 扫码组件
.scan-index-bar {
  background-image: linear-gradient(-45deg, #42a5ff, #59cfff);
}
.scanVideo {
  height: 100vh;
  width: 100vw;
}
.pageScan {
  overflow-y: hidden;
  background-color: #363636;
  width: 100vw;
  height: 100vh;
  position: relative;
  /* :deep(.van-uploader) {
     z-index: 99;
    } */
  .vanFileInput {
    display: inline-block;
    position: absolute;
    right: 10px;
    color: white;
    top: 10px;
    font-size: 16px;
    z-index: 99;
  }
  .fileinput-button {
    position: absolute;
    display: inline-block;
    overflow: hidden;
    z-index: 99;
    color: white;
    right: 8px;
    top: 8px;
    display: flex;
    align-items: center;
    input {
      position: absolute;
      right: 0px;
      top: 0px;
      opacity: 0;
    }
    span {
      font-size: 16px;
    }
  }
}
.scan-indicator {
    position: absolute;
    top: 70%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: green;
    opacity: 0.9;
    pointer-events: none; /* 避免影响用户交互 */
    z-index: 99;
}
.scanner {
  background-size: 3rem 3rem;
  background-position: -1rem -1rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);

  .box {
    width: 75vw;
    height: 75vw;
    max-height: 75vh;
    max-width: 75vh;
    position: relative;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
    border: 0.1rem solid rgba(0, 255, 51, 0.2);

    .line {
      height: calc(100% - 2px);
      width: 100%;
      background: linear-gradient(180deg, rgba(0, 255, 51, 0) 43%, #00ff33 211%);
      border-bottom: 3px solid #00ff33;
      transform: translateY(-100%);
      animation: radar-beam 2s infinite;
      animation-timing-function: cubic-bezier(0.53, 0, 0.43, 0.99);
      animation-delay: 1.4s;
    }

    &:after,
    &:before,
    .angle:after,
    .angle:before {
      content: "";
      display: block;
      position: absolute;
      width: 3vw;
      height: 3vw;
      border: 0.2rem solid transparent;
    }

    &:after,
    &:before {
      top: 0;
      border-top-color: #00ff33;
    }

    .angle:after,
    .angle:before {
      bottom: 0;
      border-bottom-color: #00ff33;
    }

    &:before,
    .angle:before {
      left: 0;
      border-left-color: #00ff33;
    }

    &:after,
    .angle:after {
      right: 0;
      border-right-color: #00ff33;
    }
  }
}
@keyframes radar-beam {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(0);
  }
}
.result {
  position: fixed;
  top: 20px;
  left: 20px;
  width: 50px;
  height: 50px;
  border-radius: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
}

.message-status {
  position: absolute;
  bottom: 8%; /* 调整为所需距离底部的距离 */
  left: 50%; /* 左侧位置居中 */
  transform: translateX(-50%); /* 水平居中 */
  width: 60%; /* 宽度占比 60% */
  background-color: rgba(234, 234, 234, 0.7); /* 灰色半透明背景 */
  color: #fff; /* 白色文字 */
  font-size: 14px; /* 文字大小 */
  line-height: 1.5; /* 行高 */
  padding: 0.4rem; /* 上下内边距 */
  border-radius: 16px; /* 较大的圆角 */
  box-shadow: 0 ¾rem 1rem rgba(0, 0, 0, 0.1); /* 添加阴影效果，使其看起来更像悬浮 */
  z-index: 99; /* 确保在视频之上 */
  text-align: center; /* 文本居中 */
  overflow-y: auto;
}
</style>
