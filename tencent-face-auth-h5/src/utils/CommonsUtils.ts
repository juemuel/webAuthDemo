import EnvUtils from './EnvUtils'

/**
 * 通用工具类模块
 *
 * @author : fankey 2021-09-21
 */
export default {
  /**
   * debug方法
   */
  debug: function (value:any) {
    console.group('进入程序调试函数......')
    console.log('Debug输出数据: ', value)
    console.groupEnd()
  },

  /**
   * 检测是否已经登录
   */
  checkUserLogin: function () {
    const isLocalDevelopment = process.env.NODE_ENV === '"development"'
    if (isLocalDevelopment) {
      console.log('开发环境，使用临时token')
      localStorage.setItem('token', 'OVpVYkJBdkJNdStYVXdFeUtUR2xoYWpja01Kd0wwZnBleWJOUUJKTFFEcE1vemdlcjFVWDRLaHF3SXFBZklPNQ==') // 临时设置一个
      localStorage.setItem('userName', '测试用户')
      return true
    }
    const token = localStorage.getItem('token')
    if (token === null || token === '') {
      return false
    }
    return true
  },

  /**
   * 检测是否token失效
   * @returns
   */
  checkApiTokenFailure: function (msg: string) {
    if (msg === 'token令牌不存在或已过期' || msg === 'token令牌不能为空') {
      // 判断localStorage中的token是否存在
      if (localStorage.getItem('token')) {
        // 手动删除localStorage中的token
        localStorage.removeItem('token')
      }
      return true
    } else return false
  },

  /**
   * 获取返回前一个列表页面参数
   */
  getPrePageRouterInfo: function () {
    let queryParams = {}
    const preQueryJsonStr = localStorage.getItem('preQuery')
    if (preQueryJsonStr !== undefined && preQueryJsonStr !== null && preQueryJsonStr !== '') {
      queryParams = JSON.parse(preQueryJsonStr)
    }
    let prePath = localStorage.getItem('prePath')
    if (prePath === undefined || prePath === null || prePath === '') {
      prePath = '/home'
    }
    const result = {
      path: prePath,
      query: queryParams
    }
    return result
  },

  /**
   * 时间日期转换
   * @param date 当前时间，new Date() 格式
   * @param format 需要转换的时间格式字符串
   * @description format 字符串随意，如 `YYYY-mm、YYYY-mm-dd`
   * @description format "YYYY-mm-dd HH:MM:SS
   * @returns 返回拼接后的时间字符串
   */
  formatDate: function (date: Date, format: string): string {
    const opt: { [key: string]: string } = {
      'Y+': date.getFullYear().toString(), // 年
      'm+': (date.getMonth() + 1).toString(), // 月(月份从0开始，要+1)
      'd+': date.getDate().toString(), // 日
      'H+': date.getHours().toString(), // 时
      'M+': date.getMinutes().toString(), // 分
      'S+': date.getSeconds().toString()
    }
    for (const k in opt) {
      const r = new RegExp('(' + k + ')').exec(format)
      // 若输入的长度不为1，则前面补零
      if (r) format = format.replace(r[1], RegExp.$1.length === 1 ? opt[k] : opt[k].padStart(RegExp.$1.length, '0'))
    }
    return format
  },

  /**
   * 生成自定义的uuid
   */
  getDiyUuid: function (len: number, radix: number) {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
    const uuid = []
    let i
    radix = radix || chars.length

    if (len) {
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix]
    } else { // 生成标准长度的UUID格式（32位）
      let r
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
      uuid[14] = '4'
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random() * 16
          uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r]
        }
      }
    }

    return uuid.join('')
  },

  /**
   * 检测浏览器是否为pc端
   */
  isPC: function () {
    const userAgentInfo = navigator.userAgent
    const Agents = [
      'Android',
      'iPhone',
      'SymbianOS',
      'Windows Phone',
      'iPad',
      'iPod'
    ]
    let flag = true
    for (let v = 0; v < Agents.length; v++) {
      if (userAgentInfo.indexOf(Agents[v]) > 0) {
        flag = false
        break
      }
    }
    return flag
  },

  /**
   * 脱敏处理函数（通用版）
   *
   * @param str 字符串
   * @param begin 开始位置,起始保留长度，从0开始
   * @param end 结束位置,结束保留长度，到str.length结束
   * @returns 结果
   */
  desensitizedStrCommon (str: string, begin:number, end:number) {
    if (str === undefined || str === '') {
      return ''
    }
    if (!str && (begin + end) >= str.length) {
      return ''
    }
    // 长度小于6或4，总长度小于8或10
    if (begin >= str.length || end >= str.length || (begin + end) >= str.length) {
      return str // 如果起始位置或结束位置超出字符串长度，则直接返回原始字符串
    }
    const leftStr = str.substring(0, begin)
    const rightStr = str.substring(str.length - end, str.length)

    let strCon = ''
    for (let i = 0; i < str.length - end - begin; i++) {
      strCon += '*'
    }
    return leftStr + strCon + rightStr
  },

  /**
   * 手机号脱敏
   *
   * @param mobileStr 手机号脱敏
   */
  mobileDesensitization (mobileStr: string) {
    return this.desensitizedStrCommon(mobileStr, 3, 4)
  },

  /**
   * 证件号脱敏
   * @param mobileStr 证件号脱敏
   */
  certNoDesensitization (certNoStr: string) {
    if (certNoStr === undefined || certNoStr === '') {
      return ''
    }
    if (certNoStr.length >= 18) {
      return this.desensitizedStrCommon(certNoStr, 6, 4)
    } else if (certNoStr.length >= 8) {
      return this.desensitizedStrCommon(certNoStr, 3, 3)
    } else return certNoStr
  },

  /**
   * 根据性别数值获取对应的标题
   */
  getSexTitle: function (val: number) {
    switch (val) {
      case 1:
        return '男'
      case 2:
        return '女'
      default:
        return ''
    }
  },

  /**
   * 根据婚姻状态获取对应的标题
   */
  getMarryTitle: function (val: number) {
    switch (val) {
      case 1:
        return '已婚'
      case 2:
        return '未婚'
      default:
        return ''
    }
  },

  /**
   * 根据证件类型编号获取对应的标题
   */
  getCertTypeTitle: function (val: number) {
    switch (val) {
      case 1:
        return '身份证'
      case 4:
        return '护照'
      case 5:
        return '港澳通行证'
      case 6:
        return '台胞证'
      default:
        return '其他'
    }
  },

  /**
   * 根据亲属关系获取对应的标题
   */
  getRelationTypeTitle: function (val: number) {
    switch (val) {
      case 0:
        return '本人'
      case 1:
        return '父母'
      case 2:
        return '配偶'
      case 3:
        return '子女'
      default:
        return '其他'
    }
  },
  /**
   * 根据亲属关系获取对应的颜色
   */
  getRelationTypeColor: function (val: number) {
    switch (val) {
      case 0:
        return '#1989fa' // rgb(25,137,250)默认的primary颜色，'#1989fa'
      case 1:
        return '#71D2B9'
      case 2:
        return '#71D2B9'
      case 3:
        return '#71D2B9'
      default:
        return '#71D2B9'
    }
  },

  /**
   * 根据类型获取预约页面
   * 1=>就医 ; 2=>体检 ; 3=>洁牙; 4=>实物
   */
  getAppointByType: function (serviceType:number) {
    let page = ''
    switch (serviceType) {
      case 1:
        page = 'medical'
        break
      case 2:
        page = 'physical'
        break
      case 3:
        page = 'teeth'
        break
      case 4:
        page = 'goods'
        break
      case 5:
        page = 'disease'
        break
      case 6:
        page = 'telConsult'
        break
      default:
        page = ''
        break
    }
    return page
  },

  /**
   * 格式化价格，保留2位小数
   */
  formatPrice: function (num: number): string {
    if (num <= 0) {
      return '0.00'
    }
    return num.toFixed(2)
  },

  /**
   * 检测密码强度
   *
   * 强度说明：
   * level => 0 : 密码长度小于6位
   * level => 1 : 纯数字等级
   * level => 2 : 数字 + 英文小写字母
   * level => 3 : 数字 + 英文大写字母 + 英文小写字母
   * level => 4 : 数字 + 英文大写字母 + 英文小写字母 + 特殊符号（_ - . @）
   */
  checkPwdLevel: function (str: string) {
    let Lv = 0
    if (str.length < 6) {
      return Lv
    }
    if (/[0-9]/.test(str)) {
      Lv++
    }
    if (/[a-z]/.test(str)) {
      Lv++
    }
    if (/[A-Z]/.test(str)) {
      Lv++
    }
    if (/[.|-|_|@]/.test(str)) {
      Lv++
    }
    return Lv
  }
}
