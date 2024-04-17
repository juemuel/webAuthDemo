/**
 * 正则表达式工具类模块
 *
 * @author : fankey 2022-02-03
 */

export default {
  /**
   * 正则校验手机方法
   */
  checkCellPhone: function (phoneNumber: string) {
    // 校验手机号的正则表达式
    const regExp = /^1(3|4|5|6|7|8|9)\d{9}$/
    if (!regExp.test(phoneNumber)) {
      return false
    }
    return true
  },

  /**
   * 正则表达式校验帐号规则
   * 1、大小写英文开头
   * 2、中间可以包含下划线、@、以及点
   * 3、长度大于6位，小于32位
   */
  checkAccount: function (account: string) {
    const regExp = /^[a-zA-Z][0-9a-zA-Z_.@]{4,32}$/g
    if (!regExp.test(account)) {
      return false
    }
    return true
  },

  /**
   * 正则表达式校验邮箱
   */
  checkEmail: function (email: string) {
    // 校验邮箱的正则表达式
    const regExp = /^([a-zA-Z0-9]+[_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
    if (!regExp.test(email)) {
      return false
    }
    return true
  },

  checkCertNo: function (certNo: string) {
    // 校验邮箱的正则表达式
    const regExp = /^\d{6}((((((19|20)\d{2})(0[13-9]|1[012])(0[1-9]|[12]\d|30))|(((19|20)\d{2})(0[13578]|1[02])31)|((19|20)\d{2})02(0[1-9]|1\d|2[0-8])|((((19|20)([13579][26]|[2468][048]|0[48]))|(2000))0229))\d{3})|((((\d{2})(0[13-9]|1[012])(0[1-9]|[12]\d|30))|((\d{2})(0[13578]|1[02])31)|((\d{2})02(0[1-9]|1\d|2[0-8]))|(([13579][26]|[2468][048]|0[048])0229))\d{2}))(\d|X|x)$/
    if (!regExp.test(certNo)) {
      return false
    }
    return true
  },
}
