import http from '../http'
import qs from 'qs'

/**
 * 导出函数
 */
export default {

  registerMember: async function (params: any): Promise<any> {
    const url = process.env.VUE_APP_YH_API + '/iotUser/register'
    return await http.post(url, params, {})
  }
}
