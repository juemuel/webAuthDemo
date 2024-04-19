/**
 * 登录相关接口模块
 *
 * @author : fankey 2022-02-02
 */

import http from '../http'
import qs from 'qs'

/**
 * 导出函数
 */
export default {
  /**
   * 通过openId登录
   */
  loginByWeChatOpenId: async function (params: any): Promise<any> {
    const url = process.env.VUE_APP_YH_API + '/iotUser/login'
    return await http.get(url, params, {})
  },
  /**
   * 账号密码登录
   */
  loginByAccount: async function (params: any, headerData:any): Promise<any> {
    const url = process.env.VUE_APP_YH_API + '/cup/login/account'
    return await http.post(url, qs.stringify(params), headerData)
  },

  /**
   * SSO免登陆接口
   */
  loginBySSO: async function (params: any): Promise<any> {
    const url = process.env.VUE_APP_YH_API + '/cup/login/sso'
    return await http.get(url, params, {})
  },
  /**
   * 获取常见问题列表
   */
  getHelpListApi: async function (params: any): Promise<any> {
    const url = process.env.VUE_APP_YH_API + '/cup/project/getCupHelpList'
    return await http.get(url, params, {})
  },

  /**
   * 获取微信OpenId接口
   */
  getWxOpenIdApi: async function (params: any): Promise<any> {
    // 使用接口地址，如https://apitest.XXXXX.com/v2；一般使用生产地址
    const url = 'https://接口地址/v2/wxAuth/getOpenId'
    return await http.get(url, params, {})
  }

}
