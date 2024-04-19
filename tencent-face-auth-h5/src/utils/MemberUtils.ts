/**
 * 用户工具类
 *
 * @author : fankey 2022-02-03
 */

export default {

  /**
   * 获取证件号配置
   */
  getCertTypeOptionList: function (str: string): any {
    const certTypeOptionArr = [{
      text: '身份证',
      value: '1'
    }, {
      text: '护照',
      value: '4'
    }, {
      text: '港澳通行证',
      value: '5'
    }, {
      text: '台胞证',
      value: '6'
    }, {
      text: '其他',
      value: '7'
    }]

    const strArray = str.split(',')
    const result = []
    for (const item of strArray) {
      const option = certTypeOptionArr.find(x => x.value === item)
      if (option) {
        result.push(option)
      }
    }
    return result
  },

  /**
   * 获取关系配置
   */
  getRelationTypeOptionList: function (str: string): any {
    const relationTypeOptionArr = [{
      text: '本人',
      value: '0'
    }, {
      text: '父母',
      value: '1'
    }, {
      text: '配偶',
      value: '2'
    }, {
      text: '子女',
      value: '3'
    }, {
      text: '其他',
      value: '8'
    }]

    const strArray = str.split(',')
    const result = []
    for (const item of strArray) {
      const option = relationTypeOptionArr.find(x => x.value === item)
      if (option) {
        result.push(option)
      }
    }
    return result
  },

  /**
   * 根据性别数值获取对一个的标题
   */
  getSexTitle: function (val: number) {
    switch (val) {
      case 1:
        return '男'
      case 2:
        return '女'
      default:
        return '保密'
    }
  },

  /**
   * 根据婚姻状态获取对应数值
   */
  getMarryTitle: function (val: number) {
    switch (val) {
      case 1:
        return '已婚'
      case 2:
        return '未婚'
      default:
        return '保密'
    }
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
  }
}
