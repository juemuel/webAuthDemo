import http from '../http'
import qs from 'qs'

export default {

  /**
   * 根据项目标识获取项目配置信息接口
   */
  getReportTypeList: async function (params: any, headers: any): Promise<any> {
    const url = process.env.VUE_APP_YH_API + '/iotUserReport/reportTypeList'
    return await http.get(url, params, headers)
  },
  getReportDetail: async function (params: any, headers: any): Promise<any> {
    const url = process.env.VUE_APP_YH_API + '/iotUserReport/reportDetail'
    return await http.get(url, params, headers)
  }
}
