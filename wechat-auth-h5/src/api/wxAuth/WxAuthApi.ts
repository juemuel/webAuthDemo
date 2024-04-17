import http from '../http'
import qs from 'qs'

export default {
  getOpenIdByCode: async function (params: any): Promise<any> {
    // 改写成自己项目的API地址 与 接口
    const url = process.env.VUE_APP_YH_API + '/wxAuth/getOpenId'
    return await http.get(url, params, {})
  }
}
