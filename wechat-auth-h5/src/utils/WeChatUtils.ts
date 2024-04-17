import WxAuthApi from '@/api/wxAuth/WxAuthApi'
import EnvUtils from './EnvUtils'
import StringUtils from './StringUtils'
import UrlUtils from './UrlUtils'
import VantCompUtils from './VantCompUtils'
import LoginApi from '@/api/login/LoginApi'
import router from '@/router'

export default {
  getWxCode () {
    console.log('正在获取WeChatCode！')
    if (!EnvUtils.isWeChat()) {
      VantCompUtils.costomShowToast('请在微信客户端打开！', 'fail')
      return
    }
    if (EnvUtils.isWeChat()) {
      // 截取地址中的code，如果没有code就去微信授权，如果已经获取到code了就直接把code传给后台获取openId  redirect_uri 是你的站点域名，一定要encodeURIComponent
      // Vue中，const code = route.query.code || null
      const code = UrlUtils.getUrlParam('code')
      if (StringUtils.stringIsEmpty(code)) {
        // redirect_uri是授权成功后，跳转的url地址，微信会帮我们跳转到该链接，并且通过？的形式拼接code，这里需要用encodeURIComponent对链接进行处理。
        // 由于微信后台对redirect_uri的域名配置时有限的，我们先跳接口，让接口再返回；
        let back_uri = ''
        if (process.env.NODE_ENV === 'production') {
          back_uri = '你的生产环境SSO页面Url'
        } else {
          back_uri = '你的测试环境SSO页面Url'
        }
        window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=你的APPID&redirect_uri=' + encodeURIComponent('https://接口域名地址/v2/wxAuth/getWxCode?url=' + back_uri) + '&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect'
        // 如果配置参数一一对应，那么此时已经通过回调地址刷新页面后，你就会再地址栏中看到code了。
      }
    }
  },
  async getOpenIdByCode (code: string): Promise<{ success: boolean; message?: string }> {
    if (!EnvUtils.isWeChat()) {
      VantCompUtils.costomShowToast('请在微信客户端打开！', 'fail')
      return { success: false, message: '请在微信客户端打开！' }
    }

    try {
      const response = await WxAuthApi.getOpenIdByCode({ code })
      const data = response.data

      if ('openid' in data && 'access_token' in data) {
        localStorage.setItem('openid', data.openid)
        localStorage.setItem('access_token', data.access_token)
        return { success: true, message: 'OpenId 获取成功' }
      } else {
        console.error('OpenID 未返回:', data)
        return { success: false, message: 'OpenID 未返回' }
      }
    } catch (error) {
      console.error('OpenID 获取失败:', error)
      return { success: false, message: `OpenID 获取失败: ${error}` }
    }
  },
  // 获取tokne并登录到平台（用openId）
  async loginWithWeChatOpenId (): Promise<void> {
    return LoginApi.loginByWeChatOpenId({ openId: localStorage.getItem('openid') })
      .then((res) => {
        if (res.code === 0 || res.code === '0') {
          VantCompUtils.costomShowToast('请注册用户', 'fail')
          console.log('3.1 未注册，进入注册页')
          router.replace('/register')
        } else {
          console.log('3.2 已注册，进入设备页')
          localStorage.setItem('token', res.data.token)
          localStorage.setItem('userName', res.data.userName)
          VantCompUtils.costomShowToast('登陆成功', 'success')
          router.replace('/home')
        }
      })
      .catch((error) => {
        console.error('登录失败2:', error)
        VantCompUtils.costomShowToast('登录失败，请稍后再试', 'fail')
      })
  },
  // 检验是否授权
  checkWxAuth () {
    if (!EnvUtils.isWeChat()) {
      VantCompUtils.costomShowToast('请在微信客户端打开！', 'fail')
      return false
    }
    const isWeChat = EnvUtils.isWeChat()
    if (isWeChat) {
      const openid = localStorage.getItem('openid')
      const access_token = localStorage.getItem('access_token')
      if (openid === null || openid === '' || access_token === null || access_token === '') {
        return false
      } else {
        return true
      }
    }
  }
}
