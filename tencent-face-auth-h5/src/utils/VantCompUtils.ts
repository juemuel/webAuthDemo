import router from '@/router'
import { Dialog, Toast } from 'vant'

/**
 * 通用的ts类组件（主要是vant）
 */
export default {
  toastMessage (message: string) {
    Toast.fail({
      message: message
    })
  },
  costomShowToast (message: string, type: string) {
    if (type === 'success') {
      Toast.success({
        message: message
      })
    } else {
      Toast.fail({
        message: message
      })
    }
  },
  customShowDialog (message: string, onConfirm: () => void, onCancel: () => void) {
    Dialog.confirm({
      title: '提示',
      message: message,
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    }).then(() => {
      onConfirm()
    }).catch(() => {
      onCancel()
    })
  },
  costomCountdownToastAndRedirect (
    initialMessage: string,
    redirectUrl: string,
    countdownDuration = 3,
    type: 'loading' | 'fail' | 'success' = 'loading',
    options?: any // 添加可选的路由跳转参数对象
  ) {
    let countdown = countdownDuration

    const createToast = (message: string) => {
      switch (type) {
        case 'fail':
          return Toast.fail(message)
        case 'success':
          return Toast.success(message)
        default:
          return Toast.loading(message)
      }
    }

    const intervalId = setInterval(() => {
      if (countdown <= 0) {
        clearInterval(intervalId) // 停止倒计时
        // window.location.href = redirectUrl // 跳转到指定页面
        router.push({ path: redirectUrl, query: options }) // 使用传入的options对象（如果存在）
      } else {
        countdown -= 1
        createToast(`${initialMessage} ${countdown}s...`)
      }
    }, 1000)
  }
}
