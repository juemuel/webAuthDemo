/**
 * 登录相关接口模块
 *
 * @author : fankey 2022-02-02
 */

import http from '../http'
import qs from 'qs'

export default {
  /**
   * 激活設備（已舍弃）
   */
  activeByDeviceId: async function (params: any, headers: any): Promise<any> {
    const url = process.env.VUE_APP_YH_API + '/miniTreeData/active'
    return await http.post(url, params, headers)
  },
  /**
 * 激活設備（已舍弃）
 */
  scanToActive: async function (params: any, headers: any): Promise<any> {
    const url = process.env.VUE_APP_YH_API + '/iotUser/scan'
    return await http.post(url, params, headers)
  }
}
